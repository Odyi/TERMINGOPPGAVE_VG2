let cookieCount = 0;
let highScore = 0;
let startTime = Date.now();
let gameStarted = false;

// Ensure the high score is loaded when the page is ready
document.addEventListener('DOMContentLoaded', function () {
    fetch('/get_highscore?game_name=javacriptcookieclicker')
        .then(response => response.json())
        .then(data => {
            if (data.highscore !== undefined) {
                highScore = data.highscore;
                document.getElementById('highscore').innerText = `High Score: ${highScore}`;
            }
        })
        .catch(err => console.error('Error fetching high score:', err));
});

// Update the cookie count
function clickCookie() {
    if (!gameStarted) {
        gameStarted = true;
        startTime = Date.now(); // Reset timer when the game starts
    }

    cookieCount++;
    document.getElementById('cookieCount').innerText = `Cookies: ${cookieCount}`;
}

// Submit the score
function submitScore() {
    let elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Time spent in seconds

    if (cookieCount > highScore) {
        highScore = cookieCount;
        document.getElementById('highscore').innerText = `High Score: ${highScore}`;
    }

    fetch('/submit_score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            game_name: 'Cookie Clicker',
            score: cookieCount
        })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(err => console.error('Error submitting score:', err));
}
