// js/generators/english/index.js
// Entry point for English test question generation
import { generatePunctuationProblem } from './punctuation.js';
import { generateVocabularyProblem } from './vocabulary.js';

/**
 * Generate an English question for a given level
 * @param {number} level - Difficulty level
 * @returns {{text: string, options: object, correct: string, level: number}}
 */
export function generateQuestion(level) {
    // Topics currently available
    const topicsPerLevel = {
        1: ['Punctuation', 'Vocabulary'],
        2: ['Punctuation', 'Vocabulary'],
        3: ['Punctuation', 'Vocabulary'],
        4: ['Punctuation', 'Vocabulary'],
        5: ['Punctuation', 'Vocabulary']
    };
    const available = topicsPerLevel[level] || topicsPerLevel[5];
    // Choose a random topic
    const topic = available[Math.floor(Math.random() * available.length)];
    let question;
    switch (topic) {
        case 'Punctuation':
            question = generatePunctuationProblem(level);
            break;
        case 'Vocabulary':
            question = generateVocabularyProblem(level);
            break;
        default:
            // Fallback to punctuation if unknown
            question = generatePunctuationProblem(level);
    }
    // Tag the topic
    question.topic = topic;
    return question;
}