const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');
const ball = document.getElementById('ball');
const leftScoreDisplay = document.getElementById('leftScore');
const rightScoreDisplay = document.getElementById('rightScore');
const countdownDisplay = document.getElementById('countdown');
const resetButton = document.getElementById('resetButton');
const easyButton = document.getElementById('easyButton');
const mediumButton = document.getElementById('mediumButton');
const hardButton = document.getElementById('hardButton');
const hitSound = document.getElementById('hitSound');
const hitWallSound = document.getElementById('hitWallSound');
const scoreSound = document.getElementById('scoreSound');
const startSound = document.getElementById('startSound');
const goalSound = document.getElementById('goalSound');
const resetSound = document.getElementById('resetSound');

var winSound = new Audio('win.mp3');
var loseSound = new Audio('lose.mp3');


const gameContainer = document.getElementById('game-container');

// Define a fixed increment value for moving the left paddle
const paddleIncrement = 10; // Adjust as needed

// Define a variable to track whether the game is over
let gameOver = false;

let leftPaddleY = 350;
let rightPaddleY = 350;
let ballX = 885;
let ballY = 336;
let ballSpeedX = 8;
let ballSpeedY = 8;
let leftScore = 0;
let rightScore =0;
let countdown = 3;
let countdownInterval;
let gameInterval;
let gameRunning = false;
let difficulty = 'easy'; // Default difficulty
let initialPaddleY = 350;



// Set initial placement of the ball and paddles
// Set initial positions of paddles
/*const initialPaddleY = (600 - leftPaddle.offsetHeight) / 2; // Vertical centering
leftPaddle.style.top = initialPaddleY + 'px';
rightPaddle.style.top = initialPaddleY + 'px';

// Set initial position of the ball
const initialBallX = (1100 - ball.offsetWidth) / 2; // Horizontal centering
const initialBallY = (700 - ball.offsetHeight) / 2; // Vertical centering
ball.style.left = initialBallX + 'px';
ball.style.top = initialBallY + 'px';
*/

// --------------------------------------------\\
//------------- TITLE SCREEN ------------------\\
//---------------------------------------------\\

 //Call TitleScreen() when the page loads
window.onload = function() {
    titleScreen();
}
function titleScreen() {
    // Display the start screen elements
    title.style.display = 'block';
    resetButton.style.display = 'block';
    //difficulty-Buttons.style.display = 'block';
   // leftScoreDisplay.style.display = 'none';
    //rightScoreDisplay.style.display = 'none';
   // countdownDisplay.style.display = 'none';
    //ball.style.display = 'none';
    //scoreSound.play();
    render();
    leftPaddle.style.top = initialPaddleY + 'px';
	rightPaddle.style.top = initialPaddleY + 'px';

	}


// Add a mousemove event listener to the document
document.addEventListener('mousemove', function(event) {
    // Calculate the vertical position of the mouse cursor relative to the game area
    const mouseY = event.clientY - gameContainer.offsetTop;

    // Update the position of the left paddle based on the mouse position
    // You may need to adjust the offset or scaling factor depending on your game layout
    leftPaddle.style.top = mouseY - leftPaddle.offsetHeight / 2 + 'px';
});


// Initial start of the game
//scoreSound.play();

//startGame();

// Function to update the game state and render changes
function updateGame() {
    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Update paddle positions (for now, just move the right paddle based on difficulty)
    moveRightPaddle();

    // Handle collisions with walls and paddles
    handleWallCollision();
    handlePaddleCollision();
    
    
    
    // Check for scoring
    if (ballX <= 0) {
        // Right player scores
        rightScore++;
        goalSound.play();
        updateScore(); // Call updateScore function when left player scores
        reserve();
        return; // Exit the function to prevent further execution
    }
    if (ballX >= 1200) {
        // Left player scores
        leftScore++;
        goalSound.play();
        updateScore(); // Call updateScore function when left player scores
        reserve();
        return; // Exit the function to prevent further execution
    }
    
    
    // Update the score display
    leftScoreDisplay.textContent = leftScore;
    rightScoreDisplay.textContent = rightScore;

    // Render changes to the screen
    render();
}

function render() {
    // Add your rendering logic here to update the positions of the ball and paddles on the screen
    // For now, let's just update the position of the ball
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    // add render paddles to this function
    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';
}

// Function to handle keyboard input for the left player
function handleLeftPlayerControls() {
    document.addEventListener('keydown', function(event) {
        // Key codes for the W and S keys
        const KEY_W = 87;
        const KEY_S = 83;

		
		
		
        // Move the left paddle up when the W key is pressed
        if (event.keyCode === KEY_W) {
            leftPaddleY -= 45; // Adjust as needed
            
            
        	
        
            // Ensure the paddle stays within the game area
            if (leftPaddleY < 0) {
                leftPaddleY = 0;
            }
        }

        // Move the left paddle down when the S key is pressed
        if (event.keyCode === KEY_S) {
            leftPaddleY += 45; // Adjust as needed
            // Update the left paddle's position on the screen
            
            // Ensure the paddle stays within the game area
            if (leftPaddleY > 700) {
                leftPaddleY = 700;
            }
        }
		// Update the left paddle's position on the screen
        leftPaddle.style.top = leftPaddleY + 'px';

    });
}


// Function to move the right paddle based on difficulty
function moveRightPaddle() {
    switch (difficulty) {
        case 'easy':
        	//ballSpeedX = 7;
    		//ballSpeedY = 7;
            // Easy difficulty: Move at a constant speed
            if (ballY < rightPaddleY + 50) {
                rightPaddleY -= 4;
            } else if (ballY > rightPaddleY + 50) {
                rightPaddleY += 4;
            }
            break;
        case 'medium':
        	//ballSpeedX = 10;
    		//ballSpeedY = 10;
            // Medium difficulty: Move to the same height as the ball
            if (ballY < rightPaddleY + 50) {
                rightPaddleY -= 6;
            } else if (ballY > rightPaddleY + 50) {
                rightPaddleY += 6;
            }
            break;
        case 'hard':
        	//ballSpeedX = 20;
    		//ballSpeedY = 20;
            // Hard difficulty: Move to intercept the ball
            if (ballY < rightPaddleY + 50) {
                rightPaddleY -= 8;
            } else if (ballY > rightPaddleY + 50) {
                rightPaddleY += 8;
            }
            break;
    }
    
    // Ensure the paddle stays within the game area
            if (rightPaddleY > 700) {
                rightPaddleY = 700;
            }
    // Update the right paddle's position on the screen
    rightPaddle.style.top = rightPaddleY + 'px';
}

// Function to handle collision with the paddles
function handlePaddleCollision() {
    if (ballX <= 41 && ballX <= 35 && ballY >= leftPaddleY && ballY <= leftPaddleY + 100) {
        //ballSpeedX *= -1;
        ballSpeedX = Math.abs(ballSpeedX); // Ensure the ball's speed is negative
        hitSound.play();
    }
    if (ballX >= 1130 && ballX <= 1170 && ballY >= rightPaddleY && ballY <= rightPaddleY + 100) {
        ballSpeedX = -Math.abs(ballSpeedX); // Ensure the ball's speed is negative
        hitSound.play();
    }
}

// Function to handle collision with top and bottom walls
function handleWallCollision() {
    // Check collision with top wall
    if (ballY <= 0) {
        ballY = 0; // Prevent the ball from going above the top wall
        ballSpeedY = Math.abs(ballSpeedY); // Ensure the vertical velocity is positive
        hitWallSound.play();
    }

// Check collision with bottom wall with OFFSET
    if (ballY + ball.offsetHeight >=800) { // Adjust as needed based on the game board's height
        ballY = 800 - ball.offsetHeight; // Prevent the ball from going below the bottom wall
        ballSpeedY = -Math.abs(ballSpeedY); // Ensure the vertical velocity is negative
        hitWallSound.play();
    }


}

// Function to reset the game
function resetGame() {
    // Clear the Title Screen
    
    
    title.style.display = 'none';
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    gameRunning = false;
    
    
    //Clears the WIN/LOSE screen if any
    // Reset scores, positions, etc.
    document.getElementById('winLoseScreen').style.display = 'none';
    
    countdown = 3;
    countdownDisplay.style.display = 'block';
    countdownDisplay.textContent = countdown;
    startSound.play();
    resetSound.play();
    leftScore = 0;
    rightScore = 0;
    leftScoreDisplay.textContent = leftScore;
    rightScoreDisplay.textContent = rightScore;
    leftPaddleY = 350;
    rightPaddleY = 350;
    ballX = 580;
    ballY = 370;
    //ballSpeedX = 7;
    //ballSpeedY = 7;
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';
    scoreSound.play();
    // Play the music and loop when it ends
	scoreSound.addEventListener('ended', function() {
    this.currentTime = 0; // Reset the playback time to the beginning
    this.play(); // Restart the music 
    // Play the reset sound
    
});
    
    
    
    // start the game after Reset
startGame();
}


function reserve() {
   if (!gameOver) {
   
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    gameRunning = false;
    countdown = 3;
    countdownDisplay.style.display = 'block';
    countdownDisplay.textContent = countdown;
    startSound.play();
    leftScoreDisplay.textContent = leftScore;
    rightScoreDisplay.textContent = rightScore;
    //leftPaddleY = 250;
    //rightPaddleY = 250;
    ballX = 590;
    ballY = 380;
    
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';
    
    // start the game after reserve

        startGame();
    }
}


// Function to start the game
function startGame() {
    clearInterval(countdownInterval); // Clear any existing countdown interval
    clearInterval(gameInterval); // Clear any existing game interval

    
    leftScoreDisplay.textContent = leftScore;
    rightScoreDisplay.textContent = rightScore;
    //leftPaddleY = 350;  resets the paddles at every serve
    //rightPaddleY = 350;
    ballX = 550;
    ballY = 350;
    
    
     //Check difficulty settings and adjust ball speed
    
    switch (difficulty) {
        case 'easy':
        	ballSpeedX = 8;
    		ballSpeedY =8;
            break;
        case 'medium':
        	ballSpeedX = 13;
    		ballSpeedY = 13;
            break;
        case 'hard':
        	ballSpeedX = 20;
    		ballSpeedY = 20;
            break;
    }
    
    // Initialize positions of game elements
    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    // Show countdown
    countdownDisplay.style.display = 'block';
    countdownDisplay.textContent = countdown;

    // Start countdown
    countdownInterval = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';
            gameRunning = true;
            gameInterval = setInterval(updateGame, 1000 / 60); // Start game loop
            
            scoreSound.play(); // Start music
        }
    }, 1000);
}

    
    // Activate left player controls
    handleLeftPlayerControls();
    
    
 //  WIN   or    LOSE      screen   \\
//									 \\

function updateScore(winner) {
   // Check for a WIN/LOSS
   
        if (leftScore >= 15) {
            displayWinLoseMessage("You Win!");
            stopGame();
    scoreSound.pause(); // Pause the music
    startSound.pause(); // Pause the countdown
            winSound.play();
            return;
        }
     else {
       
        if (rightScore >= 15) {
            displayWinLoseMessage("You Lose!");
           stopGame();
    scoreSound.pause(); // Pause the music
    startSound.pause(); // Pause the countdown
            loseSound.play();
            return;
        }
    }
    // Update scores on the screen
    leftScoreDisplay.textContent = leftScore;
    rightScoreDisplay.textContent = rightScore;
}

function displayWinLoseMessage(message) {
    var winLoseScreen = document.getElementById('winLoseScreen');
    var winLoseMessage = document.getElementById('winLoseMessage');
    winLoseMessage.textContent = message;
    winLoseScreen.style.display = 'flex';
    // Stop the game
    clearInterval(gameInterval);
    gameRunning = false;
}

function stopGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    scoreSound.pause(); // Pause the music
    gameOver = true; // Set the game over flag
}

// Event listener for the reset button
resetButton.addEventListener('click', resetGame);

// Event listeners for difficulty buttons
easyButton.addEventListener('click', () => {
    difficulty = 'easy';
});
mediumButton.addEventListener('click', () => {
    difficulty = 'medium';
});
hardButton.addEventListener('click', () => {
    difficulty = 'hard';
});


