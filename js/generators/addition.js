import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateAdditionProblem(level) {
    const maxNum = level * 20 + 10;
    const num1 = getRandomInt(1, maxNum);
    const num2 = getRandomInt(1, maxNum);
    const correctAnswer = num1 + num2;
    const text = `What is ${num1} + ${num2}?`;
    const optionsArray = generateDistractors(correctAnswer, [num1, num2], '+');
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}