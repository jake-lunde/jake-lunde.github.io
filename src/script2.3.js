const WORD_LENGTH = 5;
let word1, word2;
let allWords = [];
let roundWords = []; // Array to store word pairs for each round
let completedRounds = 0;
let totalTime = 0; // Define totalTime at a global scope
let usedWords = new Set();
let time = 60;
let remainingTime = 60 * 1000; // Start from 60 seconds (1 minute) in milliseconds
let timerInterval;
const TIMER_INTERVAL = 100;
const date = new Date();
const seed = date.getFullYear() * 365 + date.getMonth() * 30 + date.getDate();
let message = document.getElementById('endGameMessage');
document.getElementById('gamePlay').style.display = 'none'; // Hide the game elements initially


    // Generate word pairs for each round
    const difficultyRange = [
    { min: 600, max: 1200 }, 
    { min: 560, max: 1120 }, 
    { min: 520, max: 1040 },
    { min: 480, max: 960 }, 
    { min: 440, max: 880 }, 
    { min: 400, max: 800 },
    { min: 300, max: 600 },
    { min: 200, max: 400 },
    { min: 100, max: 200 },
    { min: 50, max: 100 }
];


//FETCH WORDS----------------------------------------------------------------------------------

async function fetchWords() {
    try {
        const response = await fetch('https://uploads-ssl.webflow.com/605f6be6343bd7cb3f573f2a/64d4558bb986e916aef3884b_dictionary_az.txt');
        
        // If the data is plain text, separate it by line breaks or other delimiters
        const jsonResponse = await response.json();
        allWords = Object.freeze(jsonResponse.words); // Replace 'words' with the appropriate key

    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

console.log("Initial used words:", usedWords);
console.log("All words:", allWords);


//SEED----------------------------------------------------
function seedRandom(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

//CALCULATE DISTANCE------------------------------------------------------------------------
function calculateDistance(word1Index, word2Index, arrayLength) {
    if (word1Index <= word2Index) {
        return word2Index - word1Index;
    } else {
        return arrayLength - word1Index + word2Index;
    }
}

//GENERATE PAIRS----------------------------------------------------
function generateWordPairs(allWords, difficultyRange) {
    const date = new Date();
    const seed = date.getFullYear() * 365 + date.getMonth() * 30 + date.getDate();
    const usedIndices = new Set();
    const wordPairs = [];

    for (let i = 0; i < 10; i++) {
        let roundDifficulty = difficultyRange[i];
        let word1Index, word2Index, distance;

        do {
            word1Index = Math.floor(seedRandom(seed + i) * (allWords.length - roundDifficulty.max)); // Ensure word1 has enough space for max difficulty
            distance = roundDifficulty.min + Math.floor(seedRandom(seed + i + 0.5) * (roundDifficulty.max - roundDifficulty.min));
            word2Index = word1Index + distance;

            // Check if word2Index is out of bounds
            if (word2Index >= allWords.length) continue;

        } while (usedIndices.has(word1Index) || usedIndices.has(word2Index));

        usedIndices.add(word1Index);
        usedIndices.add(word2Index);
  
        wordPairs.push({ word1: allWords[word1Index], word2: allWords[word2Index] });

        console.log(`Word Pair ${i + 1}:`);
        console.log(`- Word 1: ${allWords[word1Index]}`);
        console.log(`- Word 2: ${allWords[word2Index]}`);
        console.log(`- Difficulty: Min - ${roundDifficulty.min}, Max - ${roundDifficulty.max}`);
        console.log(`- Actual Distance: ${distance}`);
        console.log('--------------------------');
    }

    return wordPairs;
}

//DETECT SCREEN----------------------------------------------------------------------------------
function isMobileDevice() {
    return /Android|iPhone|iPad/i.test(window.navigator.userAgent);
}


//START GAME----------------------------------------------------------------------------------
async function startGame() {
    await fetchWords();
    console.log("All words after fetching:", allWords);

    setupGame();

    if (isMobileDevice()) {
        const firstTextField = document.querySelector('input[type="text"]');
        if (firstTextField) {
            firstTextField.addEventListener('focus', revealGame);
        }
    } else {
        revealGame();
    }
}

function setupGame() {
    // Setup logic here...
    time = 60;
    document.getElementById('startButton').style.display = 'none'; // Hide the start button
    completedRounds = 0; // Reset completed rounds
}

function revealGame() {
    // Reveal game elements...
    document.getElementById('gamePlay').style.display = 'flex';
    document.getElementById('timer').style.display = 'flex';
    Array.from(document.getElementsByClassName('square')).forEach(square => square.style.display = 'flex');
    document.getElementById('times').style.display = 'flex';
    document.querySelector('.form').style.display = 'flex';

    playGame(10); // Start the game with 10 rounds
}


// Add a click event listener to the start button
document.getElementById('startButton').addEventListener('click', startGame);



//ASSIGN LETTERS TO SQUARES-------------------------------------------------------
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
    if (!allWords || allWords.length === 0) {
        console.error("Words are not available yet. Please wait...");
        return;
    }

    roundWords = generateWordPairs(allWords, difficultyRange);

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
    // Calculate elapsed time since the round started
    const elapsed = Date.now() - startTime;
    remainingTime -= elapsed;

    // If the remaining time is less than or equal to 0, stop the timer and end the game
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        remainingTime = 0;
        endGame();
        return; // Ensure that the function does not proceed after ending the game
    }

    // Update the timer display
    timerElement.innerText = formatTime(remainingTime);
    
    // Reset startTime to the current time
    startTime = Date.now();
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

function endGame() {
    clearInterval(timerInterval);

    let resultsMessage = "Nice Job!";

    for(let i = 0; i < 10; i++) {
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
    timerElement.style.display = 'none'; // Hide the timer element

    // Display the total time taken
    document.getElementById("totalTime").textContent = `Total Time: ${formatTime((60 - time) * 1000)}`;

    // Populate the hidden form fields with data
    document.getElementById("Score").value = resultsMessage;
    document.getElementById("Time").value = `${formatTime((60 - time) * 1000)} S`

    // Show the form for submitting score
    const submitScoreForm = document.getElementById("submitScoreForm");
    submitScoreForm.style.display = "flex";

    // Prevent the form from redirecting
submitScoreForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Fetch form data
    const formData = new FormData(submitScoreForm);

    // Send the form data using fetch to your desired endpoint
    fetch('https://script.google.com/macros/s/AKfycby13UMJ1GUZIzpMQPT_hLPeVVsWDdGNMVl7Dxsh2-qJ_G4ZCSW2LjSI0oZiiXFdhbzk/exec', { // Replace '/your-submission-endpoint' with your actual endpoint
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert("Thanks for playtesting Word Burger! Come back tomorrow to flip some more burgers!");
        // Handle the response from the server here, if needed.
        console.log(data);
                // Refresh the page
        window.location.reload();
    })
    .catch(error => {
        console.error("There was an error submitting the form:", error);
        alert("Oops, there was an error submitting your form. Please try again.");
    });
});

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

    if (round > 10) {
      console.log("Game over!");
      endGame();
      return;
    }

  startTimer();
  timerElement.style.display = 'flex'; // Show the timer element

  // Use word pairs generated previously
    word1 = roundWords[round - 1].word1;
    word2 = roundWords[round - 1].word2;


function stopTimer() {
    clearInterval(timerInterval);
}

  roundWords.push({ word1, word2 }); // Store the word pair for this round

    console.log(`Round ${round}:`);
    console.log("Word 1:", word1);
    console.log("Word 2:", word2);
    console.log("Current Seed:", seed);

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

    // Check if the word was already used
    if (usedWords.has(userInput)) {
        console.log("You've already used this word!");
        letterInputs.forEach(input => {
            input.value = '';
        });
        letterInputs[0].focus();
        return; // Return early, do not process further
    }

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

            usedWords.add(userInput); // Add the word to the usedWords set

            completedRounds++; // Update the completed rounds count
            console.log("--------------------------------------------");
            letterInputs.forEach(input => {
                input.value = '';
            });
            letterInputs[0].focus();

            setTimeout(() => {
                round++;
                if (round <= rounds) {
                    startRound();
                } else {
                    console.log("Game over!");
                    endGame();
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