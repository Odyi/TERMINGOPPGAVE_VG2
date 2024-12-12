let startTime;
let reactionTime = 0;
let highScore = 0;
let isTestActive = false;
let timeoutID;

// Ensure the high score is loaded when the page is ready
document.addEventListener('DOMContentLoaded', function () {
    fetch('/get_highscore?game_name=javascriptreaksjontest')
        .then(response => response.json())
        .then(data => {
            if (data.highscore !== undefined) {
                highScore = data.highscore;
                document.getElementById('highscore').innerText = `High Score (Best Time): ${highScore} ms`;
            }
        })
        .catch(err => console.error('Error fetching high score:', err));
});

// Submit the score to the backend
function submitScore(score) {
    fetch('/submit_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            game_name: 'Reaction Time Test',
            score: score
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message); // Optional: Show success message
            if (highScore === 0 || score < highScore) {
                highScore = score; // Update local high score
                document.getElementById('highscore').innerText = `High Score (Best Time): ${highScore} ms`;
            }
        } else if (data.error) {
            alert(data.error); // Show error message
        }
    })
    .catch(err => {
        console.error('Error submitting score:', err);
    });
}

// Start the test (random delay before the button turns green)
function startTest() {
    if (isTestActive) return; // Prevent starting a new test if the current one is active

    isTestActive = true;
    document.getElementById('reactionTime').classList.add('hidden');
    document.getElementById('instruction').innerText = 'Wait for the green button...';
    document.getElementById('startButton').innerText = 'Waiting...';

    // Randomize delay between 2 and 5 seconds
    timeoutID = setTimeout(() => {
        document.getElementById('startButton').style.backgroundColor = 'green';
        document.getElementById('startButton').innerText = 'Click Now!';
        startTime = new Date().getTime(); // Start measuring reaction time
    }, Math.random() * 3000 + 2000);
}

// User clicked the button
document.getElementById('startButton').addEventListener('click', () => {
    if (!isTestActive || document.getElementById('startButton').style.backgroundColor !== 'green') return;

    reactionTime = new Date().getTime() - startTime; // Calculate reaction time
    document.getElementById('reactionTime').classList.remove('hidden');
    document.getElementById('timeResult').innerText = reactionTime;

    // Submit the score
    submitScore(reactionTime);

    // Reset the game
    isTestActive = false;
    document.getElementById('startButton').style.backgroundColor = '';
    document.getElementById('startButton').innerText = 'Start Test';
    document.getElementById('instruction').innerText = 'Click the button when it turns green!';
});
