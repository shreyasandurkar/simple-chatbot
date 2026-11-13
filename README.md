# Ask Innovate

A lightweight conversational search experience for Innovate@BU resources. It runs entirely in the browser, needs no API key or backend, and sends visitors directly to curated Innovate@BU pages.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server.

## Deploy with GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the site on pushes to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions** if it is not already selected.

The search catalog lives in `app.js`. Update resource links and descriptions there as the Innovate@BU site changes.
