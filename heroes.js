// DG8002 Week 10 - Connecting to the World
// The API provides the data. HTML and CSS decide how the file looks.
const heroForm = document.getElementById("hero-form");
const heroSelect = document.getElementById("hero-select");
const openHeroButton = document.getElementById("open-hero");
const randomHeroButton = document.getElementById("random-hero");
const heroStatus = document.getElementById("hero-status");
const heroResults = document.getElementById("hero-results");
const heroCard = document.getElementById("hero-card");
const heroImage = document.getElementById("hero-image");
const imageFallback = document.getElementById("image-fallback");

// This server route calls SuperHeroAPI with a private access token.
// The website stays on GitHub Pages; the token stays on that server.
const HERO_API_BASE = "https://superhero-files-api.kozak74.chatgpt.site/api/hero/";

// Some records have a blank value or a dash instead of information.
function readableText(value) {
    if (typeof value !== "string" || value.trim() === "" || value === "-" || value === "null") {
        return "Not listed";
    }
    return value;
}

function displayStat(statName, value) {
    const numberText = document.getElementById(statName + "-value");
    const meter = document.getElementById(statName + "-meter");

    // SuperHeroAPI sends ratings as strings, such as "26".
    // Convert those to numbers, but do not turn missing values into zero.
    if (typeof value === "string" && value.trim() !== "") {
        value = Number(value);
    }
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) {
        numberText.textContent = "Not listed";
        meter.hidden = true;
    } else {
        numberText.textContent = value + " / 100";
        meter.value = value;
        meter.textContent = value;
        meter.hidden = false;
    }
}

async function loadHero() {
    // Disable the controls while loading so two requests cannot overlap.
    heroSelect.disabled = true;
    openHeroButton.disabled = true;
    randomHeroButton.disabled = true;
    heroCard.hidden = true;
    heroResults.setAttribute("aria-busy", "true");
    heroStatus.classList.remove("hero-error");
    heroStatus.textContent = "Opening " + heroSelect.selectedOptions[0].textContent + "'s file...";

    // End a stalled request after 15 seconds so the visitor can try again.
    const controller = new AbortController();
    const timeout = setTimeout(function () {
        controller.abort();
    }, 15000);

    try {
        // 1. Fetch external information and wait without freezing the page.
        const url = HERO_API_BASE + heroSelect.value;
        const response = await fetch(url, { signal: controller.signal });

        // fetch() can receive a response even when its status is 404 or 500.
        if (!response.ok) {
            throw new Error("The API returned status " + response.status);
        }

        // 2. Parse the JSON response into a JavaScript object.
        const hero = await response.json();
        // The API can report an error inside a successful HTTP response.
        if (hero && hero.response === "error") {
            throw new Error("The API could not find this hero.");
        }
        if (!hero || typeof hero.name !== "string" || !hero.biography || !hero.powerstats) {
            throw new Error("The hero's file is incomplete.");
        }

        // 3. Use properties from the object to update existing DOM elements.
        document.getElementById("hero-name").textContent = hero.name;
        // Brackets are needed because these property names contain hyphens.
        document.getElementById("hero-identity").textContent = readableText(hero.biography["full-name"]);
        document.getElementById("hero-debut").textContent = readableText(hero.biography["first-appearance"]);
        document.getElementById("hero-birthplace").textContent = readableText(hero.biography["place-of-birth"]);

        // A few API records put an alter ego in the publisher field.
        // Show "Not listed" for those entries instead of a misleading publisher.
        let publisher = hero.biography.publisher;
        if (publisher !== "Marvel Comics" && publisher !== "DC Comics") {
            publisher = "Publisher not listed";
        }
        document.getElementById("hero-publisher").textContent = publisher;
        displayStat("strength", hero.powerstats.strength);
        displayStat("speed", hero.powerstats.speed);
        displayStat("intelligence", hero.powerstats.intelligence);

        // A missing portrait should not prevent the rest of the file from opening.
        heroImage.hidden = true;
        imageFallback.hidden = false;
        imageFallback.textContent = "Loading portrait...";
        heroImage.onload = function () {
            heroImage.hidden = false;
            imageFallback.hidden = true;
        };
        heroImage.onerror = function () {
            heroImage.hidden = true;
            imageFallback.hidden = false;
            imageFallback.textContent = "Portrait unavailable. This hero is keeping a low profile.";
        };
        heroImage.alt = "Portrait of " + hero.name;
        if (hero.image && typeof hero.image.url === "string" && hero.image.url.startsWith("https://")) {
            heroImage.src = hero.image.url;
        } else {
            heroImage.removeAttribute("src");
            imageFallback.textContent = "Portrait unavailable. This hero is keeping a low profile.";
        }

        heroCard.hidden = false;
        heroStatus.textContent = hero.name + "'s file is open.";
    } catch (error) {
        // 4. Give the visitor a useful message if the request or JSON fails.
        heroStatus.classList.add("hero-error");
        if (error.name === "AbortError") {
            heroStatus.textContent = "That request took too long. Press Open File to try again.";
        } else {
            heroStatus.textContent = "Couldn't open this file. Check your connection or try another hero, then press Open File.";
        }
        console.error("Superhero file:", error);
    } finally {
        // This runs after success or failure, so the controls always work again.
        clearTimeout(timeout);
        heroSelect.disabled = false;
        openHeroButton.disabled = false;
        randomHeroButton.disabled = false;
        heroResults.setAttribute("aria-busy", "false");
    }
}

heroForm.addEventListener("submit", function (event) {
    event.preventDefault();
    loadHero();
});

randomHeroButton.addEventListener("click", function () {
    // Choose a different option without making extra API requests.
    const offset = 1 + Math.floor(Math.random() * (heroSelect.options.length - 1));
    heroSelect.selectedIndex = (heroSelect.selectedIndex + offset) % heroSelect.options.length;
    loadHero();
});

// Open the first file when the page is ready.
loadHero();
