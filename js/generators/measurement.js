// js/generators/measurement.js
import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateMeasurementProblem(level) {
    const problemType = Math.random();
    let text = '';
    let correctAnswer = 0;
    let value = 0;

    // *** UPDATED: Added 'g', 'kg', 'ml', 'l' ***
    const units = ['mm', 'cm', 'm', 'km', 'g', 'kg', 'ml', 'l'];
    const conversionFactors = {
        'mm': { 'cm': 10, 'm': 1000 },
        'cm': { 'mm': 0.1, 'm': 100, 'km': 100000 },
        'm': { 'mm': 0.001, 'cm': 0.01, 'km': 1000 },
        'km': { 'm': 0.001, 'cm': 0.00001 },
        'g': { 'kg': 1000 }, // NEW
        'kg': { 'g': 0.001 }, // NEW
        'ml': { 'l': 1000 }, // NEW
        'l': { 'ml': 0.001 }  // NEW
    };

    if (problemType < 0.5) { // *** UPDATED: Unit Conversion (Length, Mass, Capacity) ***
        let fromUnit, toUnit;
        // Ensure compatible conversion exists
        do {
            fromUnit = units[getRandomInt(0, units.length - 1)];
            const possibleConversions = Object.keys(conversionFactors[fromUnit] || {});
            if (possibleConversions.length > 0) {
                toUnit = possibleConversions[getRandomInt(0, possibleConversions.length - 1)];
            } else {
                toUnit = null; // Force retry if no conversions defined for fromUnit
            }
        } while (!toUnit || !conversionFactors[fromUnit]?.[toUnit]);

        const factor = conversionFactors[fromUnit][toUnit];
        // Adjust random value based on unit to keep numbers reasonable
        let maxMultiplier = 50 + level * 20;
        if (fromUnit === 'mm' || fromUnit === 'ml' || fromUnit === 'g') maxMultiplier *= 10;
        if (fromUnit === 'km' || fromUnit === 'kg' || fromUnit === 'l') maxMultiplier = Math.max(10, Math.floor(maxMultiplier / 100));

        value = getRandomInt(1, maxMultiplier);

        // Ensure nice numbers for division if needed
        if (factor > 1) { // If dividing for conversion (e.g., m to km, factor is 1000)
             value = Math.ceil(value / factor) * factor; // Make value divisible by factor
             if (value === 0) value = factor; // Avoid value being 0
        }


        correctAnswer = parseFloat((value / factor).toFixed(4)); // Use parseFloat to remove trailing zeros if appropriate
        // Remove unnecessary trailing zeros and potentially '.0' for display
         correctAnswer = +correctAnswer;


        text = `Convert ${value}${fromUnit} to ${toUnit}`;

    } else if (problemType < 0.8) { // Perimeter/Area of Rectangle (Original)
        const length = getRandomInt(2, 10 + level * 2);
        const width = getRandomInt(1, length); // Width <= Length
        if (Math.random() < 0.5) { // Perimeter
            correctAnswer = 2 * (length + width);
            text = `What is the perimeter of a rectangle with length ${length}cm and width ${width}cm?`;
        } else { // Area
            correctAnswer = length * width;
            text = `What is the area of a rectangle with length ${length}cm and width ${width}cm?`;
        }
    } else { // Time Calculation (Original)
        const startHour = getRandomInt(0, 22);
        const startMinute = getRandomInt(0, 5) * 10; // 0, 10, 20, 30, 40, 50
        const durationHours = getRandomInt(0, 3 + level);
        const durationMinutes = getRandomInt(1, 5) * 10; // 10, 20, 30, 40, 50

        const startTime = new Date(2024, 0, 1, startHour, startMinute); // Use a fixed date
        const endTime = new Date(startTime.getTime() + (durationHours * 60 + durationMinutes) * 60000);

        const formatTime = (date) => `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        correctAnswer = formatTime(endTime);
        text = `A programme starts at ${formatTime(startTime)} and lasts for ${durationHours} hours and ${durationMinutes} minutes. What time does it finish?`;
    }

    // Generate appropriate distractors
    const optionsArray = generateDistractors(correctAnswer, [], '', typeof correctAnswer === 'string' ? undefined : [value]); // Pass value for numeric types
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);

    return { text, options: formattedOptions, correct, level };
}