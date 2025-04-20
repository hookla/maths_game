// js/generators/percentage.js
import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generatePercentageProblem(level) {
    const percentages = [10, 20, 25, 50, 75]; // Keep simple percentages for now
    if (level > 2) percentages.push(5, 15, 30, 40, 60); // Add more at higher levels
    const percent = percentages[getRandomInt(0, percentages.length - 1)];

    let text = '';
    let correctAnswer = 0;
    let originalAmount = 0;

    // *** NEW: Add Increase/Decrease Types ***
    const problemType = Math.random();

    if (problemType < 0.5 || level < 2) { // Type 1: Find percentage of amount (Original)
        // Generate amount divisible by necessary factors for the percentage
        let multiplier = 1;
        if (percent === 10 || percent === 20 || percent === 30 || percent === 40 || percent === 60) multiplier = 10;
        if (percent === 25 || percent === 75) multiplier = 4;
        if (percent === 50) multiplier = 2;
        if (percent === 5 || percent === 15) multiplier = 20; // Need divisibility by 20

        const baseValue = getRandomInt(1, 10 + level * 2);
        originalAmount = baseValue * multiplier;

        correctAnswer = (percent / 100) * originalAmount;
        text = `What is ${percent}% of ${originalAmount}?`;

    } else if (problemType < 0.75) { // Type 2: Percentage Increase
        let multiplier = 1; // As above to ensure clean calculations
        if (percent === 10 || percent === 20 || percent === 30 || percent === 40 || percent === 60) multiplier = 10;
        if (percent === 25 || percent === 75) multiplier = 4;
        if (percent === 50) multiplier = 2;
        if (percent === 5 || percent === 15) multiplier = 20;

        const baseValue = getRandomInt(1, 10 + level * 2);
        originalAmount = baseValue * multiplier;

        const increaseAmount = (percent / 100) * originalAmount;
        correctAnswer = originalAmount + increaseAmount;
        text = `Increase ${originalAmount} by ${percent}%`;

    } else { // Type 3: Percentage Decrease
         let multiplier = 1; // As above
        if (percent === 10 || percent === 20 || percent === 30 || percent === 40 || percent === 60) multiplier = 10;
        if (percent === 25 || percent === 75) multiplier = 4;
        if (percent === 50) multiplier = 2;
        if (percent === 5 || percent === 15) multiplier = 20;

        const baseValue = getRandomInt(1, 10 + level * 2);
        originalAmount = baseValue * multiplier;

        const decreaseAmount = (percent / 100) * originalAmount;
        correctAnswer = originalAmount - decreaseAmount;
        text = `Decrease ${originalAmount} by ${percent}%`;
    }

    // Generate distractors, passing original amount might be helpful
    const optionsArray = generateDistractors(correctAnswer, [originalAmount, percent], '%');
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);

    return { text, options: formattedOptions, correct, level };
}