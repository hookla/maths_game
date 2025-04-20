import { getRandomInt, gcd } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

// Number Properties: factors, multiples, prime, square, cube, HCF, LCM
export function generateNumberPropertiesProblem(level) {
    const type = getRandomInt(1, 5);
    let text, correctAnswer;
    if (type === 1) {
        // Factors of a number
        const n = getRandomInt(10, level * 10 + 10);
        const factors = [];
        for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(i);
        correctAnswer = factors.join(', ');
        text = `List all factors of ${n}.`;
        // For listing answers, put correct answer as single string, distractors placeholders
        const options = { A: correctAnswer, B: ' ', C: ' ', D: ' ', E: ' ' };
        return { text, options, correct: 'A', level };
    } else if (type === 2) {
        // Prime, square or cube classification
        const n = getRandomInt(2, level * 10 + 20);
        const isPrime = [...Array(n).keys()].filter(i=>i>1&&n%i===0).length===1;
        const sq = Number.isInteger(Math.sqrt(n));
        const cb = Number.isInteger(Math.cbrt(n));
        let category = isPrime ? 'prime' : sq ? 'square' : cb ? 'cube' : 'none';
        correctAnswer = category;
        text = `Is ${n} a prime number, square number, cube number, or none?`;
        const choices = ['prime','square','cube','none'];
        const options = {};
        ['A','B','C','D'].forEach((k,i) => options[k] = choices[i]);
        return { text, options, correct: Object.keys(options).find(k=>options[k]===correctAnswer), level };
    } else if (type === 3) {
        // HCF of two numbers
        const a = getRandomInt(10, level * 10 + 20);
        const b = getRandomInt(10, level * 10 + 20);
        correctAnswer = gcd(a, b);
        text = `What is the highest common factor (HCF) of ${a} and ${b}?`;
        const optsArr = generateDistractors(correctAnswer, [a,b], 'hcf', []);
        const options = formatOptions(optsArr, correctAnswer);
        const correct = findCorrectKey(options, correctAnswer);
        return { text, options, correct, level };
    } else if (type === 4) {
        // LCM of two numbers
        const a = getRandomInt(2, level * 5 + 5);
        const b = getRandomInt(2, level * 5 + 5);
        const h = gcd(a,b);
        correctAnswer = (a*b)/h;
        text = `What is the lowest common multiple (LCM) of ${a} and ${b}?`;
        const optsArr = generateDistractors(correctAnswer, [a,b], 'lcm', []);
        const options = formatOptions(optsArr, correctAnswer);
        const correct = findCorrectKey(options, correctAnswer);
        return { text, options, correct, level };
    } else {
        // Multiples of a number
        const n = getRandomInt(2, level * 5 + 5);
        correctAnswer = n * getRandomInt(2, 5);
        text = `Give a multiple of ${n}.`;
        const optsArr = generateDistractors(correctAnswer, [n], 'multiple', []);
        const options = formatOptions(optsArr, correctAnswer);
        const correct = findCorrectKey(options, correctAnswer);
        return { text, options, correct, level };
    }
}