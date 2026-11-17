const court = document.getElementById("court");
const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");
const scoreText = document.getElementById("score");
const statusText = document.getElementById("status");
const startButton = document.getElementById("start");

// Positions are percentages of the court, so the same game fits a phone.
const paddleHeight = 26;
const shieldLine = 14; // The ball reaches the shield 14% from the left edge.
let paddleTop, ballX, ballY;
let speedX, speedY, score, timer;

function movePaddle(top) {
    if (top < 0) top = 0;
    if (top > 100 - paddleHeight) top = 100 - paddleHeight;
    paddleTop = top;
    paddle.style.top = paddleTop + "%";
}

function drawBall() {
    ball.style.left = ballX + "%";
    ball.style.top = ballY + "%";
}

function resetBoard() {
    score = 0;
    scoreText.textContent = score;
    ballX = 60;
    ballY = 35;
    speedX = -0.6; // Start by moving left and down.
    speedY = 0.4;
    movePaddle((100 - paddleHeight) / 2);
    drawBall();
}

function moveBall() {
    ballX += speedX;
    ballY += speedY;

    // Reverse direction when the ball reaches a wall.
    if (ballY <= 2 || ballY >= 98) speedY = -speedY;
    if (ballX >= 98) speedX = -speedX;

    // At the shield, a hit scores one point and a miss ends the round.
    if (ballX <= shieldLine && speedX < 0) {
        if (ballY >= paddleTop && ballY <= paddleTop + paddleHeight) {
            speedX = -speedX;
            score++;
            scoreText.textContent = score;
        } else {
            clearInterval(timer);
            statusText.textContent = "Missed! Game over.";
            startButton.textContent = "Play again";
            if (document.activeElement === court) startButton.focus();
        }
    }
    drawBall();
}

startButton.addEventListener("click", function () {
    clearInterval(timer);
    resetBoard();
    statusText.textContent = "In play";
    startButton.textContent = "Restart";
    court.focus();
    timer = setInterval(moveBall, 20);
});

court.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        if (event.key === "ArrowUp") movePaddle(paddleTop - 7);
        else movePaddle(paddleTop + 7);
    }
});

function followPointer(event) {
    const box = court.getBoundingClientRect();
    const pointerY = (event.clientY - box.top) / box.height * 100;
    movePaddle(pointerY - paddleHeight / 2);
}

court.addEventListener("pointermove", followPointer);
court.addEventListener("pointerdown", followPointer);
paddle.style.height = paddleHeight + "%";
resetBoard();
