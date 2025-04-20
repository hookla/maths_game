import { getRandomInt, formatNumber } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateDivisionProblem(level) {
    const maxDivisor = level + 3;
    const divisor = getRandomInt(2, maxDivisor);
    const quotient = getRandomInt(2, 12 + level);
    const dividend = divisor * quotient;
    const correctAnswer = quotient;
    const text = `What is ${dividend} ÷ ${divisor}?`;
    let optionsArray = generateDistractors(correctAnswer, [dividend, divisor], '/');
    if (!optionsArray.map(formatNumber).includes(formatNumber(dividend)) && optionsArray.length < 5) {
        optionsArray.push(dividend);
    }
    optionsArray = optionsArray.slice(0, 5);
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}