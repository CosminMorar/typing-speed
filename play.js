let gameCurrentlyPlaying = false, unixEndTime, wordList, wordsCreated;
let checkWordListCompletionInterval, gameTick;

// Game setup
const SECONDS_IN_A_GAME = 10;
const WORDS_IN_LIST = 10;

// Timing variables
const MILLISECONDS_IN_A_SECOND = 1000;
const MILLISECONDS_IN_A_MINUTE = SECONDS_IN_A_GAME * MILLISECONDS_IN_A_SECOND;

// Random word generation API setup
const RANDOM_WORD_API_URL = 'https://api.api-ninjas.com/v1/randomword';
const RANDOM_WORD_API_KEY = 'oN55NsBq994xtCiI3xsuJw==9NjdaLDohOckJsZ2';

window.addEventListener('keydown', onKeyDown);

function onKeyDown(event) {
  if (!gameCurrentlyPlaying && event.key == ' ') {
    prepareGame();
  }
}

function currentUnixTime() {
  return Date.now();
}

function setTimer() {
  let timerTime = document.getElementsByClassName('timer-time')[0];
  if (!gameCurrentlyPlaying) {
    // Update the progress of the word list generation
    timerTime.innerHTML = `Get ready while words are generated! ${wordsCreated}/${WORDS_IN_LIST}`;
  } else {
    let timeRemaining = Math.ceil((unixEndTime - currentUnixTime()) / MILLISECONDS_IN_A_SECOND);
    if (timeRemaining > 0) {
      timerTime.innerHTML = timeRemaining;
    } else {
      endGame();
    }
  }
}

function addRandomWordToWordList() {
  fetch(RANDOM_WORD_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": RANDOM_WORD_API_KEY,
    }
  })
    .then(res => res.json())
    .then(data => {
      let wordsDisplayer = document.getElementsByClassName('words-displayer')[0];
      wordsDisplayer.innerHTML += data.word[0].toLowerCase() + ' ';
      ++wordsCreated;
    });
}

function startGameOnWordListCompletion() {
  if (wordsCreated == WORDS_IN_LIST) {
    clearInterval(checkWordListCompletionInterval);
    startGame();
  } else {
    // Update the progress of the word list generation
    setTimer();
  }
}

function createWordList() {
  let wordsDisplayer = document.getElementsByClassName('words-displayer')[0];
  wordsDisplayer.innerHTML = '';
  for (let wordIndex = 0; wordIndex < WORDS_IN_LIST; ++wordIndex) {
    addRandomWordToWordList();
  }
  checkWordListCompletionInterval = window.setInterval(startGameOnWordListCompletion, 100);
}

function endGame() {
  gameCurrentlyPlaying = false;

  // Hide the timer
  let timer = document.getElementsByClassName('timer')[0];
  timer.style.display = 'none';

  // Show the instructions
  let instructions = document.getElementsByClassName('instructions')[0];
  instructions.style.display = 'block';
}

function updateGame() {
  setTimer();
}

function startGame() {
  // Initialize game variables
  gameCurrentlyPlaying = true;
  unixEndTime = currentUnixTime() + MILLISECONDS_IN_A_MINUTE;

  // Start the main game loop
  gameTick = window.setInterval(updateGame, 1);
}

function prepareGame() {
  // Create a list of random words and display them
  wordsCreated = 0;
  createWordList();

  // Show the timer
  let timer = document.getElementsByClassName('timer')[0];
  timer.style.display = 'block';

  // Hide the instructions
  let instructions = document.getElementsByClassName('instructions')[0];
  instructions.style.display = 'none';
}
