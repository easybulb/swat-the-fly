let score = 0;
let countdown;
let timeLeft;
let highScore = localStorage.getItem('highScore') || 0;
let isMuted = false; // Track the mute state

// Select and store references to DOM elements that will be manipulated
const fly = document.getElementById('fly');
const bee = document.getElementById('bee'); // Select the bee element
const scoreBoard = document.getElementById('score-board');
const highScoreBoard = document.createElement('div');
const gameContainer = document.getElementById('game-container');
const timer = document.getElementById('timer');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const playAgainButton = document.getElementById('play-again-button');
const finalScore = document.getElementById('final-score');
const timeSelect = document.getElementById('time-select');
const endButton = document.getElementById('end-button');
const backgroundMusic = document.getElementById('background-music');
const muteButton = document.getElementById('mute-button');
const swatSound = document.getElementById('swat-sound');

// Display the high score on the screen
highScoreBoard.textContent = `High Score: ${highScore}`;
highScoreBoard.id = 'high-score-board';
startScreen.appendChild(highScoreBoard);

// Start playing the background music when the page loads
backgroundMusic.play();

function toggleMusic() {
    if (isMuted) {
        backgroundMusic.muted = false;
        isMuted = false;
        muteButton.classList.remove('muted');
    } else {
        backgroundMusic.muted = true;
        isMuted = true;
        muteButton.classList.add('muted');
    }
}

// Mute/unmute button functionality
muteButton.addEventListener('click', toggleMusic);

function getRandomPosition() {
    const x = Math.floor(Math.random() * (gameContainer.clientWidth - fly.clientWidth));
    const y = Math.floor(Math.random() * (gameContainer.clientHeight - fly.clientHeight));
    return { x, y };
}

// Function to move the fly to a new random position
function moveFly() {
    const { x, y } = getRandomPosition();
    fly.style.left = `${x}px`;
    fly.style.top = `${y}px`;
}

// Function to move the bee to a new random position
function moveBee() {
    const { x, y } = getRandomPosition();
    bee.style.left = `${x}px`;
    bee.style.top = `${y}px`;
}

// Function to handle the fly being swatted by the player
function swatFly() {
    score++;
    scoreBoard.textContent = `Score: ${score}`;
    moveFly();

    // Check if the sound is not muted, then play the swat sound
    if (!isMuted) {
        swatSound.currentTime = 0; // Reset the sound to the start (useful if swatting quickly)
        swatSound.play();
    }
}

// Function to handle the bee being swatted by the player
function swatBee() {
    score -= 2; // Deduct points
    if (score < 0) score = 0; // Ensure score doesn't go below 0
    scoreBoard.textContent = `Score: ${score}`;

    bee.style.display = 'none'; // Hide the bee
    fly.style.display = 'block'; // Show the fly

    moveFly(); // Move the fly to a new position
}

// Attach the swatFly function to both click and touchstart events on the fly element
fly.addEventListener('click', swatFly);
fly.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents the default touch behavior
    swatFly();
});

// Attach the swatBee function to both click and touchstart events on the bee element
bee.addEventListener('click', swatBee);
bee.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents the default touch behavior
    swatBee();
});

// Function to randomly show the bee and hide the fly
function randomBeeAppearance() {
    const showBee = Math.random() < 0.3; // 30% chance of showing the bee

    if (showBee) {
        fly.style.display = 'none'; // Hide the fly
        bee.style.display = 'block'; // Show the bee
        moveBee(); // Move the bee to a new position
    } else {
        fly.style.display = 'block'; // Show the fly
        bee.style.display = 'none'; // Hide the bee
        moveFly(); // Move the fly to a new position
    }
}

// Function to start the game
function startGame() {
    backgroundMusic.pause(); // Stop the music when the game starts

    score = 0; // Reset the score to 0 at the start of the game
    scoreBoard.textContent = `Score: ${score}`; // Reset the scoreboard
    highScoreBoard.textContent = `High Score: ${highScore}`; // Display current high score
    timeLeft = parseInt(timeSelect.value);
    timer.textContent = `Time: ${timeLeft}s`;

    // Hide the start screen and show the game container
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    endScreen.style.display = 'none';

    // Start the countdown timer, decreasing the timeLeft by 1 every second
    countdown = setInterval(() => {
        timeLeft--; // Decrease the remaining time by 1 second
        timer.textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) { // Check if the time has run out
            endGame(); // End the game if the time is up
        } else {
            randomBeeAppearance(); // Randomly show the bee or the fly
        }
    }, 1000); // Run the interval every 1000ms (1 second)
}

// Function to end the game
function endGame() {
    clearInterval(countdown);
    gameContainer.style.display = 'none';
    endScreen.style.display = 'flex';
    finalScore.textContent = `Your final score is ${score}`;

    // Start the background music when the game ends
    if (!isMuted) {
        backgroundMusic.play();
    }

    // Check if the current score is higher than the stored high score
    if (score > highScore) {
        highScore = score; // Update high score
        localStorage.setItem('highScore', highScore); // Save new high score in localStorage
        highScoreBoard.textContent = `High Score: ${highScore}`; // Update high score display
        finalScore.textContent += ` - New High Score!`; // Inform the player of their achievement
    }
}

// Function to restart the game at any time
function restartGame() {
    clearInterval(countdown); // Stop the current countdown
    score = 0; // Reset the score
    timeLeft = parseInt(timeSelect.value); // Reset the timer
    scoreBoard.textContent = `Score: ${score}`; // Reset the scoreboard
    timer.textContent = `Time: ${timeLeft}s`; // Reset the timer display

    // Stop the background music when the game restarts
    backgroundMusic.pause();

    gameContainer.style.display = 'block';
    startScreen.style.display = 'none';
    endScreen.style.display = 'none';

    moveFly();

    // Start a new countdown timer
    countdown = setInterval(() => {
        timeLeft--;
        timer.textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            endGame();
        } else {
            randomBeeAppearance(); // Randomly show the bee or the fly
        }
    }, 1000);
}

// Function to stop the game and return to the start screen
function endAndReturnHome() {
    clearInterval(countdown); // Stop the current countdown
    gameContainer.style.display = 'none'; // Hide the game container
    endScreen.style.display = 'none'; // Hide the end screen
    startScreen.style.display = 'flex'; // Show the start screen

    // Start the background music when returning to the start screen
    if (!isMuted) {
        backgroundMusic.play();
    }
}

// Attach the startGame function to both click and touchstart events on the start button
startButton.addEventListener('click', startGame);
startButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startGame();
});

// Attach the restartGame function to both click and touchstart events on the restart button
restartButton.addEventListener('click', restartGame);
restartButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    restartGame();
});

// Attach the restartGame function to the Play Again button on the end screen
playAgainButton.addEventListener('click', restartGame);
playAgainButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    restartGame();
});

// Attach the endAndReturnHome function to the End button
endButton.addEventListener('click', endAndReturnHome);
endButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    endAndReturnHome();
});

// Navigation Buttons
const infoButton = document.getElementById('info-button');
const infoPopup = document.getElementById('info-popup');
const closePopup = document.getElementById('close-popup');

// Info Button Event Listeners
infoButton.addEventListener('click', () => {
    infoPopup.style.display = 'block';
});

closePopup.addEventListener('click', () => {
    infoPopup.style.display = 'none';
});

// Close popup when clicking outside of the content
window.addEventListener('click', (event) => {
    if (event.target === infoPopup) {
        infoPopup.style.display = 'none';
    }
});
