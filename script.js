console.log("TAG-ME script loaded.");

// 1. Both pages use the same theme button. Keep the choice as the visitor navigates.
const themeButton = document.querySelector("#theme-toggle");

function restoreTheme() {
    try {
        const isDark = sessionStorage.getItem("guide-to-me-theme") === "dark";
        document.body.classList.toggle("dark", isDark);
        themeButton.setAttribute("aria-pressed", String(isDark));
    } catch {
        // The current page can still switch themes when storage is unavailable.
    }
}

restoreTheme();
window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        restoreTheme();
    }
});

themeButton.addEventListener("click", function () {
    const darkMode = document.body.classList.toggle("dark");
    themeButton.setAttribute("aria-pressed", String(darkMode));
    try {
        sessionStorage.setItem("guide-to-me-theme", darkMode ? "dark" : "light");
    } catch {
        // The button still changes this page when storage is unavailable.
    }
});

// 2. On Classified, greet the visitor by name when the form is submitted.
const greetingForm = document.querySelector("#greeting-form");
if (greetingForm) {
    const nameInput = document.querySelector("#visitor-name");
    const extraAlerts = document.querySelector("#extra-alerts");
    const statusText = document.querySelector("#greeting-status");

    greetingForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        if (name === "") {
            // JavaScript changes the border property. CSS defines the error colour for each theme.
            nameInput.style.borderColor = "var(--field-error)";
            nameInput.setAttribute("aria-invalid", "true");
            statusText.textContent = "Enter your first name to get clearance.";
            nameInput.focus();
            return;
        }

        window.alert(`Welcome, ${name}! You’re cleared to enter Stephan’s workshop.`);
        if (extraAlerts.checked) {
            window.alert(`Take two, ${name}. That first OK was a rehearsal. Click OK again, with feeling.`);
            window.alert(`One more take, ${name}. The director wants the exact same OK, but completely different.`);
        }
        nameInput.style.borderColor = "var(--field-success)";
        nameInput.removeAttribute("aria-invalid");
        statusText.textContent = `Clearance granted, ${name}.`;
    });

    nameInput.addEventListener("input", function () {
        nameInput.style.removeProperty("border-color");
        nameInput.removeAttribute("aria-invalid");
        statusText.textContent = "";
    });
}

// Home also has a place to preview a story idea.
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

// 3. Pick a random fact for the paragraph on either page. Skip the current fact.
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
