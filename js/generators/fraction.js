import { getRandomInt, simplifyFraction } from '../helpers.js';
import { generateFractionDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateFractionProblem(level) {
    const den1 = [2,3,4,5,6,8,10][getRandomInt(0, level+1)];
    let num1 = getRandomInt(1, den1 - 1);
    let operation = 'equivalent';
    let text = '';
    let correctAnswer = '';

    if (level >= 2 && Math.random() > 0.5) {
        operation = (Math.random() > 0.5) ? '+' : '-';
        let num2 = getRandomInt(1, den1 - 1);
        if (operation === '-' && num1 < num2) [num1, num2] = [num2, num1];
        if (operation === '-' && num1 === num2) num1 = Math.max(num1 + 1, num2 + 1);
        const resultNum = operation === '+' ? num1 + num2 : num1 - num2;
        if ((operation === '-' && resultNum <= 0) || (operation === '+' && resultNum >= den1)) {
            return generateFractionProblem(level);
        }
        const resultFrac = simplifyFraction(resultNum, den1);
        correctAnswer = `${resultFrac.num}/${resultFrac.den}`;
        text = `What is <sup>${num1}</sup>&frasl;<sub>${den1}</sub> ${operation} <sup>${num2}</sup>&frasl;<sub>${den1}</sub>?`;
    } else {
        const multiplier = getRandomInt(2, 4);
        const numEq = num1 * multiplier;
        const denEq = den1 * multiplier;
        const simp = simplifyFraction(numEq, denEq);
        correctAnswer = `${simp.num}/${simp.den}`;
        text = `Simplify the fraction <sup>${numEq}</sup>&frasl;<sub>${denEq}</sub>.`;
    }
    const optionsArray = generateFractionDistractors(correctAnswer, level);
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}