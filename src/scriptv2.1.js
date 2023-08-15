const WORD_LENGTH = 5;
let word1, word2;
let allWords;
let round = 1;
let roundWords = [];
let totalTime = 0;
let currentDifficulty; // Declare and initialize currentDifficulty


function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * allWords.length);
  return allWords.splice(randomIndex, 1)[0];
}

// NEW CALCULATE DIFFICULTY-------------------------------------------------
function calculateDifficulty(word1, word2) {
  const index1 = allWords.indexOf(word1);
  const index2 = allWords.indexOf(word2);

  if (index1 === -1 || index2 === -1) {
    return Infinity; // Words not found in the list
  }

  return Math.abs(index2 - index1) - 1;
}

// NEW FUNCTION: Get a random word within a specified range------------------------------------------
function getRandomWordInRange(min, max) {
  const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
  return allWords[randomIndex];
}

// FETCH WORDS-------------------------------------------------
async function fetchWords() {
  try {
    const response = await fetch('https://uploads-ssl.webflow.com/605f6be6343bd7cb3f573f2a/64d4558bb986e916aef3884b_dictionary_az.txt'); // Replace with the actual URL
    const data = await response.json();

    console.log('Fetched data:', data); // Debug: Log the fetched data

    allWords = data.words;
    playGame(5); // Start the game with 5 rounds
  } catch (error) {
    console.error('Error fetching words:', error);
  }
}

//START THE GAME----------------------------------------------
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

    playGame(5); // Start the game with 5 rounds

}

// Add a click event listener to the start button
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);


//LETTERS TO SQUARES------------------------------------------
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



// PLAYGAME--------------------------------
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




// START ROUND HERE-----------------------------------------
function startRound() {
  startTime = Date.now();
  updateTimer();
  timerElement.style.display = 'flex';

  if (round > rounds) {
    console.log("Game over!");
    endGame();
    return;
  }

  startTimer();
  timerElement.style.display = 'flex';

  // Generate word1 randomly
  word1 = getRandomWord();

  let lowerBound, upperBound;

  // Set difficulty ranges for each round
  if (round === 1) {
    lowerBound = 2500;
    upperBound = 3500;
  } else if (round === 2) {
    lowerBound = 2000;
    upperBound = 2500;
  } else if (round === 3) {
    lowerBound = 1000;
    upperBound = 2000;
  } else if (round === 4) {
    lowerBound = 800;
    upperBound = 1500;
  } else if (round === 5) {
    lowerBound = 600;
    upperBound = 1100;
  }

  // Generate word2 based on difficulty range
  word2 = getRandomWordInRange(lowerBound, upperBound);

  roundWords.push({ word1, word2 });

function displayDifficulty() {
  const wordsBetween = calculateDifficulty(word1, word2);
  console.log("Number of words between:", wordsBetween);
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




//VALIDATE THE WORD IS BETWEEN--------------------------
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

  startRound();
  if (round > rounds) {
    endGame();
  }
}

// Call the fetchWords function to start the game
fetchWords();