let score = 0;
let gameInterval;
const gameDuration = 30000; // 30 sekunder

document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("target");
    const scoreDisplay = document.getElementById("score");
    const form = document.getElementById("submitForm");
    const usernameInput = document.getElementById("username");
    const highscoresList = document.getElementById("highscores");

    function startGame() {
        score = 0;
        scoreDisplay.textContent = score;
        form.style.display = "none";

        target.style.display = "block";
        moveTarget();

        gameInterval = setInterval(moveTarget, 1000);

        setTimeout(endGame, gameDuration);
    }

    function moveTarget() {
        const x = Math.random() * 80;
        const y = Math.random() * 80;
        target.style.left = `${x}%`;
        target.style.top = `${y}%`;
    }

    target.addEventListener("click", () => {
        score++;
        scoreDisplay.textContent = score;
    });

    function endGame() {
        clearInterval(gameInterval);
        target.style.display = "none";
        form.style.display = "block";
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = usernameInput.value;

        fetch("/submit_score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game_name: "game1", username, score }),
        })
            .then((response) => response.json())
            .then(() => {
                loadHighscores();
                form.reset();
            });
    });

    function loadHighscores() {
        fetch("/highscores/javascriptcookieclicker.js")
            .then((response) => response.json())
            .then((data) => {
                highscoresList.innerHTML = "";
                data.forEach(([username, score]) => {
                    const li = document.createElement("li");
                    li.textContent = `${username}: ${score}`;
                    highscoresList.appendChild(li);
                });
            });
    }

    startGame();
    loadHighscores();
});
