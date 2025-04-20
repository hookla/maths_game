// js/generators/algebra.js
import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateAlgebraProblem(level) {
    let text = '';
    let correctAnswer = 0;
    let expressionString = ''; // For substitution problems
    let vars = {}; // Store variables used for distractors

    // *** NEW: Choose between Solving Equation and Substitution ***
    const problemType = (level >= 2 && Math.random() > 0.5) ? 'substitution' : 'solve_equation';

    if (problemType === 'solve_equation') { // Original logic
        const a = (level > 2) ? getRandomInt(2, 4) : 1;
        const b = getRandomInt(1, 10 + level);
        const x = getRandomInt(2, 8 + level); // The answer
        const c = a * x + b;
        correctAnswer = x;
        // Format the equation string
        const xTerm = a === 1 ? 'x' : `${a}x`;
        text = `If ${xTerm} + ${b} = ${c}, what is the value of x?`;
        vars = {a, b, c}; // Store for distractors

    } else { // *** NEW: Substitution Problem ***
        const xValue = getRandomInt(2, 10 + level);
        vars.x = xValue;
        const exprType = getRandomInt(1, 3); // Choose expression type

        if (exprType === 1) { // Simple ax + b
            const a = getRandomInt(2, 5 + level);
            const b = getRandomInt(1, 15 + level);
            correctAnswer = a * xValue + b;
            expressionString = `${a}x + ${b}`;
            vars.a = a; vars.b = b;
        } else if (exprType === 2) { // Simple a(x - b)
            const a = getRandomInt(2, 4 + level);
            // Ensure x - b is not zero or too small
            const b = getRandomInt(1, xValue -1);
             correctAnswer = a * (xValue - b);
            expressionString = `${a}(x - ${b})`;
             vars.a = a; vars.b = b;
        } else { // Simple ax - b
            const a = getRandomInt(2, 5 + level);
             // Ensure ax > b
             const b = getRandomInt(1, a * xValue -1);
             correctAnswer = a * xValue - b;
            expressionString = `${a}x - ${b}`;
             vars.a = a; vars.b = b;
        }

        text = `If x = ${xValue}, what is the value of ${expressionString}?`;
    }

    // Generate distractors - might need specific logic based on problem type
    const optionsArray = generateDistractors(correctAnswer, Object.values(vars), problemType);
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);

    return { text, options: formattedOptions, correct, level };
}