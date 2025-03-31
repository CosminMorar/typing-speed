let checkWordListCompletionInterval, gameTick;
let gameCurrentlyPlaying = false, unixEndTime, wordsCreated, charactersCreated;
let userIndex, wordsCompleted;

// Game setup
const SECONDS_IN_A_GAME = 10;
const WORDS_IN_LIST = 4;

// Timing variables
const SECONDS_IN_A_MINUTE = 60;
const MILLISECONDS_IN_A_SECOND = 1000;
const MILLISECONDS_IN_A_MINUTE = SECONDS_IN_A_GAME * MILLISECONDS_IN_A_SECOND;

// Random word generation API setup
const RANDOM_WORD_API_URL = 'https://api.api-ninjas.com/v1/randomword';
const RANDOM_WORD_API_KEY = 'oN55NsBq994xtCiI3xsuJw==9NjdaLDohOckJsZ2';

window.addEventListener('keydown', onKeyDown);

function onKeyDown(event) {
  // Check for game start
  if (!gameCurrentlyPlaying) {
    if (event.key == ' ') {
      prepareGame();
    }
    return;
  }

  // If the game is on, track characters introduced
  let characterAtUserPos = document.getElementById(`character-${userIndex}`);
  if (event.key == characterAtUserPos.innerHTML) {
    characterAtUserPos.classList.remove('written-wrong');
    characterAtUserPos.classList.add('written-correct');
    ++userIndex;

    // Check if user finished writing a word (current character will be a space)
    let newCharacterAtUserPos = document.getElementById(`character-${userIndex}`)
    if (newCharacterAtUserPos.innerHTML == ' ') {
      ++wordsCompleted;
    }
  } else {
    characterAtUserPos.classList.add('written-wrong');
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
    return;
  }

  // Update the remaining time
  let timeRemaining = Math.ceil((unixEndTime - currentUnixTime()) / MILLISECONDS_IN_A_SECOND);
  if (timeRemaining > 0) {
    timerTime.innerHTML = timeRemaining;
  } else {
    endGame();
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
      let word = `${data.word[0].toLowerCase()} `;
      for (let index = 0; index < word.length; ++index) {
        wordsDisplayer.innerHTML += `<span id="character-${charactersCreated++}">${word[index]}</span>`
      }
      ++wordsCreated;
    });
}

function startGameOnWordListCompletion() {
  if (wordsCreated == WORDS_IN_LIST) {
    // Start the game
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
  clearInterval(gameTick);

  // Hide the timer
  let timer = document.getElementsByClassName('timer')[0];
  timer.style.display = 'none';

  // Show the instructions
  let instructions = document.getElementsByClassName('instructions')[0];
  instructions.style.display = 'block';

  // Calculate & display the score (words/minute)
  let score = document.getElementById('score');
  score.innerHTML = wordsCompleted * SECONDS_IN_A_MINUTE / SECONDS_IN_A_GAME;

  // Check if user made a high score (words/minute)
  let highScore = document.getElementById('high-score');
  if (parseInt(score.innerHTML) > parseInt(highScore.innerHTML)) {
    highScore.innerHTML = score.innerHTML;
  }
}

function startGame() {
  // Initialize game variables
  gameCurrentlyPlaying = true;
  unixEndTime = currentUnixTime() + MILLISECONDS_IN_A_MINUTE;
  userIndex = 0;

  // Start the main game loop
  gameTick = window.setInterval(setTimer, 1);
}

function prepareGame() {
  // Create a list of random words and display them
  wordsCreated = 0;
  charactersCreated = 0;
  wordsCompleted = 0;
  createWordList();

  // Show the timer
  let timer = document.getElementsByClassName('timer')[0];
  timer.style.display = 'block';

  // Hide the instructions
  let instructions = document.getElementsByClassName('instructions')[0];
  instructions.style.display = 'none';

  // Reset the current score
  let score = document.getElementById('score');
  score.innerHTML = 0;
}
