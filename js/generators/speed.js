// js/generators/speed.js
import { getRandomInt } from '../helpers.js';
// Assuming distractors.js handles basic numerical distractors if needed
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateSpeedProblem(level) {
    let text = '';
    let correctAnswer = 0;
    const type = Math.random(); // Choose between distance, time, or speed calculation

    if (type < 0.4) { // Calculate Distance (Original)
        const speed = getRandomInt(10, level * 10 + 40); // km/h
        const time = getRandomInt(2, level + 4); // hours
        correctAnswer = speed * time;
        text = `How far do you travel going at ${speed} km/h for ${time} hours? (in km)`;
    } else if (type < 0.8) { // Calculate Time (Original - slight adjustment for non-integer times)
        const speed = getRandomInt(10, level * 10 + 40); // km/h
        // Ensure time is reasonable, allow decimals for time
        const timeHours = getRandomInt(1, level + 3) + (Math.random() < 0.5 ? 0.5 : 0); // e.g., 2 hrs, 2.5 hrs etc.
        const distance = speed * timeHours;
        correctAnswer = timeHours;
        text = `How long does it take to travel ${distance} km at ${speed} km/h?`; // Answer expected in hours e.g. 2.5
    } else { // *** NEW: Calculate Speed ***
        const time = getRandomInt(2, level + 4); // hours
        // Generate speed first to ensure distance/time gives a nice speed answer
        const speed = getRandomInt(10, level * 10 + 40); // km/h
        const distance = speed * time;
        correctAnswer = speed;
        text = `What speed is needed to travel ${distance} km in ${time} hours? (in km/h)`;
    }

    // Generate distractors (using the generic numerical generator for simplicity here)
    // You might want more specific distractors based on common S=D/T errors
    const optionsArray = generateDistractors(correctAnswer, [], ''); // Provide empty array/op for generic numeric
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);

    return { text, options: formattedOptions, correct, level };
}