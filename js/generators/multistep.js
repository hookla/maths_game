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