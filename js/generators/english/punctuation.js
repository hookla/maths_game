// js/generators/punctuation.js
import { getRandomInt, shuffleArray } from '../../helpers.js';
// We need formatOptions and findCorrectKey that handle strings
import { formatOptions, findCorrectKey } from '../distractors.js';

// --- Sample Data (Expand these lists!) ---
const simpleNouns = ['dog', 'cat', 'boy', 'girl', 'car', 'tree', 'bird', 'ball'];
const simpleVerbsPast = ['chased', 'climbed', 'saw', 'kicked', 'helped', 'found'];
const simpleAdjectives = ['big', 'small', 'happy', 'sad', 'red', 'fast'];
const names = ['Sam', 'Lucy', 'Tom', 'Anna'];
const objects = ['ball', 'book', 'hat', 'bike'];
const listItems = ['apples', 'bananas', 'pears', 'oranges', 'grapes', 'lemons'];

const contractions = [
    { pair: ["do not", "don't"], level: 1 },
    { pair: ["I am", "I'm"], level: 1 },
    { pair: ["it is", "it's"], level: 1 }, // Common confusion with 'its'
    { pair: ["they are", "they're"], level: 2 }, // Common confusion with 'their/there'
    { pair: ["you are", "you're"], level: 2 }, // Common confusion with 'your'
    { pair: ["he is", "he's"], level: 2 },
    { pair: ["she is", "she's"], level: 2 },
    { pair: ["we are", "we're"], level: 2 },
    { pair: ["cannot", "can't"], level: 2 },
    { pair: ["would not", "wouldn't"], level: 3 },
    { pair: ["could not", "couldn't"], level: 3 },
];

// --- Generator Function ---
export function generatePunctuationProblem(level) {
    const problemTypes = ['endPunctuation'];
    if (level >= 1) problemTypes.push('contractionApostrophe');
    if (level >= 2) problemTypes.push('listComma'); // Add comma lists at level 2+

    const type = problemTypes[getRandomInt(0, problemTypes.length - 1)];

    let text = '';
    let correctAnswer = '';
    let optionsArray = []; // Array of sentence strings

    switch (type) {
        case 'endPunctuation': {
            text = "Which sentence has the correct end punctuation?";
            const noun = simpleNouns[getRandomInt(0, simpleNouns.length - 1)];
            const verb = simpleVerbsPast[getRandomInt(0, simpleVerbsPast.length - 1)];
            const adj = simpleAdjectives[getRandomInt(0, simpleAdjectives.length - 1)];
            const obj = objects[getRandomInt(0, objects.length - 1)];

            if (Math.random() < 0.5) { // Statement needing full stop
                correctAnswer = `The ${adj} ${noun} ${verb} the ${obj}.`;
                optionsArray = [
                    correctAnswer,
                    `The ${adj} ${noun} ${verb} the ${obj}?`, // Incorrect: Question Mark
                    `The ${adj} ${noun} ${verb} the ${obj}!`, // Plausible but less likely correct than '.'
                    `The ${adj} ${noun} ${verb} the ${obj}`,  // Incorrect: No punctuation
                ];
            } else { // Question needing question mark
                correctAnswer = `Did the ${adj} ${noun} ${verb} the ${obj}?`;
                optionsArray = [
                    correctAnswer,
                    `Did the ${adj} ${noun} ${verb} the ${obj}.`, // Incorrect: Full Stop
                    `Did the ${adj} ${noun} ${verb} the ${obj}!`, // Incorrect: Exclamation
                    `Did the ${adj} ${noun} ${verb} the ${obj}`,  // Incorrect: No punctuation
                ];
            }
            break;
        }

        case 'contractionApostrophe': {
            text = "Which sentence uses the apostrophe correctly?";
            // Filter contractions by level
            const availableContractions = contractions.filter(c => c.level <= level);
            if (availableContractions.length === 0) return generatePunctuationProblem(level); // Retry if none available

            const { pair } = availableContractions[getRandomInt(0, availableContractions.length - 1)];
            const [uncontracted, contracted] = pair;

            // Basic sentence structures using the contraction
            let sentenceStructure;
            if (uncontracted === "I am") sentenceStructure = 0;
            else if (uncontracted === "it is") sentenceStructure = 1;
            else sentenceStructure = getRandomInt(0, 2); // Use different sentence types

            correctAnswer = '';
            optionsArray = [];
            let incorrectPossessive = ''; // For it's/its confusion
            let incorrectPlural = ''; // For you're/your confusion
            let incorrectHomophone = ''; // For they're/their/there confusion

            switch (sentenceStructure) {
                case 0: // Subject + contraction + adjective
                    correctAnswer = `${contracted} feeling ${simpleAdjectives[getRandomInt(0, simpleAdjectives.length - 1)]}.`;
                    optionsArray.push(correctAnswer);
                    optionsArray.push(`${uncontracted} feeling ${simpleAdjectives[getRandomInt(0, simpleAdjectives.length - 1)]}.`); // Correct grammar, but not using apostrophe
                    // Add incorrect apostrophe usage
                    if (contracted === "it's") incorrectPossessive = `Its feeling ${simpleAdjectives[getRandomInt(0, simpleAdjectives.length - 1)]}.`;
                    if (contracted === "you're") incorrectPlural = `Your feeling ${simpleAdjectives[getRandomInt(0, simpleAdjectives.length - 1)]}.`;
                     if (contracted === "they're") incorrectHomophone = `Their feeling ${simpleAdjectives[getRandomInt(0, simpleAdjectives.length - 1)]}.`;
                    break;
                case 1: // Contraction + adjective/verb-ing
                    correctAnswer = `${contracted} ${simpleAdjectives[getRandomInt(0, simpleAdjectives.length - 1)]}.`;
                     optionsArray.push(correctAnswer);
                     optionsArray.push(`${uncontracted} ${simpleAdjectives[getRandomInt(0, simpleAdjectives.length - 1)]}.`);
                    if (contracted === "it's") incorrectPossessive = `Its ${simpleAdjectives[getRandomInt(0, simpleAdjectives.length - 1)]}.`;
                     if (contracted === "you're") incorrectPlural = `Your ${simpleAdjectives[getRandomInt(0, simpleAdjectives.length - 1)]}.`;
                     if (contracted === "they're") incorrectHomophone = `There ${simpleAdjectives[getRandomInt(0, simpleAdjectives.length - 1)]}.`;
                    break;
                case 2: // Subject + contraction + verb-ing + object
                default:
                     correctAnswer = `${names[getRandomInt(0, names.length - 1)]} ${contracted.replace(/^./, c => c.toLowerCase())} ${simpleVerbsPast[getRandomInt(0, simpleVerbsPast.length - 1)].replace(/ed$/,'ing')} the ${objects[getRandomInt(0, objects.length - 1)]}.`;
                    optionsArray.push(correctAnswer);
                    optionsArray.push(`${names[getRandomInt(0, names.length - 1)]} ${uncontracted} ${simpleVerbsPast[getRandomInt(0, simpleVerbsPast.length - 1)].replace(/ed$/,'ing')} the ${objects[getRandomInt(0, objects.length - 1)]}.`);
                     // Add incorrect placement/form if possible (simple case: remove apostrophe)
                     optionsArray.push(correctAnswer.replace("'", ""));
                     if (contracted === "it's") incorrectPossessive = `${names[getRandomInt(0, names.length - 1)]} its ${simpleVerbsPast[getRandomInt(0, simpleVerbsPast.length - 1)].replace(/ed$/,'ing')} the ${objects[getRandomInt(0, objects.length - 1)]}.`;
                    break;
            }

            // Add specific common errors as distractors if generated
            if (incorrectPossessive) optionsArray.push(incorrectPossessive);
            if (incorrectPlural) optionsArray.push(incorrectPlural);
            if (incorrectHomophone) optionsArray.push(incorrectHomophone);

            break;
        }

        case 'listComma': {
             text = "Which sentence uses commas correctly for the list?";
             shuffleArray(listItems);
             const item1 = listItems[0];
             const item2 = listItems[1];
             const item3 = listItems[2];

             // Oxford comma (comma before 'and') is debated, but often preferred/tested for clarity in 11+. Let's use it.
             correctAnswer = `She bought ${item1}, ${item2}, and ${item3}.`;
             optionsArray = [
                 correctAnswer,
                 `She bought ${item1}, ${item2} and ${item3}.`, // Missing Oxford comma
                 `She bought ${item1} ${item2}, and ${item3}.`, // Missing first comma
                 `She bought ${item1} ${item2} and ${item3}.`,  // Missing all commas
             ];
            break;
        }

        default:
            console.error("Unknown punctuation problem type:", type);
            return generatePunctuationProblem(level); // Retry
    }

    // --- Format Options ---
    // Ensure we have 5 unique options (add dummy variations if needed)
    let finalOptions = [...new Set(optionsArray)]; // Remove duplicates
    let dummyCount = 1;
     while (finalOptions.length < 5) {
         finalOptions.push(`Incorrect variation ${dummyCount++}`); // Very basic fallback
     }

     // Ensure correct answer is present
     if (!finalOptions.includes(correctAnswer)) {
         finalOptions.pop();
         finalOptions.push(correctAnswer);
     }

    shuffleArray(finalOptions);

    // Use your existing formatting functions (ensure they handle strings)
    const formattedOptions = formatOptions(finalOptions.slice(0, 5), correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);

    return { text, options: formattedOptions, correct, level };
}