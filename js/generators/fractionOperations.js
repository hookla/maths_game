import { getRandomInt, simplifyFraction } from '../helpers.js';
import { generateFractionDistractors, formatOptions, findCorrectKey } from './distractors.js';

// Operations on fractions: add, subtract, multiply, divide
export function generateFractionOpsProblem(level) {
    const type = getRandomInt(1, 4);
    // Base denominator
    const d1 = getRandomInt(2, level + 3);
    const n1 = getRandomInt(1, d1 - 1);
    const d2 = getRandomInt(2, level + 3);
    const n2 = getRandomInt(1, d2 - 1);
    let text, correctNum, correctDen;
    if (type === 1) {
        // addition
        text = `What is <sup>${n1}</sup>&frasl;<sub>${d1}</sub> + <sup>${n2}</sup>&frasl;<sub>${d2}</sub>?`;
        correctNum = n1 * d2 + n2 * d1;
        correctDen = d1 * d2;
    } else if (type === 2) {
        // subtraction
        text = `What is <sup>${n1}</sup>&frasl;<sub>${d1}</sub> - <sup>${n2}</sup>&frasl;<sub>${d2}</sub>?`;
        correctNum = n1 * d2 - n2 * d1;
        correctDen = d1 * d2;
    } else if (type === 3) {
        // multiplication
        text = `What is <sup>${n1}</sup>&frasl;<sub>${d1}</sub> × <sup>${n2}</sup>&frasl;<sub>${d2}</sub>?`;
        correctNum = n1 * n2;
        correctDen = d1 * d2;
    } else {
        // division
        text = `What is <sup>${n1}</sup>&frasl;<sub>${d1}</sub> ÷ <sup>${n2}</sup>&frasl;<sub>${d2}</sub>?`;
        correctNum = n1 * d2;
        correctDen = d1 * n2;
    }
    const simp = simplifyFraction(correctNum, correctDen);
    const correctAnswer = `${simp.num}/${simp.den}`;
    const optsArr = generateFractionDistractors(correctAnswer, level);
    const options = formatOptions(optsArr, correctAnswer);
    const correct = findCorrectKey(options, correctAnswer);
    return { text, options, correct, level };
}