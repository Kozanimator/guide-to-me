console.log("TAG-ME script loaded.");

// 1. Both pages use the same theme button. Keep the choice as the visitor navigates.
const themeButton = document.querySelector("#theme-toggle");

try {
    if (sessionStorage.getItem("guide-to-me-theme") === "dark") {
        document.body.classList.add("dark");
        themeButton.setAttribute("aria-pressed", "true");
    }
} catch {
    // Storage can be unavailable when opening a local HTML file.
}

themeButton.addEventListener("click", function () {
    const darkMode = document.body.classList.toggle("dark");
    themeButton.setAttribute("aria-pressed", String(darkMode));
    try {
        sessionStorage.setItem("guide-to-me-theme", darkMode ? "dark" : "light");
    } catch {
        // The button still changes this page when storage is unavailable.
    }
});

// 2. The home page lets visitors preview their own message in a browser alert.
const notifyButton = document.querySelector("#notify-btn");
if (notifyButton) {
    const input = document.querySelector("#message");

    notifyButton.addEventListener("click", function (event) {
        event.preventDefault();
        const message = input.value.trim();
        if (message === "") {
            window.alert("Type a story idea first.");
            input.focus();
        } else {
            window.alert(message);
        }
    });
}

// 3. Pick a random fact on the home page. Leave out the one already on screen.
const factButton = document.querySelector("#fact-btn");
if (factButton) {
    const factText = document.querySelector("#fact");
    const facts = [
        "One small idea usually turns into three new projects.",
        "I started with drawing and animation before I moved into visual effects.",
        "I use Unreal Engine to build worlds.",
        "ForeverStar is a universe I want people to be able to play in together.",
        "I like starting a project with a sketch or a reference image.",
        "I find it hard to stop at “one more version.”"
    ];

    factButton.addEventListener("click", function () {
        const choices = facts.filter(function (fact) {
            return fact !== factText.textContent;
        });
        const index = Math.floor(Math.random() * choices.length);
        factText.textContent = choices[index];
    });
}
