// Generates a random integer between 1 and max (inclusive)
function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

let countdown; // Timer variable
let timeLeft; // Time remaining for each question
let correctAnswer; // Store correct answer
let score = 0; // Player's score
let questionCount = 0; // Number of questions answered
let numQuestions = 1; // Total number of questions
let maxRange = 10; // Maximum number for questions

// Toggles the visibility of the settings panel
function toggleSettings() {
    document.getElementById('settingsPanel').classList.toggle('open');
}

// Sets time and range based on selected difficulty
function getTimeAndRangeByDifficulty() {
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;

    // Set time and range according to difficulty
    switch (difficulty) {
        case "Easy":
            timeLeft = 10; maxRange = 10; break;
        case "Medium":
            timeLeft = 7; maxRange = 20; break;
        case "Hard":
            timeLeft = 5; maxRange = 50; break;
        case "Nightmare":
            timeLeft = 3; maxRange = 100; break;
        case "Custom":
            timeLeft = parseInt(document.getElementById('customTime').value) || 10;
            maxRange = parseInt(document.getElementById('customRange').value) || 10;
            break;
    }
}

// Starts the quiz
function startQuiz() {
    clearInterval(countdown); // Clear any existing timer
    document.getElementById('StartBtn').disabled = true; // Disable start button

    getTimeAndRangeByDifficulty(); // Get time and range
    numQuestions = parseInt(document.getElementById('numQuestions').value) || 5; // Get number of questions
    questionCount = 0; // Reset question count
    score = 0; // Reset score
    updateScore(); // Update score display

    nextQuestion(); // Load the first question
}

// Moves to the next question
function nextQuestion() {
    if (questionCount < numQuestions) {
        correctAnswer = generateExercise(); // Generate new exercise
        startTimer(); // Start the countdown timer
    } else {
        endQuiz(); // End the quiz after answering all questions
    }
}

// Starts the countdown timer
function startTimer() {
    let timerElement = document.getElementById('timer');
    timerElement.textContent = timeLeft; // Display time left

    countdown = setInterval(() => {
        timeLeft--; // Decrease time
        timerElement.textContent = timeLeft; // Update display

        if (timeLeft <= 0) {
            clearInterval(countdown); // Clear timer
            document.getElementById('incorrectSound').play(); // Play incorrect sound
            alert(`Time's up! The correct answer was ${correctAnswer}.`); // Notify user
            nextQuestion(); // Load next question
        }
    }, 1000); // Update every second
}

// Generates a new math exercise and displays it
function generateExercise() {
    const num1 = getRandomInt(maxRange);
    const num2 = getRandomInt(maxRange);
    const operation = Math.random() < 0.5 ? '+' : '-';
    const exerciseString = `${num1} ${operation} ${num2}`;

    // Calculate correct answer
    const answer = operation === '+' ? num1 + num2 : num1 - num2;

    // Display exercise
    document.getElementById('ExField').textContent = exerciseString;

    return answer; // Return correct answer
}

// Handles the user's answer submission
function submitAnswer() {
    const userAnswer = parseInt(document.getElementById('InputField').value);
    
    // Check if the answer is correct
    if (userAnswer === correctAnswer) {
        score++; // Increment score
        document.getElementById('correctSound').play(); // Play correct sound
        alert("Correct!");
    } else {
        document.getElementById('incorrectSound').play(); // Play incorrect sound
        alert(`Incorrect! The correct answer was ${correctAnswer}.`);
    }

    questionCount++; // Increment question count
    updateScore(); // Update score display
    document.getElementById('InputField').value = ''; // Clear input
    nextQuestion(); // Load next question
}

// Updates the score display
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Ends the quiz and displays final score
function endQuiz() {
    clearInterval(countdown); // Clear timer
    alert(`Quiz over! Your score: ${score}/${numQuestions}`);
    document.getElementById('StartBtn').disabled = false; // Re-enable start button
    document.getElementById('ExField').textContent = 'Click "Start Quiz" to begin!'; // Reset display
}

// Event listeners
document.getElementById('StartBtn').addEventListener('click', startQuiz);
document.getElementById('SubmitBtn').addEventListener('click', submitAnswer);
document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === "Custom") {
            document.getElementById('customOptions').classList.remove('hidden');
        } else {
            document.getElementById('customOptions').classList.add('hidden');
        }
    });
});
