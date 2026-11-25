# SuperHeroAPI connection

This server-side adapter keeps the SuperHeroAPI access token out of the public website. The original HTML/CSS/JavaScript site stays on GitHub Pages. The adapter runs on a Worker host that supports an ES module with a `fetch(request, env)` handler.

The browser requests `/api/hero/70` on the adapter's host. The adapter requests Batman from `https://superheroapi.com`, then returns the fields used by `heroes.js`. It permits only the ten characters in the dropdown and caches successful records for up to one hour in memory. CORS permits the GitHub Pages origin; this is a browser sharing rule, not authentication.

## Setup still required

1. Authorize SuperHeroAPI using the owner's GitHub account and obtain its API token.
2. Set `SUPERHERO_API_TOKEN` in the host's secret settings. Do not commit its value.
3. Deploy `hero-worker.mjs` as the adapter's server entry point.
4. Set `HERO_API_BASE` in `heroes.js` to the actual deployed HTTPS origin followed by `/api/hero/`.
5. Test the live service before publishing the updated GitHub Pages files.

The frontend files in this draft have not been switched on for GitHub Pages yet. The relative `HERO_API_BASE` must be configured before publishing there.
