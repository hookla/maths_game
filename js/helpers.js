// Utility functions
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatNumber(num) {
    if (typeof num === 'string') {
        if (/^\d+\/\d+$/.test(num)) {
            return num;
        }
        const parsed = parseFloat(num);
        if (!isNaN(parsed)) {
            num = parsed;
        } else {
            return num;
        }
    }
    if (typeof num === 'number') {
        if (Number.isInteger(num)) {
            return num.toString();
        } else {
            return parseFloat(num.toFixed(2)).toString();
        }
    }
    return String(num);
}

export function gcd(a, b) {
    a = Math.abs(Number(a));
    b = Math.abs(Number(b));
    if (isNaN(a) || isNaN(b)) return 1;
    return b === 0 ? a : gcd(b, a % b);
}

export function simplifyFraction(numerator, denominator) {
    numerator = Number(numerator);
    denominator = Number(denominator);
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
        console.error("Invalid input for simplifyFraction", numerator, denominator);
        return { num: numerator, den: denominator };
    }
    const common = gcd(numerator, denominator);
    return { num: numerator / common, den: denominator / common };
}