# Math Quest Generators

## js/generators/addition.js
```js
import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateAdditionProblem(level) {
    const maxNum = level * 20 + 10;
    const num1 = getRandomInt(1, maxNum);
    const num2 = getRandomInt(1, maxNum);
    const correctAnswer = num1 + num2;
    const text = `What is ${num1} + ${num2}?`;
    const optionsArray = generateDistractors(correctAnswer, [num1, num2], '+');
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}
```

## js/generators/algebra.js
```js
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
```

## js/generators/conversion.js
```js
import { getRandomInt, simplifyFraction, formatNumber } from '../helpers.js';
import { findCorrectKey } from './distractors.js';

// Conversions between fractions, decimals, and percentages
export function generateConversionProblem(level) {
    const type = getRandomInt(1, 3);
    let text, correctAnswer;
    if (type === 1) {
        // Fraction to decimal (2 dp)
        const den = [2,4,5,8,10][getRandomInt(0, Math.min(4, level))];
        const num = getRandomInt(1, den - 1);
        const val = num / den;
        correctAnswer = formatNumber(val);
        text = `Express <sup>${num}</sup>&frasl;<sub>${den}</sub> as a decimal (to 2 decimal places).`;
    } else if (type === 2) {
        // Decimal to fraction
        const denom = [2,4,5,8,10,100][getRandomInt(0, Math.min(5, level+1))];
        const numerator = getRandomInt(1, denom - 1);
        const dec = numerator / denom;
        const simp = simplifyFraction(numerator, denom);
        correctAnswer = `${simp.num}/${simp.den}`;
        text = `Convert ${formatNumber(dec)} to a fraction in simplest form.`;
    } else {
        // Decimal to percentage
        const perc = [10,20,25,50,75][getRandomInt(0, Math.min(4, level))];
        correctAnswer = `${perc}%`;
        text = `Express ${perc/100} as a percentage.`;
    }
    // Build simple options: correct plus near distractors
    const baseVals = [correctAnswer];
    if (type === 1 || type === 3) {
        // decimal or percentage treat as number
        const val = parseFloat(correctAnswer);
        baseVals.push(val + 0.1, val - 0.1);
    } else {
        // fraction string may be manipulated
        baseVals.push('1/2','2/3','3/4');
    }
    const formatted = baseVals.map(formatNumber);
    const opts = {};
    ['A','B','C','D','E'].forEach((k,i) => opts[k] = formatted[i % formatted.length]);
    const correct = findCorrectKey(opts, correctAnswer);
    return { text, options: opts, correct, level };
}
```

## js/generators/data.js
```js
import { getRandomInt } from '../helpers.js';
import { findCorrectKey } from './distractors.js';

// Statistics: mean, median, mode, range
export function generateDataProblem(level) {
    // Generate dataset
    const size = getRandomInt(5, 7);
    const data = Array.from({length: size}, () => getRandomInt(1, level * 10 + 5));
    data.sort((a,b)=>a-b);
    // Choose measure
    const types = ['mean','median','mode','range'];
    const type = types[getRandomInt(0, types.length - 1)];
    let correctAnswer;
    if (type === 'mean') {
        const sum = data.reduce((a,b)=>a+b,0);
        correctAnswer = parseFloat((sum / size).toFixed(1));
    } else if (type === 'median') {
        correctAnswer = size % 2 === 1 ? data[(size-1)/2] : (data[size/2 -1] + data[size/2]) /2;
    } else if (type === 'mode') {
        const freq = {};
        data.forEach(v=>freq[v]=(freq[v]||0)+1);
        const maxFreq = Math.max(...Object.values(freq));
        const modes = Object.keys(freq).filter(k=>freq[k]===maxFreq);
        correctAnswer = parseInt(modes[0]);
    } else { // range
        correctAnswer = data[data.length-1] - data[0];
    }
    const text = `Given the data set: ${data.join(', ')}, what is the ${type}?`;
    const optsArr = [correctAnswer, correctAnswer+ getRandomInt(1,3), correctAnswer - getRandomInt(1,3), data[0], data[data.length-1]];
    const formatted = optsArr.map(v=>v.toString());
    const options = {};
    ['A','B','C','D','E'].forEach((k,i) => options[k] = formatted[i]);
    const correct = findCorrectKey(options, correctAnswer);
    return { text, options, correct, level };
}
```

## js/generators/distractors.js
```js
import { shuffleArray, getRandomInt, formatNumber, simplifyFraction } from '../helpers.js';

export function generateDistractors(correctAnswer, operands = [], operation = '', initialDistractors = []) {
    const formattedCorrect = formatNumber(correctAnswer);
    let distractors = new Set(initialDistractors.map(formatNumber));
    distractors.add(formattedCorrect);
    // Common numeric variations
    distractors.add(formatNumber(correctAnswer + 1));
    distractors.add(formatNumber(correctAnswer - 1));
    if (correctAnswer > 10) {
        distractors.add(formatNumber(correctAnswer + 10));
        distractors.add(formatNumber(correctAnswer - 10));
    }
    if (operands.length === 2) {
        const [op1, op2] = operands;
        if (operation !== '+' && formatNumber(op1 + op2) !== formattedCorrect) distractors.add(formatNumber(op1 + op2));
        if (operation !== '-' && formatNumber(op1 - op2) !== formattedCorrect) distractors.add(formatNumber(op1 - op2));
        if (operation !== '*' && formatNumber(op1 * op2) !== formattedCorrect) distractors.add(formatNumber(op1 * op2));
        if (operation !== '/' && op2 !== 0 && Number.isInteger(op1 / op2) && formatNumber(op1 / op2) !== formattedCorrect) distractors.add(formatNumber(op1 / op2));
        distractors.add(formatNumber(op1));
        distractors.add(formatNumber(op2));
    }
    let options = Array.from(distractors).filter(d =>
        d !== undefined && d !== null && d !== '' &&
        (formattedCorrect.startsWith('-') ? true : parseFloat(d.replace(/[^\d.-]/g, '')) >= 0)
    );
    // Exclude correct for selection
    options = options.filter(d => d !== formattedCorrect);
    shuffleArray(options);
    let chosen = options.slice(0, 4);
    chosen.push(formattedCorrect);
    // Fill if underfull
    let attempts = 0;
    while (chosen.length < 5 && attempts < 20) {
        let rnd = correctAnswer + getRandomInt(2, 15) * (Math.random() > 0.5 ? 1 : -1);
        let str = formatNumber(rnd);
        if (!chosen.includes(str) && (rnd >= 0 || formattedCorrect.startsWith('-'))) chosen.push(str);
        attempts++;
    }
    chosen = [...new Set(chosen)];
    attempts = 0;
    while (chosen.length < 5 && attempts < 10) {
        let rnd = correctAnswer + getRandomInt(16, 30) * (Math.random() > 0.5 ? 1 : -1);
        let str = formatNumber(rnd);
        if (!chosen.includes(str) && (rnd >= 0 || formattedCorrect.startsWith('-'))) chosen.push(str);
        attempts++;
    }
    if (!chosen.includes(formattedCorrect)) {
        chosen.pop();
        chosen.push(formattedCorrect);
    }
    return chosen.slice(0, 5);
}

export function generateFractionDistractors(correctStr, level) {
    let distractors = new Set([correctStr]);
    try {
        const [num, den] = correctStr.split('/').map(Number);
        if (num > 1) distractors.add(formatNumber(simplifyFraction(num - 1, den)));
        else distractors.add(formatNumber(simplifyFraction(1, den + 1)));
        distractors.add(formatNumber(simplifyFraction(num + 1, den)));
        if (den > 1) distractors.add(formatNumber(simplifyFraction(num, den - 1)));
        else distractors.add(formatNumber(simplifyFraction(num + 1, 1)));
        distractors.add(formatNumber(simplifyFraction(num, den + 1)));
        distractors.add(`${num * 2}/${den * 2}`);
        distractors.add(`${den}/${num}`);
    } catch (e) {
        console.error("Error parsing fraction for distractors:", correctStr, e);
    }
    let options = Array.from(distractors).filter(d => d !== correctStr && d && !d.includes('/0'));
    shuffleArray(options);
    let chosen = options.slice(0, 4);
    chosen.push(correctStr);
    let attempts = 0;
    while (chosen.length < 5 && attempts < 20) {
        const rn = getRandomInt(1, 10 + level);
        const rd = getRandomInt(rn + 1, 15 + level);
        const sf = simplifyFraction(rn, rd);
        const frac = `${sf.num}/${sf.den}`;
        if (!chosen.includes(frac)) chosen.push(frac);
        attempts++;
    }
    if (!chosen.includes(correctStr)) {
        chosen.pop();
        chosen.push(correctStr);
    }
    return chosen.slice(0, 5);
}

export function formatOptions(arr, correctAnswer) {
    const fa = formatNumber(correctAnswer);
    let formatted = arr.map(formatNumber);
    if (!formatted.includes(fa)) {
        console.error("Correct answer missing before final formatting!", fa, formatted);
        if (formatted.length) formatted.pop();
        formatted.push(fa);
    }
    while (formatted.length < 5) {
        let rnd = correctAnswer + getRandomInt(5, 25) * (Math.random() > 0.5 ? 1 : -1);
        let str = formatNumber(rnd);
        if (!formatted.includes(str)) formatted.push(str);
    }
    formatted = [...new Set(formatted)];
    while (formatted.length < 5) {
        let rnd = correctAnswer + getRandomInt(26, 50) * (Math.random() > 0.5 ? 1 : -1);
        let str = formatNumber(rnd);
        if (!formatted.includes(str)) formatted.push(str);
    }
    if (!formatted.includes(fa)) formatted[4] = fa;
    shuffleArray(formatted);
    const keys = ['A','B','C','D','E'];
    let opts = {};
    for (let i = 0; i < 5; i++) opts[keys[i]] = formatted[i];
    return opts;
}

export function findCorrectKey(opts, correctAnswer) {
    const fa = formatNumber(correctAnswer);
    for (const k in opts) {
        if (opts[k] === fa) return k;
    }
    console.error(`Correct answer key not found! Searched for "${fa}" in`, opts);
    for (const k in opts) {
        if (String(opts[k]) === String(correctAnswer)) return k;
    }
    return 'A';
}
```

## js/generators/division.js
```js
import { getRandomInt, formatNumber } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateDivisionProblem(level) {
    const maxDivisor = level + 3;
    const divisor = getRandomInt(2, maxDivisor);
    const quotient = getRandomInt(2, 12 + level);
    const dividend = divisor * quotient;
    const correctAnswer = quotient;
    const text = `What is ${dividend} ÷ ${divisor}?`;
    let optionsArray = generateDistractors(correctAnswer, [dividend, divisor], '/');
    if (!optionsArray.map(formatNumber).includes(formatNumber(dividend)) && optionsArray.length < 5) {
        optionsArray.push(dividend);
    }
    optionsArray = optionsArray.slice(0, 5);
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}
```

## js/generators/fraction.js
```js
import { getRandomInt, simplifyFraction } from '../helpers.js';
import { generateFractionDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateFractionProblem(level) {
    const den1 = [2,3,4,5,6,8,10][getRandomInt(0, level+1)];
    let num1 = getRandomInt(1, den1 - 1);
    let operation = 'equivalent';
    let text = '';
    let correctAnswer = '';

    if (level >= 2 && Math.random() > 0.5) {
        operation = (Math.random() > 0.5) ? '+' : '-';
        let num2 = getRandomInt(1, den1 - 1);
        if (operation === '-' && num1 < num2) [num1, num2] = [num2, num1];
        if (operation === '-' && num1 === num2) num1 = Math.max(num1 + 1, num2 + 1);
        const resultNum = operation === '+' ? num1 + num2 : num1 - num2;
        if ((operation === '-' && resultNum <= 0) || (operation === '+' && resultNum >= den1)) {
            return generateFractionProblem(level);
        }
        const resultFrac = simplifyFraction(resultNum, den1);
        correctAnswer = `${resultFrac.num}/${resultFrac.den}`;
        text = `What is <sup>${num1}</sup>&frasl;<sub>${den1}</sub> ${operation} <sup>${num2}</sup>&frasl;<sub>${den1}</sub>?`;
    } else {
        const multiplier = getRandomInt(2, 4);
        const numEq = num1 * multiplier;
        const denEq = den1 * multiplier;
        const simp = simplifyFraction(numEq, denEq);
        correctAnswer = `${simp.num}/${simp.den}`;
        text = `Simplify the fraction <sup>${numEq}</sup>&frasl;<sub>${denEq}</sub>.`;
    }
    const optionsArray = generateFractionDistractors(correctAnswer, level);
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}
```

## js/generators/fractionOperations.js
```js
import { getRandomInt, simplifyFraction } from '../helpers.js';
import { generateFractionDistractors, formatOptions, findCorrectKey } from './distractors.js';

// Operations on fractions: add, subtract, multiply, divide
export function generateFractionOpsProblem(level) {
    const type = getRandomInt(1, 4);
    // Base denominator
    const d1 = getRandomInt(2, level + 3);
    const n1 = getRandomInt(1, d1 - 1);
    const d2 = getRandomInt(2, level + 3);
    const n2 = getRandomInt(1, d2 - 1);
    let text, correctNum, correctDen;
    if (type === 1) {
        // addition
        text = `What is <sup>${n1}</sup>&frasl;<sub>${d1}</sub> + <sup>${n2}</sup>&frasl;<sub>${d2}</sub>?`;
        correctNum = n1 * d2 + n2 * d1;
        correctDen = d1 * d2;
    } else if (type === 2) {
        // subtraction
        text = `What is <sup>${n1}</sup>&frasl;<sub>${d1}</sub> - <sup>${n2}</sup>&frasl;<sub>${d2}</sub>?`;
        correctNum = n1 * d2 - n2 * d1;
        correctDen = d1 * d2;
    } else if (type === 3) {
        // multiplication
        text = `What is <sup>${n1}</sup>&frasl;<sub>${d1}</sub> × <sup>${n2}</sup>&frasl;<sub>${d2}</sub>?`;
        correctNum = n1 * n2;
        correctDen = d1 * d2;
    } else {
        // division
        text = `What is <sup>${n1}</sup>&frasl;<sub>${d1}</sub> ÷ <sup>${n2}</sup>&frasl;<sub>${d2}</sub>?`;
        correctNum = n1 * d2;
        correctDen = d1 * n2;
    }
    const simp = simplifyFraction(correctNum, correctDen);
    const correctAnswer = `${simp.num}/${simp.den}`;
    const optsArr = generateFractionDistractors(correctAnswer, level);
    const options = formatOptions(optsArr, correctAnswer);
    const correct = findCorrectKey(options, correctAnswer);
    return { text, options, correct, level };
}
```

## js/generators/geometry.js
```js
import { getRandomInt } from '../helpers.js';
import { findCorrectKey } from './distractors.js';

// Geometry: 2D shapes, angles, coordinates
export function generateGeometryProblem(level) {
    const type = getRandomInt(1, 3);
    let text, correctAnswer;
    let options;
    if (type === 1) {
        // Shape from number of sides
        const sides = getRandomInt(3, 8);
        const names = {3:'triangle',4:'quadrilateral',5:'pentagon',6:'hexagon',7:'heptagon',8:'octagon'};
        correctAnswer = names[sides] || `${sides}-gon`;
        text = `What is the name of a ${sides}-sided polygon?`;
        const choices = Object.values(names).slice(0,5);
        options = {};
        ['A','B','C','D'].forEach((k,i) => options[k] = choices[i]);
        options['E'] = correctAnswer;
    } else if (type === 2) {
        // Interior angle of regular polygon
        const n = getRandomInt(3, 8);
        correctAnswer = ((n - 2) * 180 / n);
        text = `What is the interior angle (in degrees) of a regular ${n}-sided polygon?`;
        const optsArr = [correctAnswer, correctAnswer+10, correctAnswer-10, 180/n, 360/n];
        const formatted = optsArr.map(v => v.toString());
        options = {};
        ['A','B','C','D','E'].forEach((k,i) => options[k] = formatted[i]);
    } else {
        // Coordinates quadrant
        const x = getRandomInt(-10, 10);
        const y = getRandomInt(-10, 10);
        text = `Which quadrant is the point (${x}, ${y}) in?`;
        if (x>0 && y>0) correctAnswer = 'I';
        else if (x<0 && y>0) correctAnswer = 'II';
        else if (x<0 && y<0) correctAnswer = 'III';
        else if (x>0 && y<0) correctAnswer = 'IV';
        else correctAnswer = 'On axis';
        const opts = {'A':'I','B':'II','C':'III','D':'IV','E':'On axis'};
        options = opts;
    }
    const optionsFinal = typeof options !== 'undefined' ? options : {};
    const correct = findCorrectKey(optionsFinal, correctAnswer);
    return { text, options: optionsFinal, correct, level };
}
```

## js/generators/index.js
```js
import { generateAdditionProblem } from './addition.js';
import { generateSubtractionProblem } from './subtraction.js';
import { generateMultiplicationProblem } from './multiplication.js';
import { generateDivisionProblem } from './division.js';
import { generateFractionProblem } from './fraction.js';
import { generatePercentageProblem } from './percentage.js';
import { generateSequenceProblem } from './sequence.js';
import { generateAlgebraProblem } from './algebra.js';
import { generateRatioProblem } from './ratio.js';
import { generateSimpleWordProblem } from './simpleword.js';
import { generateMultiStepProblem } from './multistep.js';
import { generatePlaceValueProblem, generateRoundingProblem, generateNegativeNumbersProblem, generateOrderOfOperationsProblem, generateShiftProblem } from './number.js';
import { generateNumberPropertiesProblem } from './numberProperties.js';
import { generateFractionOpsProblem } from './fractionOperations.js';
import { generateConversionProblem } from './conversion.js';
import { generateMeasurementProblem } from './measurement.js';
import { generateGeometryProblem } from './geometry.js';
import { generateDataProblem } from './data.js';
import { generateProbabilityProblem } from './probability.js';
import { generateSpeedProblem } from './speed.js';

export function generateQuestion(level) {
    const topicsPerLevel = {
    1: ['Addition', 'Subtraction', 'Simple Multiply', 'Place Value', 'Rounding', 'Negative Numbers', 'Multiply/Divide by 10/100/1000'],
    2: ['Addition', 'Subtraction', 'Multiply', 'Division', 'Simple Fractions', 'Sequences', 'Place Value', 'Rounding', 'Negative Numbers', 'Order of Operations'],
    3: ['Multiply', 'Division', 'Fractions', 'Percentages', 'Sequences', 'Simple Algebra', 'Number Properties', 'Fraction Operations', 'Conversions'],
    4: ['Fractions', 'Percentages', 'Ratio', 'Algebra', 'Problem Solving (Numerical)', 'Measurement', 'Unit Conversion', 'HCF/LCM'],
    5: ['Percentages', 'Ratio', 'Algebra', 'Multi-Step Problem', 'Geometry', 'Statistics', 'Probability', 'Speed/Distance/Time']
    };
    const available = topicsPerLevel[level] || topicsPerLevel[5];
    let topic = available[Math.floor(Math.random() * available.length)];
    let data;
    try {
        switch (topic) {
            case 'Addition': data = generateAdditionProblem(level); break;
            case 'Subtraction': data = generateSubtractionProblem(level); break;
            case 'Multiply': case 'Simple Multiply': data = generateMultiplicationProblem(level); break;
            case 'Division': data = generateDivisionProblem(level); break;
            case 'Simple Fractions': case 'Fractions': data = generateFractionProblem(level); break;
            case 'Percentages': data = generatePercentageProblem(level); break;
            case 'Sequences': data = generateSequenceProblem(level); break;
            case 'Simple Algebra': case 'Algebra': data = generateAlgebraProblem(level); break;
            case 'Ratio': data = generateRatioProblem(level); break;
            case 'Problem Solving (Numerical)': data = generateSimpleWordProblem(level); break;
            case 'Multi-Step Problem': data = generateMultiStepProblem(level); break;
            case 'Place Value': data = generatePlaceValueProblem(level); break;
            case 'Rounding': data = generateRoundingProblem(level); break;
            case 'Negative Numbers': data = generateNegativeNumbersProblem(level); break;
            case 'Order of Operations': data = generateOrderOfOperationsProblem(level); break;
            case 'Multiply/Divide by 10/100/1000': data = generateShiftProblem(level); break;
            case 'Number Properties': data = generateNumberPropertiesProblem(level); break;
            case 'Fraction Operations': data = generateFractionOpsProblem(level); break;
            case 'Conversions': data = generateConversionProblem(level); break;
            case 'Measurement': data = generateMeasurementProblem(level); topic = 'Measurement'; break;
            case 'Unit Conversion': data = generateMeasurementProblem(level); topic = 'Unit Conversion'; break;
            case 'HCF/LCM': data = generateNumberPropertiesProblem(level); topic = 'HCF/LCM'; break;
            case 'Geometry': data = generateGeometryProblem(level); break;
            case 'Statistics': data = generateDataProblem(level); break;
            case 'Probability': data = generateProbabilityProblem(level); break;
            case 'Speed/Distance/Time': data = generateSpeedProblem(level); topic = 'Speed/Distance/Time'; break;
            default: data = generateAdditionProblem(level); topic = 'Addition (Fallback)';
        }
        data.topic = topic;
        if (!data.options[data.correct]) {
            console.error('Invalid correct key mapping!', topic, data);
            data = generateAdditionProblem(level);
            data.topic = 'Addition (Error Fallback)';
        }
    } catch (e) {
        console.error('Error generating question:', topic, e);
        data = generateAdditionProblem(level);
        data.topic = 'Addition (Error Fallback)';
    }
    return data;
}
```

## js/generators/measurement.js
```js
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
```

## js/generators/multiplication.js
```js
import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateMultiplicationProblem(level) {
    const maxFactor = level + 4;
    const num1 = getRandomInt(2, maxFactor);
    const num2 = getRandomInt(2, maxFactor + level);
    const correctAnswer = num1 * num2;
    const text = `What is ${num1} × ${num2}?`;
    const optionsArray = generateDistractors(correctAnswer, [num1, num2], '*');
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}
```

## js/generators/multistep.js
```js
import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateMultiStepProblem(level) {
    const packs = getRandomInt(2, 4+level);
    const perPack = getRandomInt(5, 10+level);
    const totalInit = packs * perPack;
    const used = getRandomInt(3, Math.max(4, Math.floor(totalInit * 0.6)));
    if (totalInit <= used) return generateMultiStepProblem(level);
    const correctAnswer = totalInit - used;
    const contexts = [
        { item:'stickers', container:'pack', p:'buys', s:'uses'},
        { item:'cakes', container:'box', p:'bakes', s:'eats'},
        { item:'pencils', container:'box', p:'gets', s:'gives away'}
    ];
    const ctx = contexts[getRandomInt(0, contexts.length-1)];
    const text = `David ${ctx.p} ${packs} ${ctx.container}s of ${ctx.item}. Each ${ctx.container} has ${perPack} ${ctx.item}. He then ${ctx.s} ${used} ${ctx.item}. How many ${ctx.item} does he have left?`;
    let opts = [totalInit, packs*(perPack-used), totalInit+used, used, perPack, packs];
    opts = [...new Set(opts.filter(o=>typeof o==='number'&&o>0&&o!==correctAnswer))];
    const optionsArray = generateDistractors(correctAnswer, [], '', opts);
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}
```

## js/generators/number.js
```js
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
```

## js/generators/numberProperties.js
```js
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
```

## js/generators/percentage.js
```js
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
```

## js/generators/probability.js
```js
import { getRandomInt } from '../helpers.js';
import { findCorrectKey } from './distractors.js';

// Probability: basic probability questions
export function generateProbabilityProblem(level) {
    // Simple marble bag
    const total = getRandomInt(5, level * 5 + 5);
    const favorable = getRandomInt(1, total - 1);
    const text = `A bag contains ${total} marbles, of which ${favorable} are red. What is the probability of drawing a red marble?`;
    // Represent as fraction
    const num = favorable;
    const den = total;
    const correctAnswer = `${num}/${den}`;
    const optsArr = [correctAnswer, `${favorable+1}/${den}`, `${num}/${den-1}`, `${Math.round((favorable/total)*100)}%`, `${Math.round((total-favorable)/total*10)}/10`];
    const options = {};
    ['A','B','C','D','E'].forEach((k,i) => options[k] = optsArr[i]);
    const correct = findCorrectKey(options, correctAnswer);
    return { text, options, correct, level };
}
```

## js/generators/ratio.js
```js
import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateRatioProblem(level) {
    const r1 = getRandomInt(1, 3+level);
    const r2 = getRandomInt(1, 5+level);
    if (r1===r2) return generateRatioProblem(level);
    const totalParts = r1 + r2;
    const mul = getRandomInt(2, 5+level);
    const total = totalParts * mul;
    const share1 = r1 * mul;
    const share2 = r2 * mul;
    const part = Math.random()>0.5?1:2;
    const correctAnswer = part===1? share1 : share2;
    const text = `Share £${total} in the ratio ${r1}:${r2}. What is the value of the ${part===1?'first':'second'} share?`;
    let opts = [
        part===1? share2 : share1,
        total,
        mul,
        total / r1,
        total / r2
    ];
    opts = opts.map(o=>Number.isFinite(o)?(Number.isInteger(o)?o:parseFloat(o.toFixed(1))):undefined)
              .filter(o=>o!==undefined);
    opts = [...new Set(opts)];
    const optionsArray = generateDistractors(correctAnswer, [], '', opts);
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}
```

## js/generators/sequence.js
```js
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
                 const opRand = Math.random();
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
        debug_type: sequenceType // Optional: For debugging
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
```

## js/generators/simpleword.js
```js
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
```

## js/generators/speed.js
```js
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
        // Adjust text slightly if time is .5
        const timeText = timeHours % 1 === 0 ? `${timeHours} hours` : `${Math.floor(timeHours)} hours and 30 minutes`;
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
```

## js/generators/subtraction.js
```js
import { getRandomInt } from '../helpers.js';
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateSubtractionProblem(level) {
    const maxNum = level * 20 + 10;
    let num1 = getRandomInt(5, maxNum);
    let num2 = getRandomInt(1, num1 - 1);
    if (Math.random() > 0.7 && level > 1) [num1, num2] = [num2, num1];
    const correctAnswer = num1 - num2;
    const text = `What is ${num1} - ${num2}?`;
    const optionsArray = generateDistractors(correctAnswer, [num1, num2], '-');
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);
    return { text, options: formattedOptions, correct, level };
}
```

