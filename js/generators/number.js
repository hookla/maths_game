import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

// Place Value: ask value of digit in a number
export function generatePlaceValueProblem(level) {
    // Generate a number up to millions depending on level
    const maxDigits = Math.min(6, level + 1);
    let num = '';
    for (let i = 0; i < maxDigits; i++) num += getRandomInt(i===0?1:0,9);
    const digits = num.split('');
    const idx = getRandomInt(0, digits.length - 1);
    const digit = digits[idx];
    const correctAnswer = parseInt(digit) * Math.pow(10, digits.length - 1 - idx);
    const text = `In the number ${num}, what is the place value of the digit ${digit}?`;
    const optsArr = generateDistractors(correctAnswer, [], '', []);
    const options = formatOptions(optsArr, correctAnswer);
    const correct = findCorrectKey(options, correctAnswer);
    return { text, options, correct, level };
}

// Rounding to nearest 10,100,1000
export function generateRoundingProblem(level) {
    const base = Math.pow(10, getRandomInt(1, Math.min(3, level+1)));
    const num = getRandomInt(base / 2, base * 10);
    const correctAnswer = Math.round(num / base) * base;
    const text = `Round ${num} to the nearest ${base}.`;
    const optsArr = generateDistractors(correctAnswer, [], '', []);
    const options = formatOptions(optsArr, correctAnswer);
    const correct = findCorrectKey(options, correctAnswer);
    return { text, options, correct, level };
}

// Negative numbers: compare or add/subtract negatives
export function generateNegativeNumbersProblem(level) {
    // Compare two negatives
    const a = -getRandomInt(1, level * 10);
    const b = -getRandomInt(1, level * 10);
    const text = `Which is greater: ${a} or ${b}?`;
    const correctAnswer = a > b ? a : b;
    const optsArr = [a, b];
    const options = formatOptions(optsArr, correctAnswer);
    const correct = findCorrectKey(options, correctAnswer);
    return { text, options, correct, level };
}

// Order of Operations: simple BODMAS
export function generateOrderOfOperationsProblem(level) {
    const a = getRandomInt(1, 10);
    const b = getRandomInt(1, 10);
    const c = getRandomInt(1, 10);
    const d = getRandomInt(1, 10);
    const expr = `${a} + ${b} × ${c} - ${d}`;
    const correctAnswer = a + b * c - d;
    const text = `Calculate: ${expr}`;
    const optsArr = generateDistractors(correctAnswer, [], '', []);
    const options = formatOptions(optsArr, correctAnswer);
    const correct = findCorrectKey(options, correctAnswer);
    return { text, options, correct, level };
}

// Multiply/Divide by 10,100,1000
export function generateShiftProblem(level) {
    const base = [10,100,1000][getRandomInt(0, Math.min(2, level))];
    const num = getRandomInt(1, level * 50);
    const op = Math.random() > 0.5 ? '×' : '÷';
    const correctAnswer = op === '×' ? num * base : num / base;
    const text = `What is ${num} ${op} ${base}?`;
    const optsArr = generateDistractors(correctAnswer, [], '', []);
    const options = formatOptions(optsArr, correctAnswer);
    const correct = findCorrectKey(options, correctAnswer);
    return { text, options, correct, level };
}