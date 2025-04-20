export let gameState = {};
export const settings = {
    questionsPerLevelUp: 5,
    totalQuestionsPerSession: 25,
    pointsPerLevel: { 1: 10, 2: 12, 3: 14, 4: 16, 5: 20 },
    initialLifelines: 5,
    robuxTarget: 100
};

/**
 * Initialize the game state.
 * @param {number} [startingLevel=1] - The level to start the game at.
 */
/**
 * Initialize the game state.
 * @param {number} [startingLevel=1] - The level to start the game at.
 * @param {string} [subject='maths'] - The test subject: 'maths' or 'english'.
 */
export function initGameState(startingLevel = 1, subject = 'maths') {
    // Record chosen subject and starting level
    gameState.subject = subject;
    gameState.currentLevel = startingLevel;
    gameState.score = 0;
    gameState.lifelines = settings.initialLifelines;
    gameState.correctInLevelCounter = 0;
    gameState.questionsAnsweredTotal = 0;
    gameState.incorrectlyAnswered = [];
    gameState.currentQuestion = null;
    gameState.askedQuestionSignatures = new Set();
}