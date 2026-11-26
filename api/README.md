# SuperHeroAPI connection

This server-side adapter keeps the SuperHeroAPI access token out of the public website. The original HTML/CSS/JavaScript site stays on GitHub Pages. The adapter runs on a Worker host that supports an ES module with a `fetch(request, env)` handler.

The browser requests `/api/hero/70` on the adapter's host. The adapter requests Batman from `https://superheroapi.com`, then returns the fields used by `heroes.js`. It permits only the ten characters in the dropdown and caches successful records for up to one hour in memory. CORS permits the GitHub Pages origin; this is a browser sharing rule, not authentication.

## Live connection

Public base: `https://superhero-files-api.kozak74.chatgpt.site/api/hero/`

Example: append `70` for Batman. `HERO_API_BASE` in `heroes.js` points to this address. The token is configured as the hosted secret `SUPERHERO_API_TOKEN` and is not included in this repository. The adapter uses the provider's canonical `https://www.superheroapi.com/api.php/` endpoint, which is the redirect destination of its documented `/api/` address.

## How to explain the request

1. Clicking Open File calls `loadHero()` and shows a loading message.
2. `await fetch(...)` asks the adapter for the selected hero without reloading the page.
3. The adapter calls SuperHeroAPI using its private token, or reuses a recent successful response.
4. `await response.json()` turns the response into a JavaScript object.
5. `textContent`, the image source, and the meters display the values. `try/catch` shows a useful message on failure.

## Validation

From the repository root, run `node tests/check-heroes.cjs` and `node tests/check-hero-worker.mjs`. These tests use sample responses to cover successful rendering, missing values, timeouts, API errors, fixed server routes, and secret-safe error handling. They do not need the real token. Live requests are checked separately before publication.

When changing the adapter, deploy `hero-worker.mjs` to its Worker host as well as committing it here. GitHub Pages serves the frontend files; it does not execute the server adapter.
