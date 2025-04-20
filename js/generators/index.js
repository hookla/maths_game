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