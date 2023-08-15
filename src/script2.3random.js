const WORD_LENGTH = 5;
let word1, word2;
let allWords;
let roundWords = []; // Array to store word pairs for each round
let completedRounds = 0;
let totalTime = 0; // Define totalTime at a global scope
let usedWords = new Set();
let time = 60;
let remainingTime = 60 * 1000; // Start from 60 seconds (1 minute) in milliseconds
let timerInterval;
const TIMER_INTERVAL = 100;
let message = document.getElementById('endGameMessage');



//FETCH WORDS----------------------------------------------------------------------------------

async function fetchWords() {
    try {
        const response = await fetch('https://uploads-ssl.webflow.com/605f6be6343bd7cb3f573f2a/64d4558bb986e916aef3884b_dictionary_az.txt');
        const data = await response.json();
        allWords = Object.freeze(data.words);
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

//PICK WORDS----------------------------------------------------------------------------------
function getRandomWord() {
    if (allWords.length === usedWords.size) {
        console.error('No more words left in the list.');
        return null;
    }
    let randomWord;
    do {
        const randomIndex = Math.floor(Math.random() * allWords.length);
        randomWord = allWords[randomIndex];
    } while (usedWords.has(randomWord));

    usedWords.add(randomWord);
    return randomWord;
}

function calculateDifficulty(word1, word2) {
    const index1 = allWords.indexOf(word1);
    const index2 = allWords.indexOf(word2);
    return Math.abs(index2 - index1);
}



//START GAME----------------------------------------------------------------------------------
async function startGame() {
    time = 10;
    await fetchWords();
    document.getElementById('startButton').style.display = 'none'; // Hide the start button
    completedRounds = 0; // Reset completed rounds

    // Show the game elements
    document.getElementById('timer').style.display = 'flex';
    Array.from(document.getElementsByClassName('square')).forEach(square => square.style.display = 'flex');
    document.getElementById('times').style.display = 'flex';
    document.querySelector('.form').style.display = 'flex';

    playGame(10); // Start the game with 10 rounds
}

// Add a click event listener to the start button
document.getElementById('startButton').addEventListener('click', startGame);

function assignLettersToSquares() {
    const squares = document.getElementsByClassName("square");

    // Ensure word1 and word2 are in alphabetical order
    if (word1 > word2) {
        [word1, word2] = [word2, word1];
    }

    // Assign letters from word1 to the first row of squares
    for (let i = 0; i < WORD_LENGTH; i++) {
        squares[i].textContent = word1[i];
    }

    // Assign letters from word2 to the second row of squares
    for (let i = 0; i < WORD_LENGTH; i++) {
        squares[WORD_LENGTH + i].textContent = word2[i];
    }
}

function isAlphabeticallyBetween(word, lowerBound, upperBound) {
    return word > lowerBound && word < upperBound;
}

const timerElement = document.getElementById('timer');



//PLAY GAME--------------------------------------------------------
function playGame(rounds) {
  let round = 1;

  let timerInterval;
  let startTime;

  const timesElement = document.getElementById('times');
  const times = [];

  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 10); // Update timer every 10 milliseconds (hundredths of a second)
  }

function updateTimer() {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    document.getElementById("timer").innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function formatTime(time) {
  time = Math.max(time, 0); // Ensure the time is not negative

  // Convert the time to seconds
  const seconds = Math.floor(time / 1000);

  // Get the hundredths of a second
  const hundredths = Math.floor(time / 10) % 100;

  // Pad the strings with zeros
  const secondsStringPadded = seconds.toString().padStart(2, '0');
  const hundredthsStringPadded = hundredths.toString().padStart(2, '0');

  // Return the formatted time
  return `${secondsStringPadded}.${hundredthsStringPadded}`;
}

function endGameEarly() {
    clearInterval(timerInterval);
    clickEnabled = false;

    let resultsMessage = "Nice Job!<br>";

    for(let i = 0; i < 10; i++) {
        // Add a line break after the first 5 emojis
        if(i === 5) {
            resultsMessage += "<br>";
        }

        if(i < completedRounds) {
            resultsMessage += '🍔';
        } else {
            resultsMessage += '🕳';
        }
    }

    message.innerHTML = resultsMessage;

    const squares = document.getElementsByClassName('square');
    const form = document.querySelector('.form');
    Array.from(squares).forEach(square => square.style.display = 'none');
    form.style.display = 'none';
    timerElement.style.display = 'none'; // Show the timer element
}


//START ROUND----------------------------------------------------------------------------------
  function startRound() {
    clearInterval(timerInterval);
      // Initialize the timer
    startTime = Date.now();

    // Start the timer
    updateTimer();

    // Show the timer element
    timerElement.style.display = 'flex';

    if (round > rounds) {
      console.log("Game over!");
      endGame();
      return;
    }

  startTimer();
  timerElement.style.display = 'flex'; // Show the timer element

function stopTimer() {
    clearInterval(timerInterval);
}

function endGame() {
    clearInterval(timerInterval);
    clickEnabled = false;

    let resultsMessage = "Nice Job!<br>";

    for(let i = 0; i < 10; i++) {
        // Add a line break after the first 5 emojis
        if(i === 5) {
            resultsMessage += "<br>";
        }

        if(i < completedRounds) {
            resultsMessage += '🍔';
        } else {
            resultsMessage += '🕳';
        }
    }

    message.innerHTML = resultsMessage;

    const squares = document.getElementsByClassName('square');
    const form = document.querySelector('.form');
    Array.from(squares).forEach(square => square.style.display = 'none');
    form.style.display = 'none';
    timerElement.style.display = 'none'; // Show the timer element
}

    // Calculate difficulty range for this round
  const difficultyRange = [
    { min: 3000, max: 5000 },
    { min: 2500, max: 4000 },
    { min: 2000, max: 3000 },
    { min: 1500, max: 2000 },
    { min: 1000, max: 1500 },
    { min: 750, max: 1200 },    // New ranges from here
    { min: 500, max: 800 },
    { min: 250, max: 500 },
    { min: 100, max: 350 },
    { min: 75, max: 250 }
  ][round - 1];

    let currentDifficulty;

    // Generate word1 randomly
    word1 = getRandomWord();

    // Generate word2 based on difficulty range
    do {
      word2 = getRandomWord();
      currentDifficulty = calculateDifficulty(word1, word2);
    } while (
      currentDifficulty < difficultyRange.min || currentDifficulty >= difficultyRange.max
    );

  roundWords.push({ word1, word2 }); // Store the word pair for this round

function displayDifficulty() {
  const difficulty = calculateDifficulty(word1, word2);
  console.log("Difficulty rating:", difficulty);
}

    console.log(`Round ${round}:`);
    console.log("Word 1:", word1);
    console.log("Word 2:", word2);

    displayDifficulty(); // Add this line to display the difficulty rating

    // Set data-letter attribute for each square element
    assignLettersToSquares();

    const inputForm = document.getElementById('inputForm');
    const letterInputs = document.querySelectorAll('.form input');
    const lastLetterInput = letterInputs[letterInputs.length - 1];

    // Focus on the first input field
    letterInputs[0].focus();

  // Add event listeners to input fields
  letterInputs.forEach((input, index) => {
    input.addEventListener('input', function () {
      if (input.value) {
        if (index < letterInputs.length - 1) {
          letterInputs[index + 1].focus(); // Move to the next input field
        } else {
          validateWord(); // Validate the word if it's the last input field
        }
      }
    });

    input.addEventListener('keydown', function (event) {
      if ((event.key === 'Backspace' || event.key === 'Delete') && !input.value) {
        if (index > 0) {
          letterInputs[index - 1].focus(); // Move to the previous input field
        }
      }
    });
  });


//VALIDATE WORD----------------------------------------------------------------------------------
function validateWord() {
  const userInput = Array.from(letterInputs).map(input => input.value).join('');

  if (!allWords.includes(userInput) || userInput.length !== WORD_LENGTH) {
    console.log("Invalid input! The word is not in the word list or not 5 letters long.");
    letterInputs.forEach(input => {
      input.value = '';
    });
    letterInputs[0].focus();
  } else {
    if (!isAlphabeticallyBetween(userInput, word1, word2)) {
      console.log("Failure! The word is not alphabetically between the two words.");
      letterInputs.forEach(input => {
        input.value = '';
      });
      letterInputs[0].focus();
    } else {
      console.log("Success! The word is alphabetically between the two words.");
      completedRounds++; // Update the completed rounds count
      console.log("--------------------------------------------");
      letterInputs.forEach(input => {
        input.value = '';
      });
      letterInputs[0].focus();

      setTimeout(() => {
        round++;
      if (round <= rounds) {
        currentDifficulty = calculateDifficulty(word1, word2); // Recalculate difficulty for the next round
        startRound();
      } else {
        console.log("Game over!");
        // Hide the game elements
        const squares = document.getElementsByClassName('square');
        const form = document.querySelector('.form');
        Array.from(squares).forEach(square => square.style.display = 'none');
        form.style.display = 'none';
        }
      }, 0); // Delay of 1 second before progressing to the next round
    }
  }
}
timerInterval = setInterval(() => {
    time -= 0.1;
    if (time <= 0) {
        time = 0;  // Set the time to zero to prevent negative values
        endGame();
        clearInterval(timerInterval);
    }
    updateTimer();
}, TIMER_INTERVAL);
}


  startRound();
  if (round > rounds) {
    endGame();
  }
}

// Call the fetchWords function to start the game
fetchWords();