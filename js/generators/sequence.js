import { getRandomInt } from '../helpers.js';

export function generateSequenceProblem(level) {
    let sequenceType;
    // Determine sequence type based on level
    if (level <= 1) {
        sequenceType = 'simple_arithmetic_pos';
    } else if (level === 2) {
        // Add chance for negative step arithmetic
        sequenceType = (Math.random() < 0.6) ? 'simple_arithmetic_pos' : 'simple_arithmetic_neg';
    } else if (level === 3) {
        // Add chance for geometric or varying difference
        const rand = Math.random();
        if (rand < 0.4) sequenceType = 'simple_arithmetic_pos_neg'; // Mix pos/neg steps
        else if (rand < 0.7) sequenceType = 'simple_geometric';
        else sequenceType = 'varying_difference';
    } else { // Level 4+
        // More complex patterns, maybe ask for nth term or missing internal term
         const rand = Math.random();
        if (rand < 0.3) sequenceType = 'simple_arithmetic_pos_neg';
        else if (rand < 0.5) sequenceType = 'simple_geometric';
        else if (rand < 0.7) sequenceType = 'varying_difference';
        else sequenceType = 'complex_pattern'; // e.g., squares, alternating
    }

    let start, step, ratio, terms, missingIndex, questionType, text, correctAnswer, potentialDistractors;
    const sequenceLength = 6; // Generate 6 terms usually

    // --- Generate sequence based on type ---
    switch (sequenceType) {
        case 'simple_arithmetic_neg':
        case 'simple_arithmetic_pos':
        case 'simple_arithmetic_pos_neg':
            // Similar logic to original, but allow negative steps for neg/pos_neg
            start = getRandomInt(1, 30 + level * 5);
            if (sequenceType === 'simple_arithmetic_neg' || (sequenceType === 'simple_arithmetic_pos_neg' && Math.random() < 0.5)) {
                step = getRandomInt(- (2 + level), -2); // Negative step
                 // Ensure start is high enough for a few terms
                if (start + step * (sequenceLength -1) < 0) {
                     start = Math.abs(step * (sequenceLength -1)) + getRandomInt(5, 15);
                }
            } else {
                 step = getRandomInt(2, 5 + level); // Positive step
            }
            terms = [start];
            for (let i = 1; i < sequenceLength; i++) terms.push(terms[i - 1] + step);
            break;

        case 'simple_geometric':
            // Simple integer ratios (x2, x3, /2, /3 maybe)
            ratio = (Math.random() < 0.5) ? getRandomInt(2, 3 + Math.floor(level/2)) : 1 / getRandomInt(2, 3);
            start = (ratio > 1) ? getRandomInt(1, 5 + level) : getRandomInt(10, 30 + level*5) * Math.abs(1/ratio); // Ensure start is divisible if ratio < 1
             // Ensure start is appropriately divisible for division sequences
            if(ratio < 1) {
                let denominator = 1/ratio;
                // Ensure start is divisible enough times
                let requiredMultiple = Math.pow(denominator, sequenceLength - 1);
                start = Math.ceil(getRandomInt(1, 5) * requiredMultiple / denominator) * denominator; // Generate a suitable multiple
                 if(start === 0) start = requiredMultiple; // Handle edge case if random is 0
            }

            terms = [start];
            for (let i = 1; i < sequenceLength; i++) {
                 let nextTerm = terms[i-1] * ratio;
                 // Handle potential floating point issues slightly for simple division
                 if (ratio < 1 && nextTerm !== Math.floor(nextTerm)) {
                    // This shouldn't happen with the start calculation, but as a fallback:
                    nextTerm = Math.round(nextTerm); // Or maybe stop sequence? For 11+ stick to integers mostly.
                 }
                 // Stop if terms get too large/small or non-integer for division
                 if (Math.abs(nextTerm) > 1000 || Math.abs(nextTerm) < 0.1 && nextTerm !== 0) break;
                 terms.push(nextTerm);
            }
             // Recalculate sequenceLength if it broke early
             // sequenceLength = terms.length; // Re-evaluate if this is needed or if we just fail generation
             if (terms.length < 4) return generateSequenceProblem(level); // Regenerate if sequence is too short

            break;

        case 'varying_difference': {
            start = getRandomInt(1, 20 + level * 3);
            let initialStep = getRandomInt(1, 3 + level);
            let stepChange = (Math.random() < 0.5) ? 1 : -1; // Difference increases or decreases
            if (initialStep <= 1 && stepChange === -1) stepChange = 1; // Avoid step becoming too small too quickly
            terms = [start];
            let currentStep = initialStep;
            for (let i = 1; i < sequenceLength; i++) {
                terms.push(terms[i - 1] + currentStep);
                currentStep += stepChange;
            }
            break;
        }

        case 'complex_pattern': { // e.g., square numbers, alternating operation
            const patternType = Math.random();
            if (patternType < 0.5) { // Square numbers +/- constant
                // const opRand = Math.random(); // removed unused variable
                 const constOffset = getRandomInt(-3, 3);
                 terms = [];
                 for (let i = 1; i <= sequenceLength; i++) {
                    terms.push(i*i + constOffset);
                 }
            } else { // Alternating operation +a, -b
                start = getRandomInt(10, 30 + level * 5);
                let stepA = getRandomInt(2, 5 + level);
                let stepB = getRandomInt(-(5 + level), -2);
                 terms = [start];
                for (let i = 1; i < sequenceLength; i++) {
                    terms.push(terms[i-1] + (i % 2 === 1 ? stepA : stepB)); // Alternate +a, -b
                 }
            }
            break;
        }

        default: // Fallback to simple arithmetic
            start = getRandomInt(1, 20);
            step = getRandomInt(2, 5);
            terms = [start];
            for (let i = 1; i < sequenceLength; i++) terms.push(terms[i - 1] + step);
            break; // Should not happen
    }


    // --- Determine Question Type & Missing Index ---
    // Allow asking for internal missing term at higher levels
     let minVisible = 3; // Need at least 3 terms shown usually

    if (level >= 3 && Math.random() < 0.4) { // 40% chance to ask for internal missing term level 3+
        questionType = 'missing_internal';
        // Ensure we don't pick index 0, 1, or 2 as missing (need terms before it)
        missingIndex = getRandomInt(minVisible, terms.length - 2); // Don't pick the very last one either for this type
         correctAnswer = terms[missingIndex];
         // Show terms before and after missing one. e.g., [a, b, c, __, e, f]
         // Need to show terms up to missingIndex-1 and from missingIndex+1
         let termsBefore = terms.slice(0, missingIndex).join(', ');
         // For 11+ simplicity, maybe just show the term after? Or just before?
         // Let's show terms before, placeholder, and term after
         let termAfter = terms[missingIndex+1];
         text = `Find the missing number: ${termsBefore}, __, ${termAfter}, ...`;

    } else { // Ask for the next term (most common)
        questionType = 'next_term';
        // Decide how many terms to show (3, 4 or 5)
        let showCount = getRandomInt(minVisible, terms.length - 1);
        missingIndex = showCount; // The index of the term *after* the last shown term
        correctAnswer = terms[missingIndex];
        text = `What is the next number in the sequence: ${terms.slice(0, missingIndex).join(', ')}, ...?`;
    }
     // Handle case where sequence generation was shorter than planned
     if (missingIndex >= terms.length) {
         // This might happen if geometric sequence terms grew too fast/small
         // Or maybe we didn't generate enough terms for the chosen question type
         // Simplest fix: regenerate the problem
         console.warn("Regenerating sequence due to length issue.");
         return generateSequenceProblem(level);
     }


    // --- Generate Distractors ---
    // This part needs careful thought based on sequence type and likely errors
    potentialDistractors = new Set(); // Use a Set to avoid duplicates easily

    // Generic distractors
    if (missingIndex > 0) potentialDistractors.add(terms[missingIndex - 1]); // Previous term
    if (missingIndex < terms.length - 1) potentialDistractors.add(terms[missingIndex + 1]); // Next term (if asking for internal)
    potentialDistractors.add(correctAnswer + getRandomInt(1, 3)); // Close incorrect
    potentialDistractors.add(correctAnswer - getRandomInt(1, 3)); // Close incorrect

    // Type-specific distractors
    if (sequenceType.includes('arithmetic')) {
        if (step) {
             if (missingIndex > 0) potentialDistractors.add(terms[missingIndex - 1] + (step > 0 ? step + 1 : step - 1)); // Incorrect step calculation
             if (missingIndex > 1) potentialDistractors.add(terms[missingIndex - 1] + terms[missingIndex - 2]); // Fibonacci mistake
        }
    } else if (sequenceType.includes('geometric')) {
         if (ratio && missingIndex > 0) {
            potentialDistractors.add(terms[missingIndex-1] + ratio); // Add ratio instead of multiply
            potentialDistractors.add(terms[missingIndex-1] * (ratio + (ratio > 1 ? 1 : -0.5))); // Incorrect ratio
             if(ratio < 1) potentialDistractors.add(terms[missingIndex-1] / (1/ratio + 1) ); // Incorrect division
         }
    } else if (sequenceType === 'varying_difference') {
         // Continue pattern incorrectly, e.g. use last step again
         if (missingIndex > 1) {
            let lastStepUsed = terms[missingIndex - 1] - terms[missingIndex - 2];
            potentialDistractors.add(terms[missingIndex - 1] + lastStepUsed);
         }
    } else if (sequenceType === 'complex_pattern') {
        // Add distractors based on misinterpreting the specific pattern (e.g., wrong alternating step)
         if (terms.length > 2) {
             potentialDistractors.add(terms[missingIndex - 1] + (terms[missingIndex - 1] - terms[missingIndex - 2])); // Repeat last difference
         }
    }

    // Filter out the correct answer from distractors and ensure they are numbers
    potentialDistractors.delete(correctAnswer);
    let distractors = Array.from(potentialDistractors).filter(d => typeof d === 'number' && Number.isInteger(d)); // Stick to integers for 11+ usually


    // --- Finalize Options (Needs external helper functions) ---
    // Assume generateDistractors intelligently selects from the pool and adds random ones if needed
    // Assume formatOptions creates { A: val1, B: val2, ... }
    // Assume findCorrectKey finds the letter for the correct answer

    // **Simulation of final steps:**
    let finalOptionsRaw = [correctAnswer];
    // Shuffle distractors and pick 3-4 unique ones
    distractors.sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(distractors.length, 4); i++) {
         finalOptionsRaw.push(distractors[i]);
    }
    // Ensure we have 4 or 5 options total, add random if needed
    while (finalOptionsRaw.length < 5) {
        let randomOpt = correctAnswer + getRandomInt(-10, 10);
        if (randomOpt !== correctAnswer && !finalOptionsRaw.includes(randomOpt)) {
            finalOptionsRaw.push(randomOpt);
        }
    }
    // Shuffle the final raw options before assigning letters
     finalOptionsRaw.sort(() => Math.random() - 0.5);

     // --- !! Replace below with calls to your actual helper functions !! ---
    // Simulated formatted options (replace with call to formatOptions)
     const formattedOptions = {};
     const keys = ['A', 'B', 'C', 'D', 'E'];
     let correctKey = '';
     finalOptionsRaw.slice(0, 5).forEach((opt, index) => {
         let key = keys[index];
         formattedOptions[key] = opt;
         if (opt === correctAnswer) {
             correctKey = key;
         }
     });
     // If correctAnswer wasn't included somehow (error state), handle it
     if (!correctKey) {
         console.error("Correct answer missing from final options!");
         // Simple fix: put correct answer as option A and reshuffle others
         let otherOptions = finalOptionsRaw.filter(o => o !== correctAnswer);
         otherOptions.sort(() => Math.random() - 0.5);
         formattedOptions['A'] = correctAnswer;
         correctKey = 'A';
         keys.slice(1).forEach((key, index) => {
             if(index < otherOptions.length) {
                 formattedOptions[key] = otherOptions[index];
             } else {
                  // Need fallback if not enough unique options generated
                  formattedOptions[key] = correctAnswer + index + 1; // Placeholder
             }
         });

     }
     // --- !! End of section to replace !! ---


    return {
        text,
        options: formattedOptions, // Use the output from your formatOptions function
        correct: correctKey,       // Use the output from your findCorrectKey function
        level,
        debug_sequence: terms, // Optional: For debugging purposes
        debug_type: sequenceType, // Optional: For debugging
        debug_questionType: questionType // Optional: For debugging
    };
}


// --- Example Usage (Illustrative) ---
/*
// Assume generateDistractors, formatOptions, findCorrectKey exist elsewhere

for (let lvl = 1; lvl <= 4; lvl++) {
    console.log(`\n--- Level ${lvl} Problem ---`);
    let problem = generateSequenceProblem(lvl);
    console.log(`Type: ${problem.debug_type}`);
    console.log(`Sequence: ${problem.debug_sequence.join(', ')}`);
    console.log(problem.text);
    console.log(problem.options);
    console.log(`Correct Answer Key: ${problem.correct} (Value: ${problem.options[problem.correct]})`);
}
*/