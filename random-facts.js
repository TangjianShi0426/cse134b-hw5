
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
    this.loading = false;
    this.connected = false;
  }

  static get observedAttributes() {
    return ["fact-index", "compact"];
  }

  connectedCallback() {
    if (this.connected) return;
    this.connected = true;

    // Create the component interface using DOM methods.
    const panel = document.createElement("section");
    panel.className = "facts-panel";

    const heading = document.createElement("h2");
    heading.textContent = "Random Facts";

    this.factText = document.createElement("p");
    this.factText.className = "fact-text";

    this.factStatus = document.createElement("p");
    this.factStatus.className = "fact-status";
    this.factStatus.setAttribute("role", "status");
    this.factStatus.setAttribute("aria-live", "polite");
    this.factStatus.setAttribute("aria-atomic", "true");

    // Internal controls required for Part 1 and Part 2.
    const controls = document.createElement("div");
    controls.className = "facts-controls";

    this.internalNextButton = document.createElement("button");
    this.internalNextButton.type = "button";
    this.internalNextButton.textContent = "Next Fact (Inside Component)";

    this.internalLiveButton = document.createElement("button");
    this.internalLiveButton.type = "button";
    this.internalLiveButton.textContent = "Get Live Fact (Inside Component)";

    controls.append(
      this.internalNextButton,
      this.internalLiveButton
    );

    panel.append(
      heading,
      this.factText,
      this.factStatus,
      controls
    );

    this.appendChild(panel);

    // Apply the initial compact attribute.
    panel.classList.toggle(
      "compact",
      this.hasAttribute("compact")
    );

    // Read the initial observed fact index.
    const initialIndex = Number(this.getAttribute("fact-index"));

    if (
      this.hasAttribute("fact-index") &&
      Number.isInteger(initialIndex) &&
      initialIndex >= 0 &&
      initialIndex < this.facts.length
    ) {
      this.currentIndex = initialIndex;
    }

    this.showFact();

    // Internal DOM interaction.
    this.internalNextButton.addEventListener("click", () => {
      this.nextFact();
    });

    // Internal API request control.
    this.internalLiveButton.addEventListener("click", () => {
      this.loadLiveFact();
    });
  }

  showFact() {
    if (!this.factText || !this.factStatus) return;

    this.factText.textContent = this.facts[this.currentIndex];

    this.factStatus.textContent =
      `Fact ${this.currentIndex + 1} of ${this.facts.length}`;
  }

  nextFact() {
    this.currentIndex =
      (this.currentIndex + 1) % this.facts.length;

    this.setAttribute("fact-index", String(this.currentIndex));
    this.showFact();
  }

  previousFact() {
    this.currentIndex =
      (this.currentIndex - 1 + this.facts.length) %
      this.facts.length;

    this.setAttribute("fact-index", String(this.currentIndex));
    this.showFact();
  }

  async loadLiveFact() {
    if (this.loading || !this.factStatus) return;

    this.loading = true;

    const externalLiveButton = document.querySelector("#live-fact");

    if (externalLiveButton) {
      externalLiveButton.disabled = true;
    }

    if (this.internalLiveButton) {
      this.internalLiveButton.disabled = true;
    }

    this.factStatus.textContent = "Loading a new fact...";

    try {
      const response = await fetch(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
      );

      // Defensive HTTP status validation.
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      // JSON parsing errors are caught below.
      const data = await response.json();

      if (
        !data ||
        typeof data.text !== "string" ||
        data.text.trim().length === 0
      ) {
        throw new Error("Invalid API response.");
      }

      // Use textContent to render remote text safely.
      this.factText.textContent = data.text;

      this.factStatus.textContent =
        "Live fact loaded successfully!";

    } catch (error) {
      console.error("Failed to load live fact:", error);

      // Keep the previous fact visible.
      this.factStatus.textContent =
        "Unable to load a fact. Please check your connection and try again.";

    } finally {
      this.loading = false;

      if (externalLiveButton) {
        externalLiveButton.disabled = false;
      }

      if (this.internalLiveButton) {
        this.internalLiveButton.disabled = false;
      }
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "fact-index") {
      const index = Number(newValue);

      if (
        newValue !== null &&
        Number.isInteger(index) &&
        index >= 0 &&
        index < this.facts.length
      ) {
        this.currentIndex = index;
        this.showFact();
      }
    }

    if (name === "compact") {
      const panel = this.querySelector(".facts-panel");

      if (panel) {
        panel.classList.toggle(
          "compact",
          this.hasAttribute("compact")
        );
      }
    }
  }
}

customElements.define("random-facts", RandomFacts);
