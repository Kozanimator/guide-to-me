"use strict";

// The same 256-unit-high world scales to fit a phone or a desktop.
const worldHeight = 256;
const gateWidth = 34;
const gateSpacing = 148;
const field = document.getElementById("field");
const world = document.getElementById("world");
const rooftops = document.getElementById("rooftops");
const hero = document.getElementById("hero");
const gateLayer = document.getElementById("gates");
const panel = document.getElementById("panel");
const title = document.getElementById("title");
const messageTitle = document.getElementById("message-title");
const message = document.getElementById("message");
const action = document.getElementById("action");
const pauseButton = document.getElementById("pause");
const scoreLabel = document.getElementById("score");
const bestLabel = document.getElementById("best");

const game = {
    mode: "ready",
    y: worldHeight / 2,
    velocity: 0,
    distance: 0,
    score: 0,
    best: 0,
    gates: []
};
let width = 0;
let scale = 1;
let heroX = 0;
let frameId = 0;
let previousTime = null;

try {
    const savedBest = Number(localStorage.getItem("tagm-flight-best"));
    if (Number.isSafeInteger(savedBest) && savedBest > 0) game.best = savedBest;
} catch {
    // If the browser blocks storage, the best score still lasts for this visit.
}

function updateScores() {
    scoreLabel.textContent = String(game.score).padStart(2, "0");
    bestLabel.textContent = String(game.best).padStart(2, "0");
}

function drawHero() {
    const onCover = game.mode === "ready";
    const x = onCover ? width * .72 : heroX;
    const y = onCover ? (width < 320 ? 49 : 96) : game.y;
    const angle = onCover ? -9 : Math.max(-18, Math.min(24, game.velocity / 5));
    hero.style.transform = "translate(" + (x - 22) + "px," + (y - 9.9) + "px) rotate(" + angle + "deg) scale(" + (onCover ? 2.25 : 1) + ")";
}

function drawGate(gate) {
    gate.element.style.transform = "translateX(" + gate.x + "px)";
}

function resizeWorld() {
    const oldX = heroX;
    scale = field.clientHeight / worldHeight;
    width = field.clientWidth / scale;
    heroX = Math.min(128, width * .22);
    world.style.width = width + "px";
    world.style.height = worldHeight + "px";
    world.style.transform = "scale(" + scale + ")";
    for (const gate of game.gates) {
        gate.x += heroX - oldX;
        drawGate(gate);
    }
    drawHero();
}

// Each gate has two crystal elements and a record of its position and safe gap.
function addGate(x, centre) {
    const opening = Math.max(87, 113 - game.score * 1.5);
    const top = centre - opening / 2;
    const bottom = centre + opening / 2;
    const element = document.createElement("div");
    element.className = "gate";

    const upper = document.createElement("div");
    upper.className = "crystal upper";
    upper.style.height = top + "px";
    const lower = document.createElement("div");
    lower.className = "crystal lower";
    lower.style.height = (worldHeight - bottom) + "px";
    element.append(upper, lower);
    gateLayer.appendChild(element);

    const gate = { element, x, centre, top, bottom, scored: false };
    game.gates.push(gate);
    drawGate(gate);
}

function fillSky() {
    let last = game.gates[game.gates.length - 1];
    while (last.x + gateSpacing < width + gateWidth) {
        const nextCentre = Math.max(78, Math.min(178, last.centre + Math.random() * 66 - 33));
        addGate(last.x + gateSpacing, nextCentre);
        last = game.gates[game.gates.length - 1];
    }
}

function setMode(mode, detail) {
    game.mode = mode;
    field.dataset.mode = mode;
    const labels = { ready: "Ready", playing: "Flying", paused: "Paused", over: "Flight over" };
    document.getElementById("status").dataset.mode = mode;
    document.getElementById("status-text").textContent = labels[mode];
    panel.hidden = mode === "playing";
    title.hidden = mode !== "ready";
    messageTitle.hidden = mode === "ready";
    pauseButton.disabled = mode !== "playing" && mode !== "paused";
    pauseButton.textContent = mode === "paused" ? "Resume" : "Pause";

    if (mode === "paused" || mode === "over") {
        messageTitle.textContent = mode === "paused" ? "Flight paused" : "Flight over!";
        message.textContent = detail;
        document.getElementById("action-text").textContent = mode === "paused" ? "Resume flight" : "Fly again";
    }
    drawHero();
}

function flap() {
    game.velocity = -108;
    drawHero();
}

function launch() {
    gateLayer.replaceChildren();
    game.gates = [];
    game.y = worldHeight / 2;
    game.distance = 0;
    game.score = 0;
    rooftops.style.backgroundPositionX = "0px";
    updateScores();
    scoreLabel.classList.remove("point");
    addGate(Math.min(heroX + 150, width - gateWidth), worldHeight / 2);
    fillSky();
    setMode("playing");
    flap();
    field.focus({ preventScroll: true });
    previousTime = null;
    frameId = requestAnimationFrame(tick);
}

function pauseFlight() {
    if (game.mode !== "playing") return;
    cancelAnimationFrame(frameId);
    previousTime = null;
    setMode("paused", "Your flight is on hold. Resume when you’re ready.");
}

function resumeFlight() {
    if (game.mode !== "paused") return;
    setMode("playing");
    field.focus({ preventScroll: true });
    previousTime = null;
    frameId = requestAnimationFrame(tick);
}

function finish(reason) {
    const points = game.score === 1 ? "1 gate" : game.score + " gates";
    setMode("over", reason + " You cleared " + points + ".");
    if (document.activeElement === field) action.focus({ preventScroll: true });
}

function earnPoint() {
    game.score++;
    if (game.score > game.best) {
        game.best = game.score;
        try {
            localStorage.setItem("tagm-flight-best", String(game.best));
        } catch {
            // The on-screen score also works offline or with storage disabled.
        }
    }
    updateScores();
    scoreLabel.classList.add("point");
}

function tick(time) {
    if (game.mode !== "playing") return;
    const dt = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, .04);
    previousTime = time;
    game.velocity = Math.min(135, game.velocity + 245 * dt);
    game.y += game.velocity * dt;
    const move = (72 + Math.min(game.score, 18) * 1.4) * dt;
    game.distance += move;
    rooftops.style.backgroundPositionX = (-game.distance * scale * .32) + "px";
    drawHero();

    if (game.y <= 6 || game.y >= worldHeight - 6) {
        finish(game.y < worldHeight / 2 ? "You flew above the route!" : "You skimmed the streets!");
        return;
    }
    for (const gate of game.gates) {
        gate.x -= move;
        drawGate(gate);
        // Use the body and the crystal cores so a trailing cape or jagged edge is forgiving.
        const alongside = heroX + 15 > gate.x + 4 && heroX - 11 < gate.x + gateWidth - 4;
        if (alongside && (game.y - 6 < gate.top - 4 || game.y + 5 > gate.bottom + 4)) {
            finish("The Kryptonite clipped your cape!");
            return;
        }
        if (!gate.scored && gate.x + gateWidth < heroX - 11) {
            gate.scored = true;
            earnPoint();
        }
    }
    fillSky();
    if (game.gates[0].x + gateWidth < 0) {
        game.gates.shift().element.remove();
    }
    frameId = requestAnimationFrame(tick);
}

// Buttons manage the round. A tap or a fresh keypress supplies one burst of lift.
action.addEventListener("click", () => {
    if (game.mode === "paused") resumeFlight();
    else if (game.mode === "ready" || game.mode === "over") launch();
});
pauseButton.addEventListener("click", () => {
    if (game.mode === "playing") pauseFlight();
    else if (game.mode === "paused") resumeFlight();
});
field.addEventListener("pointerdown", (event) => {
    if (game.mode === "playing" && event.isPrimary && event.button === 0) {
        event.preventDefault();
        field.focus({ preventScroll: true });
        flap();
    }
});
document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key.toLowerCase() === "p" || event.key === "Escape") {
        if (event.repeat) return;
        if (game.mode === "playing") pauseFlight();
        else if (game.mode === "paused") resumeFlight();
        return;
    }
    if (event.code !== "Space" && event.key !== "ArrowUp") return;
    if (event.target.closest("a, button, input, textarea")) return;
    event.preventDefault();
    if (event.repeat) return;
    if (game.mode === "playing") flap();
    else if (game.mode === "ready") launch();
});
document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseFlight();
});
scoreLabel.addEventListener("animationend", () => scoreLabel.classList.remove("point"));
window.addEventListener("resize", resizeWorld);

updateScores();
resizeWorld();
setMode("ready");
