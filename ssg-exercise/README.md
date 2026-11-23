
# CSE 134B HW5 - Static Site Generation

## Overview

This exercise uses Eleventy (11ty) to generate two HTML pages from reusable templates.

The Home and About pages were adapted from my existing CSE 134B portfolio.

Both pages include the same shared footer component.

## Project Structure

- `src/index.njk` - Home page template
- `src/about.njk` - About page template
- `src/_includes/footer.njk` - Shared footer
- `eleventy.config.cjs` - Eleventy configuration
- `package.json` - Dependencies and build scripts
- `_site/` - Generated HTML output

## Installation

Open a terminal inside the `ssg-exercise` folder.

```bash
npm install
```

## Build

Generate the HTML pages:

```bash
npm run build
```

The generated files are written to the `_site` directory.

## Local Preview

Start the development server:

```bash
npm run start
```

Open the following pages:

- Home: http://localhost:8080/
- About: http://localhost:8080/about/

## Shared Footer Verification

Both pages use:

`{% include "footer.njk" %}`

To verify the shared section:

1. Edit `src/_includes/footer.njk`.
2. Change the footer text.
3. Run `npm run build`.
4. Refresh both generated pages.
5. Confirm that the updated footer appears on both pages.

This demonstrates how a single shared template can update multiple pages without manually editing each HTML file.


## Homework 5 - Web Components and APIs

### Random Facts Web Component

This portfolio includes a custom `<random-facts>` Web Component built using JavaScript and the DOM API.

The component initially displays five sample facts.

Visitors can click Previous Fact or Next Fact to change the displayed fact without reloading the page.

The external buttons update the `fact-index` attribute. The component observes this attribute using `attributeChangedCallback()` and updates the displayed content and status.

### Live API Integration

The Get Live Fact button requests data from:

https://uselessfacts.jsph.pl/api/v2/facts/random?language=en

The component uses `fetch()` to request JSON and displays the `text` field returned by the API.

While the request is pending, a loading message appears and the request button is disabled.

If the request succeeds, the component displays the new fact and a success message.

If the request fails, an accessible error message appears. The previously displayed fact remains available, and visitors can retry without reloading the page.

### Theme and Preferences

The component supports the portfolio's Light and Dark themes using CSS custom properties.

Visitors can enable or disable Compact Mode to change the component's layout.

The preference is saved using `localStorage` and restored after reloading the page.

If browser storage is unavailable, the component still allows visitors to change Compact Mode during the current session.

### Accessibility and Fallback

The component uses semantic HTML buttons and an accessible status message with `aria-live`.

Buttons support keyboard navigation and visible focus indicators.

When JavaScript is disabled, the portfolio's main HTML content and navigation remain available. The interactive widget requires JavaScript to operate.

### Static Site Generation

The `ssg-exercise` directory contains a separate Eleventy project.

Eleventy generates Home and About pages using Nunjucks templates.

Both pages include the same shared footer from `src/_includes/footer.njk`.

Editing the shared footer and rebuilding updates both generated HTML pages.

See `ssg-exercise/README.md` for installation, build, and preview instructions.
