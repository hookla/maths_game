// js/generators/vocabulary.js
import { getRandomInt, shuffleArray } from '../../helpers.js';
// We need formatOptions and findCorrectKey, but NOT the numeric generateDistractors
import { formatOptions, findCorrectKey } from '../distractors.js';

// --- DATA SOURCE ---
// IMPORTANT: This is a tiny sample. You MUST expand this list significantly!
// Add more words, synonyms, antonyms, and adjust levels.
const vocabularyData = [
    { word: 'happy', level: 1, synonyms: ['joyful', 'glad', 'content', 'pleased'], antonyms: ['sad', 'unhappy', 'miserable', 'upset'] },
    { word: 'big', level: 1, synonyms: ['large', 'huge', 'giant', 'vast'], antonyms: ['small', 'tiny', 'little', 'miniature'] },
    { word: 'fast', level: 1, synonyms: ['quick', 'rapid', 'swift', 'speedy'], antonyms: ['slow', 'sluggish', 'leisurely'] },
    { word: 'difficult', level: 2, synonyms: ['hard', 'challenging', 'tough', 'complex'], antonyms: ['easy', 'simple', 'straightforward'] },
    { word: 'brave', level: 2, synonyms: ['courageous', 'fearless', 'valiant', 'bold'], antonyms: ['cowardly', 'timid', 'fearful'] },
    { word: 'important', level: 2, synonyms: ['significant', 'vital', 'crucial', 'essential'], antonyms: ['unimportant', 'trivial', 'minor'] },
    { word: 'ancient', level: 3, synonyms: ['old', 'aged', 'historic', 'bygone'], antonyms: ['modern', 'new', 'recent', 'current'] },
    { word: 'generous', level: 3, synonyms: ['charitable', 'giving', 'unselfish', 'magnanimous'], antonyms: ['stingy', 'miserly', 'selfish', 'mean'] },
    { word: 'create', level: 3, synonyms: ['make', 'build', 'produce', 'generate'], antonyms: ['destroy', 'demolish', 'ruin'] },
  
    { word: 'smart', level: 1, synonyms: ['clever', 'intelligent', 'bright', 'sharp'], antonyms: ['stupid', 'foolish', 'dull'] },
    { word: 'clean', level: 1, synonyms: ['tidy', 'spotless', 'pure', 'fresh'], antonyms: ['dirty', 'messy', 'filthy'] },
    { word: 'strong', level: 1, synonyms: ['powerful', 'robust', 'sturdy', 'tough'], antonyms: ['weak', 'fragile', 'feeble'] },
  
    { word: 'honest', level: 2, synonyms: ['truthful', 'sincere', 'frank', 'open'], antonyms: ['dishonest', 'deceitful', 'lying'] },
    { word: 'calm', level: 2, synonyms: ['peaceful', 'tranquil', 'serene', 'composed'], antonyms: ['agitated', 'nervous', 'anxious'] },
    { word: 'careful', level: 2, synonyms: ['cautious', 'attentive', 'meticulous', 'thorough'], antonyms: ['careless', 'reckless', 'negligent'] },
  
    { word: 'beautiful', level: 3, synonyms: ['gorgeous', 'stunning', 'attractive', 'lovely'], antonyms: ['ugly', 'unattractive', 'hideous'] },
    { word: 'dangerous', level: 3, synonyms: ['risky', 'hazardous', 'perilous', 'unsafe'], antonyms: ['safe', 'secure', 'harmless'] },
    { word: 'expand', level: 3, synonyms: ['grow', 'increase', 'extend', 'broaden'], antonyms: ['shrink', 'contract', 'reduce'] },
  
    { word: 'bright', level: 1, synonyms: ['shiny', 'luminous', 'radiant', 'brilliant'], antonyms: ['dull', 'dim', 'dark'] },
    { word: 'cold', level: 1, synonyms: ['chilly', 'cool', 'freezing', 'icy'], antonyms: ['hot', 'warm', 'heated'] },
    { word: 'quiet', level: 1, synonyms: ['silent', 'mute', 'hushed', 'calm'], antonyms: ['loud', 'noisy', 'boisterous'] },
  
    { word: 'confident', level: 2, synonyms: ['assured', 'certain', 'self-assured', 'secure'], antonyms: ['uncertain', 'insecure', 'doubtful'] },
    { word: 'popular', level: 2, synonyms: ['well-liked', 'favored', 'admired', 'trendy'], antonyms: ['unpopular', 'disliked', 'hated'] },
    { word: 'effective', level: 2, synonyms: ['efficient', 'successful', 'productive', 'potent'], antonyms: ['ineffective', 'useless', 'unproductive'] },
  
    { word: 'curious', level: 3, synonyms: ['inquisitive', 'interested', 'inquiring', 'probing'], antonyms: ['uninterested', 'apathetic', 'indifferent'] },
    { word: 'achieve', level: 3, synonyms: ['accomplish', 'attain', 'reach', 'fulfill'], antonyms: ['fail', 'lose', 'miss'] },
    { word: 'unique', level: 3, synonyms: ['distinct', 'special', 'one-of-a-kind', 'unusual'], antonyms: ['common', 'ordinary', 'usual'] },
  
    { word: 'friendly', level: 1, synonyms: ['kind', 'pleasant', 'amiable', 'cordial'], antonyms: ['unfriendly', 'hostile', 'unpleasant'] },
    { word: 'hot', level: 1, synonyms: ['warm', 'heated', 'boiling', 'scorching'], antonyms: ['cold', 'chilly', 'cool'] },
    { word: 'rich', level: 1, synonyms: ['wealthy', 'affluent', 'prosperous', 'well-off'], antonyms: ['poor', 'broke', 'impoverished'] },
  
    { word: 'accurate', level: 2, synonyms: ['precise', 'correct', 'exact', 'truthful'], antonyms: ['inaccurate', 'wrong', 'incorrect'] },
    { word: 'valuable', level: 2, synonyms: ['precious', 'worthwhile', 'important', 'useful'], antonyms: ['worthless', 'useless', 'insignificant'] },
    { word: 'flexible', level: 2, synonyms: ['adaptable', 'versatile', 'adjustable', 'pliable'], antonyms: ['rigid', 'inflexible', 'fixed'] },
  
    { word: 'ambitious', level: 3, synonyms: ['aspiring', 'determined', 'motivated', 'driven'], antonyms: ['lazy', 'unmotivated', 'indifferent'] },
    { word: 'genuine', level: 3, synonyms: ['authentic', 'real', 'sincere', 'honest'], antonyms: ['fake', 'phony', 'insincere'] },
    { word: 'fragile', level: 3, synonyms: ['delicate', 'breakable', 'vulnerable', 'frail'], antonyms: ['strong', 'durable', 'robust'] }
  ];
  
// --- END DATA SOURCE ---

export function generateVocabularyProblem(level) {
    // Filter data by level (or include lower levels for variety)
    let availableWords = vocabularyData.filter(item => item.level <= level);
    if (availableWords.length === 0) {
        availableWords = vocabularyData; // Fallback if no words at current level
        if (availableWords.length === 0) throw new Error("Vocabulary data is empty!");
    }

    let selectedWordData;
    let mode; // 'synonym' or 'antonym'
    let validSelection = false;
    let attempts = 0;

    // Try to find a word with valid options for synonym/antonym mode
    while (!validSelection && attempts < 10) {
        selectedWordData = availableWords[getRandomInt(0, availableWords.length - 1)];
        // Randomly choose mode, but default to synonym if antonyms missing, and vice versa
        const potentialMode = Math.random() < 0.5 ? 'synonym' : 'antonym';
        if (potentialMode === 'synonym' && selectedWordData.synonyms?.length > 0) {
            mode = 'synonym';
            validSelection = true;
        } else if (potentialMode === 'antonym' && selectedWordData.antonyms?.length > 0) {
            mode = 'antonym';
            validSelection = true;
        } else if (selectedWordData.synonyms?.length > 0) { // Fallback if chosen mode failed
            mode = 'synonym';
            validSelection = true;
        } else if (selectedWordData.antonyms?.length > 0) { // Fallback if chosen mode failed
            mode = 'antonym';
            validSelection = true;
        }
        attempts++;
    }

    // If still no valid selection after attempts, throw error or handle gracefully
    if (!validSelection) {
         console.error("Could not find suitable word/mode in vocabulary data for level", level);
         // Fallback to a known good entry if possible
         selectedWordData = vocabularyData[0];
         mode = 'synonym';
         // Or return a dummy problem / throw an error
         if (!selectedWordData.synonyms?.length) throw new Error("Default vocabulary word has no synonyms!");
    }


    const targetWord = selectedWordData.word;
    const correctOptions = (mode === 'synonym') ? selectedWordData.synonyms : selectedWordData.antonyms;
    const incorrectOptionsSource = (mode === 'synonym') ? selectedWordData.antonyms : selectedWordData.synonyms;

    // Select one correct answer
    const correctAnswer = correctOptions[getRandomInt(0, correctOptions.length - 1)];

    // --- Generate Distractors (Word-based) ---
    let distractors = new Set();

    // 1. Add some incorrect options from the *same* word (e.g., antonyms if question is synonym)
    if (incorrectOptionsSource) {
        shuffleArray(incorrectOptionsSource);
        incorrectOptionsSource.slice(0, 2).forEach(d => distractors.add(d));
    }

    // 2. Add some options (synonyms/antonyms) from *other* words
    let otherWords = vocabularyData.filter(item => item.word !== targetWord && item.level <= level);
    shuffleArray(otherWords);
    for (let i = 0; i < 3 && i < otherWords.length; i++) {
        const otherWordData = otherWords[i];
        if (otherWordData.synonyms?.length > 0) distractors.add(otherWordData.synonyms[getRandomInt(0, otherWordData.synonyms.length - 1)]);
        if (otherWordData.antonyms?.length > 0) distractors.add(otherWordData.antonyms[getRandomInt(0, otherWordData.antonyms.length - 1)]);
    }

    // Convert Set to array, remove the correct answer if present, shuffle
    let distractorPool = Array.from(distractors).filter(d => d && d !== correctAnswer);
    shuffleArray(distractorPool);

    // Build the final options array
    let finalOptions = [correctAnswer];
    finalOptions = finalOptions.concat(distractorPool.slice(0, 4)); // Need 5 options total

    // Ensure 5 unique options, add random words if needed (basic fallback)
    let fallbackAttempts = 0;
    const allWords = vocabularyData.map(w=>w.word).concat(vocabularyData.flatMap(w=>w.synonyms || [])).concat(vocabularyData.flatMap(w=>w.antonyms || []));
    const uniqueWords = [...new Set(allWords)].filter(w => w); // Ensure no undefined/empty

    while (finalOptions.length < 5 && fallbackAttempts < 20) {
        const randomWord = uniqueWords[getRandomInt(0, uniqueWords.length -1)];
        if (!finalOptions.includes(randomWord)) {
            finalOptions.push(randomWord);
        }
        fallbackAttempts++;
    }
     // Ensure correct answer is definitely in (might get lost if pool was small)
     if (!finalOptions.includes(correctAnswer)) {
         finalOptions.pop(); // Remove last item
         finalOptions.push(correctAnswer);
     }

    // Final shuffle before formatting
    shuffleArray(finalOptions);

    // Format question text
    const text = `Which word is an ${mode} for '${targetWord}'?`;

    // Use your existing formatting functions
    const formattedOptions = formatOptions(finalOptions.slice(0,5), correctAnswer); // Use formatOptions (ensure it handles strings)
    const correct = findCorrectKey(formattedOptions, correctAnswer); // Use findCorrectKey

    return { text, options: formattedOptions, correct, level };
}