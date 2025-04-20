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