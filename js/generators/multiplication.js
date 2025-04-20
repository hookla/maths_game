import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateMultiplicationProblem(level) {
    const maxFactor = level + 4;
    const num1 = getRandomInt(2, maxFactor);
    const num2 = getRandomInt(2, maxFactor + level);
    const correctAnswer = num1 * num2;
    const text = `What is ${num1} × ${num2}?`;
    const optionsArray = generateDistractors(correctAnswer, [num1, num2], '*');
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}