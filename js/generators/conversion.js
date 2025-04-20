import { getRandomInt, simplifyFraction, formatNumber } from '../helpers.js';
import { findCorrectKey } from './distractors.js';

// Conversions between fractions, decimals, and percentages
export function generateConversionProblem(level) {
    const type = getRandomInt(1, 3);
    let text, correctAnswer;
    if (type === 1) {
        // Fraction to decimal (2 dp)
        const den = [2,4,5,8,10][getRandomInt(0, Math.min(4, level))];
        const num = getRandomInt(1, den - 1);
        const val = num / den;
        correctAnswer = formatNumber(val);
        text = `Express <sup>${num}</sup>&frasl;<sub>${den}</sub> as a decimal (to 2 decimal places).`;
    } else if (type === 2) {
        // Decimal to fraction
        const denom = [2,4,5,8,10,100][getRandomInt(0, Math.min(5, level+1))];
        const numerator = getRandomInt(1, denom - 1);
        const dec = numerator / denom;
        const simp = simplifyFraction(numerator, denom);
        correctAnswer = `${simp.num}/${simp.den}`;
        text = `Convert ${formatNumber(dec)} to a fraction in simplest form.`;
    } else {
        // Decimal to percentage
        const perc = [10,20,25,50,75][getRandomInt(0, Math.min(4, level))];
        correctAnswer = `${perc}%`;
        text = `Express ${perc/100} as a percentage.`;
    }
    // Build simple options: correct plus near distractors
    const baseVals = [correctAnswer];
    if (type === 1 || type === 3) {
        // decimal or percentage treat as number
        const val = parseFloat(correctAnswer);
        baseVals.push(val + 0.1, val - 0.1);
    } else {
        // fraction string may be manipulated
        baseVals.push('1/2','2/3','3/4');
    }
    const formatted = baseVals.map(formatNumber);
    const opts = {};
    ['A','B','C','D','E'].forEach((k,i) => opts[k] = formatted[i % formatted.length]);
    const correct = findCorrectKey(opts, correctAnswer);
    return { text, options: opts, correct, level };
}