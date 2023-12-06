import * as fs from 'fs';
import * as readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('./resources/day-5-input.txt'),
    terminal: false,
});

let lineNumber = 0;
let mapIndex = 0;
let seedInputs = [];
let remap = [];
let result = [];

function parseDesiredSeeds(line: string) {
    let pairSet = {start: 0, end: 0};
    line.substring(7).split(" ").every((seedInput) => {
        if (pairSet.start === 0) {
            pairSet.start = +seedInput;
        } else {
            pairSet.end = pairSet.start + +seedInput;
            seedInputs.push(pairSet);
            pairSet = {start: 0, end: 0};
        }
        return true;
    });
}

function processMapData(line: string, mapIndex: number) {
    let mapParts = line.split(" ");

    // get the parts of the line
    let fromLower = +mapParts[1];
    let fromHigher = fromLower + +(mapParts[2]) - 1;
    let delta = +mapParts[0] - fromLower;

    // figure out if any other matrix values already map for this range
    mapMatrix[mapIndex].push({fromLower, fromHigher, delta});
}

lineReader.on('line', (line) => {
    if (lineNumber === 0) {
        parseDesiredSeeds(line);
    } else {
        if (line.includes("-to-")) {
            mapMatrix[mapIndex] = [];
            mapIndex++;
        } else {
            if (line.trim() !== "") {
                processMapData(line, mapIndex - 1);
            }
        }
    }

    lineNumber++;
});

lineReader.on('close', () => {
    // console.log(`Map matrix is ${JSON.stringify(mapMatrix)}`);
    // console.log(`Seed inputs are ${JSON.stringify(seedInputs)}`);
    let closestSeed = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < seedInputs.length; i++) {
        let seedSet = seedInputs[i];
        // console.log(`Processing seed set ${seedSet}`);
        const seedMin = +seedSet["start"];
        const seedMax = +seedSet["end"];
        // console.log(`Seed is ${seed} and seed max is ${seedMax}`);
        let seed = seedMin;
        while (seed <= seedMax) {
            let seedCopy = seed;
            // console.log("Seed is " + seed);
            mapMatrix.forEach(element => {
                let appliedDelta = false;
                element.forEach(mapElement => {
                    if (seedMin >= mapElement.fromHigher || seedMax <= mapElement.fromLower) {
                        //do nothing;
                    }
                    if (seed >= mapElement.fromLower && seed <= mapElement.fromHigher && !appliedDelta) {
                        // console.log(`Seed ${seedCopy} is in range ${mapElement.fromLower} to ${mapElement.fromHigher} applying delta ${mapElement.delta}`)
                        seedCopy = seedCopy + mapElement.delta;
                        appliedDelta = true;
                    }
                });
            });
            closestSeed = Math.min(closestSeed, seedCopy);
            seed++;
        }
    }

    console.log(`Closest seed is ${closestSeed}`);
});

// final answer is 54632