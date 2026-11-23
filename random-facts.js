
class RandomFacts extends HTMLElement {
  constructor() {
    super();

    this.facts = [
      "Honey never spoils.",
      "Octopuses have three hearts.",
      "Bananas are berries, but strawberries are not.",
      "A day on Venus is longer than its year.",
      "Sharks existed before trees."
    ];

    this.currentIndex = 0;
  }

  connectedCallback() {
    this.innerHTML = `
      <section class="facts-panel">
        <h2>Random Facts</h2>
        <p class="fact-text"></p>
        <p class="fact-status" role="status" aria-live="polite"></p>
      </section>
    `;

    this.factText = this.querySelector(".fact-text");
    this.factStatus = this.querySelector(".fact-status");

    this.showFact();

    // The external buttons will control this component.
  }

  showFact() {
    this.factText.textContent = this.facts[this.currentIndex];
    this.factStatus.textContent =
      `Fact ${this.currentIndex + 1} of ${this.facts.length}`;
  }

  nextFact() {
    this.currentIndex =
      (this.currentIndex + 1) % this.facts.length;
    this.showFact();
  }

  previousFact() {
    this.currentIndex =
      (this.currentIndex - 1 + this.facts.length) %
      this.facts.length;
    this.showFact();
  }

  async loadLiveFact() {
    // Prevent multiple requests at the same time.
    if (this.loading) return;

    this.loading = true;

    const liveButton = document.querySelector("#live-fact");
    if (liveButton) liveButton.disabled = true;

    this.factStatus.textContent = "Loading a new fact...";

    try {
      const response = await fetch(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
      );

      // Check the HTTP response status.
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      // Parse the JSON response.
      const data = await response.json();

      // Validate the response.
      if (
        typeof data.text !== "string" ||
        data.text.trim() === ""
      ) {
        throw new Error("Invalid fact data received.");
      }

      // Update the DOM without reloading the page.
      this.factText.textContent = data.text;
      this.factStatus.textContent =
        "Live fact loaded successfully!";

    } catch (error) {
      console.error("Failed to load live fact:", error);

      this.factStatus.textContent =
        "Unable to load a fact. Please check your connection and try again.";
    } finally {
      this.loading = false;

      if (liveButton) liveButton.disabled = false;
    }
  }


 static get observedAttributes() {
  return ["fact-index", "compact"];
}


attributeChangedCallback(name, oldValue, newValue) {
  if (oldValue === newValue) return;

  if (name === "fact-index") {
    const index = Number(newValue);

    if (
      Number.isInteger(index) &&
      index >= 0 &&
      index < this.facts.length
    ) {
      this.currentIndex = index;

      if (this.factText && this.factStatus) {
        this.showFact();
      }
    }
  }

  if (name === "compact") {
    const isCompact = newValue !== null;

    const panel = this.querySelector(".facts-panel");

    if (panel) {
      panel.classList.toggle("compact", isCompact);
    }
  }
}

}

customElements.define("random-facts", RandomFacts);
