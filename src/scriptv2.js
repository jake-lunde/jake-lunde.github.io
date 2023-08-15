const WORD_LENGTH = 5;
const ALPHABET_LENGTH = 26; // Number of letters in the alphabet
const CHAR_CODE_A = 97; // ASCII code for 'a'

let word1, word2;
let allWords;
let roundWords = []; // Array to store word pairs for each round
let totalTime = 0; // Define totalTime at a global scope
let round = 0;

// Define the maximum number of rounds and difficulty ranges
const maxRounds = 10;
const difficultyRanges = [
  { min: 500, max: 1000 },
  { min: 400, max: 750 },
  { min: 300, max: 600 },
  { min: 250, max: 500 },
  { min: 200, max: 400 },
  { min: 150, max: 300 },
  { min: 100, max: 250 },
  { min: 75, max: 200 },
  { min: 50, max: 150 },
  { min: 25, max: 100 }
];

let currentRound = 0; // Track the current round
let timerInterval;
let startTime;

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * allWords.length);
  const randomWord = allWords.splice(randomIndex, 1)[0];
  
  // Add this console log to check the generated random word
  console.log("Random Word:", randomWord);

  return randomWord;
}

function calculateDifficulty(word1, word2) {

  const weightFactors = [55, 21, 8, 3, 1]; // Weight factors for each character
  let difficulty = 0;

  for (let i = 0; i < 5; i++) {
    const charDiff = Math.abs(word1.charCodeAt(i) - word2.charCodeAt(i));
    const alphabeticalDiff = Math.min(charDiff, ALPHABET_LENGTH - charDiff);
    const charDifference = (alphabeticalDiff === 0) ? 1 : alphabeticalDiff;

    difficulty += alphabeticalDiff * weightFactors[i];
  }

  return difficulty;
}

// Fetch words from a URL
async function fetchWords() {
  try {
    const response = await fetch('https://uploads-ssl.webflow.com/605f6be6343bd7cb3f573f2a/64d165c024d8647408401c1e_dictionary.txt');
    const data = await response.json();
    allWords = data.words;

    // Add this console log to check if allWords is populated
    console.log("Fetched words:", allWords);

    generateWordPairsForTheDay(); // Generate word pairs for the day at the start
    startGame();
  } catch (error) {
    console.error('Error fetching words:', error);
  }
}

function generateWordPairsForTheDay() {
  wordPairsForTheDay = [];
  for (let i = 0; i < maxRounds; i++) {
    let wordPair;
    do {
      wordPair = {
        word1: getRandomWord(),
        word2: getRandomWord()
      };
      wordPair.difficulty = calculateDifficulty(wordPair.word1, wordPair.word2);
      console.log(`Generated Word Pair for Round ${i + 1}:`, wordPair);
    } while (
      wordPair.difficulty < difficultyRanges[i].min || wordPair.difficulty >= difficultyRanges[i].max
    );
    wordPairsForTheDay.push(wordPair);
  }
  console.log("Word Pairs for the Day:", wordPairsForTheDay);
}

function startRound() {
  currentRound++;

  if (currentRound > maxRounds) {
    console.log("Game over!");
    endGame();
    return;
  }

  startTime = Date.now();
  updateTimer();
  timerInterval = setInterval(updateTimer, 10);

  const wordPair = wordPairsForTheDay[currentRound - 1];
  
  // Add these console logs to check the values
  console.log("Starting Round:", currentRound);
  console.log("Word Pair:", wordPair);
  
  displayDifficulty(); // Call displayDifficulty before assigning word1 and word2
  word1 = wordPair.word1;
  word2 = wordPair.word2;

  assignLettersToSquares();
}

function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;
  const remainingTime = Math.max(60 * 1000 - elapsedTime, 0); // Countdown from 1 minute
  const formattedTime = formatTime(remainingTime);
  document.getElementById('timer').textContent = formattedTime;

  if (remainingTime <= 0) {
    clearInterval(timerInterval);
    console.log("Time's up!");
    endGame();
  }
}

  function displayDifficulty() {
  const difficulty = calculateDifficulty(word1, word2);
  console.log("Difficulty rating:", difficulty);
}

function formatTime(time) {
  const seconds = Math.floor(time / 1000);
  const hundredths = Math.floor(time / 10) % 100;
  const secondsStringPadded = seconds.toString().padStart(2, '0');
  const hundredthsStringPadded = hundredths.toString().padStart(2, '0');
  return `${secondsStringPadded}:${hundredthsStringPadded}`;
}

function endGame() {
  clearInterval(timerInterval);
  console.log("Nice Job!");
  displayEmojis();
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
      currentRound++; // Increment currentRound instead of round
      if (currentRound <= maxRounds) { // Change 'round' to 'currentRound'
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

  const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

// Call the fetchWords function to start the game
fetchWords();