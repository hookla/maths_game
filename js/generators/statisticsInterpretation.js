// js/generators/statisticsInterpretation.js
import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateStatsInterpretationProblem(level) {
    let text = '';
    let correctAnswer = 0;
    let context = []; // Store frequencies for distractors

    // For now, only one type: Simple Frequency Table (Text description)
    const categories = [
        { name: 'Favourite Colours', items: ['Red', 'Blue', 'Green', 'Yellow'] },
        { name: 'Favourite Pets', items: ['Dog', 'Cat', 'Fish', 'Rabbit'] },
        { name: 'Transport to School', items: ['Walk', 'Car', 'Bus', 'Cycle'] }
    ];
    const categorySet = categories[getRandomInt(0, categories.length - 1)];
    const numItems = getRandomInt(3, categorySet.items.length); // Use 3 or 4 items
    const chosenItems = categorySet.items.slice(0, numItems);

    let description = `A survey asked about ${categorySet.name}. The results were: `;
    let frequencies = {};
    let total = 0;
    let maxFreq = 0;
    let mostPopularItem = '';

    for (let i = 0; i < chosenItems.length; i++) {
        const item = chosenItems[i];
        const freq = getRandomInt(5, 20 + level * 5);
        frequencies[item] = freq;
        context.push(freq); // Add frequency to context for distractors
        total += freq;
        description += `${item} - ${freq}${i < chosenItems.length - 1 ? ', ' : '.'}`;
        if (freq > maxFreq) {
            maxFreq = freq;
            mostPopularItem = item;
        }
    }

    // Determine the question type
    const questionType = Math.random();

    if (questionType < 0.4) { // Ask for frequency of a specific item
        const itemToAsk = chosenItems[getRandomInt(0, chosenItems.length - 1)];
        correctAnswer = frequencies[itemToAsk];
        text = `${description} How many people chose ${itemToAsk}?`;
    } else if (questionType < 0.7) { // Ask for total surveyed
        correctAnswer = total;
        text = `${description} How many people were surveyed in total?`;
        context.push(total); // Add total to context
    } else { // Ask which was most popular
        correctAnswer = mostPopularItem; // Answer is a string
        text = `${description} Which ${categorySet.name.split(' ')[1].toLowerCase().replace('s','')} was the most popular?`;
         // Options generation needs to handle strings
         let optionsArray = [correctAnswer];
         let distractors = chosenItems.filter(item => item !== correctAnswer);
         distractors.sort(() => 0.5 - Math.random());
         optionsArray.push(...distractors.slice(0,4));
         while (optionsArray.length < 5) optionsArray.push(`Other Option ${optionsArray.length}`); // Basic fallback
         let formattedOptions = formatOptions(optionsArray, correctAnswer); // Ensure formatOptions handles strings
         let correct = findCorrectKey(formattedOptions, correctAnswer);
         return { text, options: formattedOptions, correct, level }; // Return early for string answers
    }


    // Common logic for numeric answers
    const optionsArray = generateDistractors(correctAnswer, context, 'stats');
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);

    return { text, options: formattedOptions, correct, level };
}