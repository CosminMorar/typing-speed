let gameCurrentlyPlaying = false, gameTick, unixEndTime;

const MILLISECONDS_IN_A_SECOND = 1000;
const MILLISECONDS_IN_A_MINUTE = 60 * MILLISECONDS_IN_A_SECOND;

window.addEventListener('keydown', onKeyDown);

function onKeyDown(event) {
  if (!gameCurrentlyPlaying && event.key == ' ') {
    startGame();
  }
}

function currentUnixTime() {
  return Date.now();
}

function endGame() {
  // Hide the timer
  let timer = document.getElementsByClassName('timer')[0];
  timer.style.display = 'none';

  // Show the instructions
  let instructions = document.getElementsByClassName('instructions')[0];
  instructions.style.display = 'block';
}

function setTimer() {
  let timer = document.getElementsByClassName('timer-time')[0];
  let timeRemaining = Math.ceil((unixEndTime - currentUnixTime()) / MILLISECONDS_IN_A_SECOND);
  if (timeRemaining > 0) {
    timer.innerHTML = timeRemaining;
  } else {
    endGame();
  }
}

function updateGame() {
  setTimer();
}

function startGame() {
  // Show the timer
  let timer = document.getElementsByClassName('timer')[0];
  timer.style.display = 'block';

  // Hide the instructions
  let instructions = document.getElementsByClassName('instructions')[0];
  instructions.style.display = 'none';

  // Initialize game variables
  gameCurrentlyPlaying = true;
  unixEndTime = currentUnixTime() + MILLISECONDS_IN_A_MINUTE;

  // Set the timer
  setTimer();

  // Start the main game loop
  gameTick = window.setInterval(updateGame, 1);
}
