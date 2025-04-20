/* global confetti */
import { gameState, settings, initGameState } from './state.js';
import { generateQuestion as generateMathQuestion } from './generators/index.js';
import { generateQuestion as generateEnglishQuestion } from './generators/english/index.js';
import { shuffleArray } from './helpers.js';

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameArea = document.getElementById('game-area');
const endScreen = document.getElementById('end-screen');
const levelInfo = document.getElementById('level-info');
const scoreInfo = document.getElementById('score-info');
const lifelineInfo = document.getElementById('lifeline-info');
const robuxInfo = document.getElementById('robux-info');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const questionText = document.getElementById('question-text');
const answerButtonsContainer = document.getElementById('answer-buttons');
const feedbackArea = document.getElementById('feedback-area');
const lifelineButton = document.getElementById('lifeline-button');
// Element to show the topic/type of the current question
const topicInfo = document.getElementById('topic-info');
const finalScoreEl = document.querySelector('#final-score span');
const finalRobuxEl = document.querySelector('#final-robux span');
const finalLevelEl = document.querySelector('#final-level span');
const completionTimeEl = document.querySelector('#completion-time span');
const performanceDetailsEl = document.getElementById('performance-details');

export function startGame() {
    // Determine starting subject and level from user selections
    let startingLevel = 1;
    const levelSelect = document.getElementById('starting-level');
    if (levelSelect) {
        const val = parseInt(levelSelect.value, 10);
        if (!isNaN(val)) startingLevel = Math.min(Math.max(val, 1), 5);
    }
    let subject = 'maths';
    const subjSelect = document.getElementById('subject-select');
    if (subjSelect && subjSelect.value === 'english') {
        subject = 'english';
    }
    initGameState(startingLevel, subject);
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameArea.classList.remove('hidden');
    loadNextQuestion();
    updateDisplay();
}

export function restartGame() {
    window.location.reload();
}

function loadNextQuestion() {
    feedbackArea.textContent = '';
    feedbackArea.className = '';
    if (gameState.questionsAnsweredTotal >= settings.totalQuestionsPerSession) {
        showEndScreen();
        return;
    }
    // Generate next question based on selected subject
    if (gameState.subject === 'english') {
        gameState.currentQuestion = generateEnglishQuestion(gameState.currentLevel);
    } else {
        gameState.currentQuestion = generateMathQuestion(gameState.currentLevel);
    }
    let attempts = 0;
    while (gameState.askedQuestionSignatures.has(gameState.currentQuestion.text) && attempts < 10) {
        // Regenerate using the selected subject generator
        if (gameState.subject === 'english') {
            gameState.currentQuestion = generateEnglishQuestion(gameState.currentLevel);
        } else {
            gameState.currentQuestion = generateMathQuestion(gameState.currentLevel);
        }
        attempts++;
    }
    gameState.askedQuestionSignatures.add(gameState.currentQuestion.text);
    if (!gameState.currentQuestion.options[gameState.currentQuestion.correct]) {
        feedbackArea.textContent = "Error generating question, trying again...";
        setTimeout(loadNextQuestion, 500);
        return;
    }
    displayQuestion(gameState.currentQuestion);
    updateDisplay();
}

export function displayQuestion(question) {
    questionText.innerHTML = question.text;
    answerButtonsContainer.innerHTML = '';
    Object.keys(question.options).forEach(key => {
        const btn = document.createElement('button');
        btn.classList.add('btn');
        btn.innerHTML = `${key}: ${question.options[key]}`;
        btn.dataset.key = key;
        btn.onclick = () => handleAnswerSelection(key);
        answerButtonsContainer.appendChild(btn);
    });
    lifelineButton.disabled = gameState.lifelines <= 0;
    // Display the question type/topic below the choices
    if (topicInfo) {
        topicInfo.textContent = `Type: ${question.topic}`;
    }
}

export function handleAnswerSelection(selectedKey) {
    const buttons = answerButtonsContainer.querySelectorAll('.btn');
    buttons.forEach(btn => btn.disabled = true);
    lifelineButton.disabled = true;
    const correctKey = gameState.currentQuestion.correct;
    const correctValue = gameState.currentQuestion.options[correctKey];
    const isCorrect = selectedKey === correctKey;
    if (isCorrect) {
        gameState.score += settings.pointsPerLevel[gameState.currentLevel] || 10;
        gameState.correctInLevelCounter++;
        feedbackArea.textContent = "Correct!";
        feedbackArea.className = 'feedback-correct';
        const btn = findButtonByKey(selectedKey);
        if (btn) btn.classList.add('correct');
    } else {
        feedbackArea.innerHTML = `Incorrect. The answer was ${correctKey}: ${correctValue}`;
        feedbackArea.className = 'feedback-incorrect';
        const wrongBtn = findButtonByKey(selectedKey);
        if (wrongBtn) wrongBtn.classList.add('incorrect');
        const correctBtn = findButtonByKey(correctKey);
        if (correctBtn) correctBtn.classList.add('correct');
        gameState.incorrectlyAnswered.push({ topic: gameState.currentQuestion.topic, level: gameState.currentLevel });
    }
    gameState.questionsAnsweredTotal++;
    updateDisplay();
    if (isCorrect && gameState.correctInLevelCounter >= settings.questionsPerLevelUp) {
        levelUp();
    }
    setTimeout(loadNextQuestion, 2000);
}

function findButtonByKey(key) {
    return answerButtonsContainer.querySelector(`.btn[data-key="${key}"]`);
}

function levelUp() {
    gameState.currentLevel = Math.min(gameState.currentLevel + 1, 5);
    gameState.correctInLevelCounter = 0;
    // Show level-up message
    feedbackArea.textContent = "Level Up!";
    feedbackArea.className = 'feedback-correct';
    // Confetti celebration (requires canvas-confetti)
    if (typeof confetti === 'function') {
        // Confetti burst from bottom center
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { x: 0.5, y: 1 }
        });
    }
}

export function useLifeline() {
    if (gameState.lifelines > 0 && gameState.currentQuestion) {
        gameState.lifelines--;
        lifelineButton.disabled = true;
        const correctKey = gameState.currentQuestion.correct;
        const keys = Object.keys(gameState.currentQuestion.options).filter(k => k !== correctKey);
        shuffleArray(keys);
        const toRemove = keys.slice(0, 2);
        toRemove.forEach(k => {
            const btn = findButtonByKey(k);
            if (btn) {
                btn.classList.add('hidden-lifeline');
                btn.disabled = true;
            }
        });
        updateDisplay();
    }
}

function showEndScreen() {
    gameArea.classList.add('hidden');
    endScreen.classList.remove('hidden');
    const finalScore = gameState.score;
    const highestLevel = gameState.currentLevel;
    const virtualRobux = Math.floor(finalScore / (settings.pointsPerLevel[1] || 10));
    const now = new Date();
    const formattedTime = now.toLocaleDateString('en-GB', { day:'numeric',month:'long',year:'numeric'}) + ', ' + now.toLocaleTimeString('en-GB', { hour:'2-digit',minute:'2-digit',hour12:true }).toUpperCase();
    finalScoreEl.textContent = finalScore;
    finalRobuxEl.textContent = `${virtualRobux} (Goal: ${virtualRobux} / ${settings.robuxTarget})`;
    finalLevelEl.textContent = highestLevel;
    completionTimeEl.textContent = formattedTime;
    performanceDetailsEl.textContent = analysePerformance(gameState.incorrectlyAnswered);
}

function analysePerformance(incorrect) {
    if (incorrect.length === 0) return "Excellent work! No mistakes recorded in this session.";
    const counts = {};
    incorrect.forEach(e => { counts[e.topic] = (counts[e.topic]||0) + 1; });
    const areas = Object.entries(counts).filter(([_,c]) => c >= 2).map(([t]) => t);
    if (areas.length) return `Consider focusing on: ${areas.join(', ')}.`;
    const topics = [...new Set(incorrect.map(e=>e.topic))];
    return `Good effort! Review questions on: ${topics.join(', ')}.`;
}

export function updateDisplay() {
    levelInfo.textContent = `Level: ${gameState.currentLevel}`;
    scoreInfo.textContent = `Score: ${gameState.score}`;
    lifelineInfo.textContent = `Lifelines: 💎 x ${gameState.lifelines}`;
    const virtualRobux = Math.floor(gameState.score / (settings.pointsPerLevel[1] || 10));
    robuxInfo.textContent = `Virtual Robux Goal: ${virtualRobux} / ${settings.robuxTarget}`;
    const percent = (gameState.correctInLevelCounter / settings.questionsPerLevelUp) * 100;
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${gameState.correctInLevelCounter} / ${settings.questionsPerLevelUp}`;
    lifelineButton.disabled = gameState.lifelines <= 0 || !gameState.currentQuestion;
}