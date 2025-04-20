import { startGame, restartGame, useLifeline } from './ui.js';

// Expose to window for inline onclick handlers
window.startGame = startGame;
window.restartGame = restartGame;
window.useLifeline = useLifeline;

// Initial UI state
document.getElementById('game-area').classList.add('hidden');
document.getElementById('end-screen').classList.add('hidden');
document.getElementById('start-screen').classList.remove('hidden');
console.log("Game Initialized. Waiting for Start.");