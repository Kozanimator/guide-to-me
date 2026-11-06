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
    const greetingPopup = document.querySelector("#greeting-popup");
    const popupCount = document.querySelector("#greeting-popup-count");
    const popupMessage = document.querySelector("#greeting-popup-message");
    const closeButton = document.querySelector("#close-greeting");
    const extraGreetings = [
        "welcome again. That first welcome was just a rehearsal.",
        "please close this one with a little more enthusiasm.",
        "the director wants another take.",
        "your click has been forwarded to the Click Department.",
        "the Click Department needs one more click.",
        "we moved the button. Creative decision.",
        "this welcome now has a sequel.",
        "the sequel has been renewed for another season.",
        "this is the FINAL_final_REALLY_final welcome."
    ];
    let visitorName = "";
    let greetingNumber = 1;
    let greetingLimit = 1;

    function moveGreeting() {
        // Alternate between high and low positions, with a random horizontal position.
        const freeWidth = Math.max(0, document.documentElement.clientWidth - greetingPopup.offsetWidth - 32);
        const freeHeight = Math.max(0, window.innerHeight - greetingPopup.offsetHeight - 32);
        const verticalPosition = greetingNumber % 2 === 0 ? Math.random() * 0.3 : 0.7 + Math.random() * 0.3;
        greetingPopup.style.left = 16 + Math.floor(Math.random() * freeWidth) + "px";
        greetingPopup.style.top = 16 + Math.floor(verticalPosition * freeHeight) + "px";
    }

    function showGreeting() {
        popupCount.textContent = `Greeting ${greetingNumber} of ${greetingLimit}`;
        popupMessage.textContent = `${visitorName}, ${extraGreetings[greetingNumber - 2]}`;
        moveGreeting();
    }

    function finishGreeting() {
        nameInput.style.borderColor = "var(--field-success)";
        nameInput.removeAttribute("aria-invalid");
        statusText.textContent = `Clearance granted, ${visitorName}.`;
    }

    function closeGreeting() {
        if (greetingNumber === greetingLimit) {
            greetingPopup.close();
            finishGreeting();
            return;
        }
        greetingNumber += 1;
        showGreeting();
    }

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

        visitorName = name;
        nameInput.style.removeProperty("border-color");
        nameInput.removeAttribute("aria-invalid");
        statusText.textContent = "";
        // The first click closes the native alert required by the assignment.
        window.alert(`Welcome, ${name}! You’re cleared to enter Stephan’s workshop.`);
        if (extraAlerts.checked) {
            greetingLimit = Math.floor(Math.random() * 6) + 5;
            greetingNumber = 2;
            greetingPopup.showModal();
            showGreeting();
        } else {
            finishGreeting();
        }
    });

    closeButton.addEventListener("click", closeGreeting);
    greetingPopup.addEventListener("cancel", function (event) {
        event.preventDefault();
        closeGreeting();
    });
    window.addEventListener("resize", function () {
        if (greetingPopup.open) {
            moveGreeting();
        }
    });

    nameInput.addEventListener("input", function () {
        nameInput.style.removeProperty("border-color");
        nameInput.removeAttribute("aria-invalid");
        statusText.textContent = "";
    });
}

// Home gives a joking response to the visitor's story idea.
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
            const replies = [
                `Nope. “${message}” is too scary. I enjoy sleeping.`,
                `Nope. “${message}” is a terrible idea. Naturally, I’ve already started sketching it.`
            ];
            const replyIndex = Math.floor(Math.random() * replies.length);
            window.alert(replies[replyIndex]);
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
