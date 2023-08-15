const WORD_LENGTH = 5;
const ALPHABET_LENGTH = 26; // Number of letters in the alphabet
const CHAR_CODE_A = 97; // ASCII code for 'a'

let word1, word2;
let allWords;
let roundWords = []; // Array to store word pairs for each round
let totalTime = 0; // Define totalTime at a global scope

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * allWords.length);
  return allWords.splice(randomIndex, 1)[0];
}

function calculateDifficulty(word1, word2) {
  // Ensure word1 and word2 are in lowercase for consistent comparison
  word1 = word1.toLowerCase();
  word2 = word2.toLowerCase();

  const weightFactors = [55, 21, 8, 3, 1]; // Weight factors for each character
  let difficulty = 0;

  for (let i = 0; i < 5; i++) { // Loop through all 5 characters
    const charDiff = Math.abs(word1.charCodeAt(i) - word2.charCodeAt(i));
    const alphabeticalDiff = Math.min(charDiff, ALPHABET_LENGTH - charDiff);

    // Count the same characters as a difference of 1
    const charDifference = (alphabeticalDiff === 0) ? 1 : alphabeticalDiff;

    difficulty += alphabeticalDiff * weightFactors[i]; // Apply weight factor
  }

  return difficulty;
}

// Fetch words from a URL
async function fetchWords() {
  try {
    const response = await fetch('https://uploads-ssl.webflow.com/605f6be6343bd7cb3f573f2a/64d165c024d8647408401c1e_dictionary.txt'); // Replace with the actual URL
    const data = await response.json();
    allWords = data.words;
  } catch (error) {
    console.error('Error fetching words:', error);
  }
}

function startGame() {
  // Hide the start button
  const startButton = document.getElementById('startButton');
  startButton.style.display = 'none';

    // Show the game elements
  const timerElement = document.getElementById('timer');
  const squares = document.getElementsByClassName('square');
  const timesElement = document.getElementById('times');
  const form = document.querySelector('.form');

  timerElement.style.display = 'flex';
  Array.from(squares).forEach(square => square.style.display = 'flex');
  timesElement.style.display = 'flex';
  form.style.display = 'flex';

// Fetch words from a URL
async function fetchWords() {
  try {
    const response = await fetch('https://uploads-ssl.webflow.com/605f6be6343bd7cb3f573f2a/64d165c024d8647408401c1e_dictionary.txt'); // Replace with the actual URL
    const data = await response.json();
    allWords = data.words;
    playGame(5); // Start the game with 5 rounds
  } catch (error) {
    console.error('Error fetching words:', error);
  }
}

  // Initialize the game
  function initializeGame() {
    fetchWords();
  }

    // Call the initializeGame function to start the game
  initializeGame();
}

// Add a click event listener to the start button
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

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
  // Get the current time in milliseconds
  const currentTime = Date.now();

  // Calculate the elapsed time in milliseconds
  const elapsedTime = currentTime - startTime;

  // Calculate the hundredths of a second
  const hundredths = Math.floor(elapsedTime / 1000) % 100;

  // Update the timer element
  timerElement.textContent = `${formatTime(elapsedTime)}`;
}

function formatTime(time) {
  // Convert the time to seconds
  const seconds = Math.floor(time / 1000);

  // Get the hundredths of a second
  const hundredths = Math.floor(time / 10) % 100;

  // Pad the strings with zeros
  const secondsStringPadded = seconds.toString().padStart(2, '0');
  const hundredthsStringPadded = hundredths.toString().padStart(2, '0');

  // Return the formatted time
  return `${secondsStringPadded}:${hundredthsStringPadded}`;
}

	function stopTimer() {
    	clearInterval(timerInterval);
   	 times.push(Date.now() - startTime); // Record the completion time for the current round
  }

  function startRound() {
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

  function endGame() {
    stopTimer();
  }

    // Calculate difficulty range for this round
    const difficultyRange = [
      { min: 500, max: 1000 },
      { min: 400, max: 750 },
      { min: 200, max: 500 },
      { min: 100, max: 250 },
      { min: 50, max: 90 }
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
      console.log("--------------------------------------------");
      letterInputs.forEach(input => {
        input.value = '';
      });
      letterInputs[0].focus();

      stopTimer(); // Record the completion time and stop the timer

      const ratio = calculateDifficulty(word1, word2) / ((times[times.length - 1])*currentDifficulty);

      let timeColor;
      if (ratio <= 25) {
        timeColor = 'red';
      } else if (ratio <= 100) {
        timeColor = 'orange';
      } else {
        timeColor = 'green';
      }

      const roundTimeHTML = `<li><span style="color: ${timeColor};">${formatTime(times[times.length - 1])}</span></li>`;
      timesElement.innerHTML += roundTimeHTML;

      setTimeout(() => {
        round++;
      if (round <= rounds) {
        currentDifficulty = calculateDifficulty(word1, word2); // Recalculate difficulty for the next round
        startRound();
      } else {
        console.log("Game over!");
        // Display the times onscreen
        displayTimes();
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
}

function displayTimes() {
  let timesHTML = '<h3>Round Completion Times:</h3><ul>';
  let totalRatio = 0;
  let totalElapsedTime = 0; // Initialize the totalElapsedTime variable

  times.forEach((time, index) => {
    const difficultyRange = [
      { min: 500, max: 1000 },
      { min: 400, max: 750 },
      { min: 200, max: 500 },
      { min: 100, max: 250 },
      { min: 50, max: 90 }
    ][index];

    // Calculate the difficulty factor based on the midpoint of the range
    const difficultyFactor = (difficultyRange.min + difficultyRange.max) / 2;

    // Adjust the time based on the difficulty factor
    const adjustedTime = (time/1000) * difficultyFactor;

    const ratio = calculateDifficulty(roundWords[index].word1, roundWords[index].word2) / adjustedTime;
    totalRatio += ratio;

    let timeColor;
    if (ratio <= 25) {
      timeColor = 'red';
    } else if (ratio <= 100) {
      timeColor = 'orange';
    } else {
      timeColor = 'green';
    }

    timesHTML += `<ul>Round ${index + 1}: <span style="color: ${timeColor};">${formatTime(time)}</span> (${ratio.toFixed(2)})</ul>`;

    // Accumulate the totalElapsedTime
    totalElapsedTime += adjustedTime;
  });

  const averageRatio = totalRatio / times.length;

  let totalTimeColor;
  if (averageRatio <= 25) {
    totalTimeColor = 'red';
  } else if (averageRatio <= 100) {
    totalTimeColor = 'orange';
  } else {
    totalTimeColor = 'green';
  }

  timesHTML += `<li><strong>Total Time:</strong> <span style="color: ${totalTimeColor};">${formatTime(totalElapsedTime)}</span></li></ul>`;

  timesElement.innerHTML = timesHTML;

  timerElement.style.display = 'none'; // Hide the timer element
}


  startRound();
  if (round > rounds) {
    endGame();
  }
}

// Call the fetchWords function to start the game
fetchWords();