# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for "Rada Stary Mokotów" — a civic initiative to establish a neighborhood council in Stary Mokotów, Warsaw. The site collects petition signatures, displays FAQ (loaded from Google Sheets with fallback), and handles newsletter signups via Google Apps Script. Hosted on GitHub Pages at radastarymokotow.pl.

## Commands

- **Dev server:** `npm start` (webpack-dev-server with hot reload)
- **Production build:** `npm run build` (outputs to `dist/`)
- No tests or linter configured.

## Architecture

Single-page static site with webpack for JS bundling only (no CSS/HTML processing in dev):

- `index.html` — main page, Polish language. Signature counter value is hardcoded here (`.counter-current` element).
- `js/app.js` — all JS: FAQ loading from Google Sheets CSV, FAQ accordion, signature counter animation, newsletter form submission.
- `css/style.css` — all styles, loaded directly (not processed by webpack).
- `files/` — downloadable assets (PDF signature form).
- `img/` — images including area map.

### Key integrations

- **FAQ data:** Fetched as CSV from a published Google Sheet, parsed client-side. Falls back to hardcoded `fallbackFAQ` array in `app.js`.
- **Newsletter:** Form POSTs to a Google Apps Script endpoint.
- **Analytics:** Google Analytics (G-Y76WPFSPMG).

### Webpack setup

- `webpack.common.js` — entry point `js/app.js`, output to `dist/js/app.js`.
- Dev config serves from repo root with live reload.
- Prod config uses HtmlWebpackPlugin + CopyPlugin to assemble `dist/` with all static assets.

## Updating the signature counter

Change the number in `index.html` inside `<span class="counter-current">`. The progress bar percentage is calculated automatically in `js/app.js`.
