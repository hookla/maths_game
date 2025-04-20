import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateRatioProblem(level) {
    const r1 = getRandomInt(1, 3+level);
    const r2 = getRandomInt(1, 5+level);
    if (r1===r2) return generateRatioProblem(level);
    const totalParts = r1 + r2;
    const mul = getRandomInt(2, 5+level);
    const total = totalParts * mul;
    const share1 = r1 * mul;
    const share2 = r2 * mul;
    const part = Math.random()>0.5?1:2;
    const correctAnswer = part===1? share1 : share2;
    const text = `Share £${total} in the ratio ${r1}:${r2}. What is the value of the ${part===1?'first':'second'} share?`;
    let opts = [
        part===1? share2 : share1,
        total,
        mul,
        total / r1,
        total / r2
    ];
    opts = opts.map(o=>Number.isFinite(o)?(Number.isInteger(o)?o:parseFloat(o.toFixed(1))):undefined)
              .filter(o=>o!==undefined);
    opts = [...new Set(opts)];
    const optionsArray = generateDistractors(correctAnswer, [], '', opts);
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}