import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateSubtractionProblem(level) {
    const maxNum = level * 20 + 10;
    let num1 = getRandomInt(5, maxNum);
    let num2 = getRandomInt(1, num1 - 1);
    if (Math.random() > 0.7 && level > 1) [num1, num2] = [num2, num1];
    const correctAnswer = num1 - num2;
    const text = `What is ${num1} - ${num2}?`;
    const optionsArray = generateDistractors(correctAnswer, [num1, num2], '-');
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}