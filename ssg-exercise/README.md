
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
