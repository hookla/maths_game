import { getRandomInt } from '../helpers.js';
import { findCorrectKey } from './distractors.js';

// Probability: basic probability questions
export function generateProbabilityProblem(level) {
    // Simple marble bag
    const total = getRandomInt(5, level * 5 + 5);
    const favorable = getRandomInt(1, total - 1);
    const text = `A bag contains ${total} marbles, of which ${favorable} are red. What is the probability of drawing a red marble?`;
    // Represent as fraction
    const num = favorable;
    const den = total;
    const correctAnswer = `${num}/${den}`;
    const optsArr = [correctAnswer, `${favorable+1}/${den}`, `${num}/${den-1}`, `${Math.round((favorable/total)*100)}%`, `${Math.round((total-favorable)/total*10)}/10`];
    const options = {};
    ['A','B','C','D','E'].forEach((k,i) => options[k] = optsArr[i]);
    const correct = findCorrectKey(options, correctAnswer);
    return { text, options, correct, level };
}