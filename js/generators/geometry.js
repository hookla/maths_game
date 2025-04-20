// js/generators/geometry.js
import { getRandomInt } from '../helpers.js';
// Assuming formatOptions was intended but unused before; keep import if needed by distractors
// Removed options assignment as it was unused and caused no-undef error later
import { generateDistractors, formatOptions, findCorrectKey } from './distractors.js';

export function generateGeometryProblem(level) {
    const problemTypes = ['shapeName', 'polygonAngle', 'quadrant'];
    // Add new text-based types
    if (level >= 1) problemTypes.push('shapeProperty');
    if (level >= 2) problemTypes.push('angleRule');

    const type = problemTypes[getRandomInt(0, problemTypes.length - 1)];

    let text = '';
    let correctAnswer = 0;
    let context = []; // For distractors

    switch (type) {
        case 'shapeName': { // Original
            const sides = getRandomInt(3, 8 + level);
            const shapes = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 11: 'hendecagon', 12: 'dodecagon' };
            correctAnswer = shapes[sides] || `polygon with ${sides} sides`;
            text = `What is the name of a shape with ${sides} sides?`;
            context = [sides];
             // Ensure options are strings for this type
             // Generate options manually or adapt distractors.js
             let possibleOptions = Object.values(shapes);
             let distractors = possibleOptions.filter(s => s !== correctAnswer);
             distractors.sort(() => 0.5 - Math.random()); // Shuffle
             let optionsArray = [correctAnswer, ...distractors.slice(0, 4)];
             let formattedOptions = formatOptions(optionsArray, correctAnswer); // Ensure formatOptions handles strings
             let correct = findCorrectKey(formattedOptions, correctAnswer);
             return { text, options: formattedOptions, correct, level }; // Return early for string answers
            // break; // Unreachable after return
        }
        case 'polygonAngle': { // Original
            const sides = getRandomInt(5, 8); // Keep to regular shapes usually known
            const shapes = { 5: 'pentagon', 6: 'hexagon', 8: 'octagon' };
            if (!shapes[sides]) return generateGeometryProblem(level); // Retry if side count is not planned
            correctAnswer = Math.round((180 * (sides - 2)) / sides);
            text = `What is the size of each interior angle in a regular ${shapes[sides]}?`;
            context = [sides, 180, sides - 2];
            break;
        }
        case 'quadrant': { // Original
            const x = getRandomInt(-10, 10);
            const y = getRandomInt(-10, 10);
            if (x === 0 || y === 0) return generateGeometryProblem(level); // Avoid axes
            let quadrant = 0;
            if (x > 0 && y > 0) quadrant = 1;
            else if (x < 0 && y > 0) quadrant = 2;
            else if (x < 0 && y < 0) quadrant = 3;
            else if (x > 0 && y < 0) quadrant = 4;
            correctAnswer = quadrant;
            text = `In which quadrant is the coordinate (${x}, ${y}) located?`;
            context = [x, y];
            break;
        }
        // *** NEW TYPES START HERE ***
        case 'shapeProperty': {
            const shapes3D = {
                'cube': { vertices: 8, edges: 12, faces: 6 },
                'cuboid': { vertices: 8, edges: 12, faces: 6 },
                'square-based pyramid': { vertices: 5, edges: 8, faces: 5 },
                'triangular prism': { vertices: 6, edges: 9, faces: 5 }
            };
            const shapeNames = Object.keys(shapes3D);
            const shape = shapeNames[getRandomInt(0, shapeNames.length - 1)];
            const properties = ['vertices', 'edges', 'faces'];
            const property = properties[getRandomInt(0, properties.length - 1)];

            correctAnswer = shapes3D[shape][property];
            text = `How many ${property} does a ${shape} have?`;
            context = [shapes3D[shape].vertices, shapes3D[shape].edges, shapes3D[shape].faces];
            break;
        }
        case 'angleRule': {
            const ruleType = Math.random();
            if (ruleType < 0.4) { // Angles on a straight line
                const angle1 = getRandomInt(30, 150);
                correctAnswer = 180 - angle1;
                text = `An angle on a straight line is ${angle1} degrees. What is the size of the adjacent angle?`;
                context = [angle1, 180];
            } else if (ruleType < 0.7) { // Angles around a point
                const angle1 = getRandomInt(100, 250 - level * 10); // Ensure remaining angle is reasonable
                correctAnswer = 360 - angle1;
                 text = `One angle around a point is ${angle1} degrees. What is the size of the remaining angle?`;
                 context = [angle1, 360];
            } else { // Angles in a triangle
                 const angle1 = getRandomInt(30, 80 + level*2);
                 const angle2 = getRandomInt(30, Math.max(40, 140 - angle1 - level*5)); // Ensure angles allow for a third >0
                 correctAnswer = 180 - angle1 - angle2;
                 text = `Two angles in a triangle are ${angle1} degrees and ${angle2} degrees. What is the third angle?`;
                 context = [angle1, angle2, 180];
            }
            break;
        }
        default: // Fallback if type is unexpected
             return generateGeometryProblem(level);

    }

    // Common logic for numeric answers
    const optionsArray = generateDistractors(correctAnswer, context, type);
    const formattedOptions = formatOptions(optionsArray, correctAnswer);
    const correct = findCorrectKey(formattedOptions, correctAnswer);

    return { text, options: formattedOptions, correct, level };
}