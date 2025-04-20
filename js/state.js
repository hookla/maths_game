export let gameState = {};
export const settings = {
    questionsPerLevelUp: 5,
    totalQuestionsPerSession: 25,
    pointsPerLevel: { 1: 10, 2: 12, 3: 14, 4: 16, 5: 20 },
    initialLifelines: 5,
    robuxTarget: 100
};

export function initGameState() {
    gameState.currentLevel = 1;
    gameState.score = 0;
    gameState.lifelines = settings.initialLifelines;
    gameState.correctInLevelCounter = 0;
    gameState.questionsAnsweredTotal = 0;
    gameState.incorrectlyAnswered = [];
    gameState.currentQuestion = null;
    gameState.askedQuestionSignatures = new Set();
}