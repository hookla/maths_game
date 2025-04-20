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