// Small server-side adapter for the SuperHeroAPI service listed in Activity 10.
// The website remains on GitHub Pages; this file runs on a Worker host.
// Configure SUPERHERO_API_TOKEN as a secret on that host, never in this file.

const WEBSITE_ORIGIN = "https://kozanimator.github.io";
const HERO_IDS = new Set(["70", "106", "107", "149", "332", "346", "620", "644", "659", "720"]);
const CACHE_MS = 60 * 60 * 1000;
const cache = new Map();

function json(data, status = 200, cacheSeconds = 0) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": WEBSITE_ORIGIN,
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": cacheSeconds ? "public, max-age=" + cacheSeconds : "no-store"
        }
    });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const origin = request.headers.get("Origin");
        if (origin && origin !== WEBSITE_ORIGIN) {
            return json({ response: "error", error: "This origin is not supported." }, 403);
        }
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: {
                "Access-Control-Allow-Origin": WEBSITE_ORIGIN,
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Max-Age": "3600"
            }});
        }
        if (request.method !== "GET") {
            return json({ response: "error", error: "Use GET to open a hero file." }, 405);
        }
        if (url.pathname === "/" && !url.search) {
            return json({ service: "Superhero Files API", website: "https://kozanimator.github.io/guide-to-me/heroes.html" });
        }
        const match = url.pathname.match(/^\/api\/hero\/(\d+)$/);
        if (!match || !HERO_IDS.has(match[1]) || url.search) {
            return json({ response: "error", error: "Hero file not found." }, 404);
        }
        if (!env || !env.SUPERHERO_API_TOKEN) {
            return json({ response: "error", error: "The hero service is not configured." }, 503);
        }

        const id = match[1];
        const saved = cache.get(id);
        if (saved && saved.expires > Date.now()) {
            return json(saved.hero, 200, Math.max(1, Math.floor((saved.expires - Date.now()) / 1000)));
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        try {
            // Only this fixed provider and the ten dropdown IDs can be requested.
            // The token stays on the server and is never sent to the browser.
            // The documented /api/ address redirects to this provider endpoint.
            const apiURL = "https://www.superheroapi.com/api.php/" + encodeURIComponent(env.SUPERHERO_API_TOKEN) + "/" + id;
            const upstream = await fetch(apiURL, { signal: controller.signal, redirect: "manual" });
            if (!upstream.ok) {
                console.warn("SuperHeroAPI HTTP status", upstream.status);
                return json({ response: "error", error: "The hero service is temporarily unavailable." }, 502);
            }
            const data = await upstream.json();
            if (!data || data.response !== "success" || typeof data.name !== "string" || !data.biography || !data.powerstats) {
                console.warn("SuperHeroAPI returned an unavailable or incomplete record");
                return json({ response: "error", error: "The hero service could not open this file." }, 502);
            }

            // Return only the fields used by the page, retaining the API's names.
            const hero = {
                response: "success", id, name: data.name,
                biography: {
                    "full-name": data.biography["full-name"],
                    "first-appearance": data.biography["first-appearance"],
                    "place-of-birth": data.biography["place-of-birth"],
                    publisher: data.biography.publisher
                },
                powerstats: {
                    strength: data.powerstats.strength,
                    speed: data.powerstats.speed,
                    intelligence: data.powerstats.intelligence
                },
                image: { url: data.image?.url }
            };
            cache.set(id, { hero, expires: Date.now() + CACHE_MS });
            return json(hero, 200, CACHE_MS / 1000);
        } catch (error) {
            // Never return or log the upstream URL: it contains the access token.
            console.warn("SuperHeroAPI request failed", error.name);
            return json({ response: "error", error: "The hero service did not respond. Please try again." }, 502);
        } finally {
            clearTimeout(timeout);
        }
    }
};
