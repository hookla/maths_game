import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateSimpleWordProblem(level) {
    const opers = ['+','-','*'];
    const operation = opers[getRandomInt(0, Math.min(2, level))];
    const maxNum = level *15 + 10;
    let num1 = getRandomInt(5, maxNum);
    let num2 = getRandomInt(2, operation==='*' ? (level+4) : num1-1);
    if (operation==='-' && num1 < num2) [num1,num2] = [num2,num1];
    if (operation==='-' && num1===num2) num1++;
    const contexts = [
        { item:'apples', p:'buys', s:'sells'},
        { item:'books', p:'reads', s:'returns'},
        { item:'sweets', p:'gets', s:'eats'},
        { item:'marbles', p:'finds', s:'loses'}
    ];
    const ctx = contexts[getRandomInt(0, contexts.length-1)];
    let text = '';
    let correctAnswer = 0;
    switch(operation) {
        case '+':
            text = `Sarah has ${num1} ${ctx.item}. She ${ctx.p} ${num2} more. How many ${ctx.item} does she have now?`;
            correctAnswer = num1 + num2;
            break;
        case '-':
            text = `John starts with ${num1} ${ctx.item}. He ${ctx.s} ${num2}. How many are left?`;
            correctAnswer = num1 - num2;
            break;
        case '*':
            text = `There are ${num1} bags. Each bag contains ${num2} ${ctx.item}. How many ${ctx.item} are there in total?`;
            correctAnswer = num1 * num2;
            break;
    }
    const optionsArray = generateDistractors(correctAnswer, [num1,num2], operation);
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}