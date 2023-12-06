import * as fs from 'fs';
import * as readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('./resources/day-5-input-sample.txt'),
    terminal: false,
});

let adjustmentMap = [];
let seedInputs = [];
let stepName = "";

function parseDesiredSeeds(line: string) {
    let pairSet = {start: 0, end: 0, originStart: 0, originEnd: 0, steps: [], calculations: []};
    line.substring(7).split(" ").every((seedInput) => {
        if (pairSet.start === 0) {
            pairSet.start = +seedInput;
            pairSet.originStart = +seedInput;
        } else {
            pairSet.end = pairSet.start + (+seedInput) - 1;
            pairSet.originEnd = pairSet.end;
            seedInputs.push(pairSet);
            pairSet = {start: 0, end: 0, originStart: 0, originEnd: 0, steps: [], calculations: []};
        }
        return true;
    });
}

function processAdjustmentData(line: string) {
    let mapParts = line.split(" ");

    // get the parts of the line
    let fromLower = +mapParts[1];
    let fromHigher = fromLower + +(mapParts[2]) - 1;
    let delta = +mapParts[0] - fromLower;

    // figure out if any other matrix values already map for this range
    adjustmentMap.push({fromLower, fromHigher, delta});
}

let seedsToAddOnNextIteration = [];

function calculate() {
    for (let mapIndex = 0; mapIndex < adjustmentMap.length; mapIndex++) {
        const map = adjustmentMap[mapIndex];
        // console.log(`Processing adjustment map ${JSON.stringify(map)}`);
        for (let seedIndex = 0; seedIndex < seedInputs.length; seedIndex++) {
            const seedCopy = seedInputs[seedIndex];
            if (!seedCopy.steps.includes(stepName)) {
                if (seedCopy.start >= map.fromLower && seedCopy.start <= map.fromHigher) {
                    if (seedCopy.end <= map.fromHigher) {
                        // range fully encompased so just add deltas
                        // console.log(`Range fully encompassed`);
                        seedInputs[seedIndex].start += map.delta;
                        seedInputs[seedIndex].end += map.delta;
                        seedInputs[seedIndex].steps.push(stepName);
                        seedInputs[seedIndex].calculations.push(map.delta);
                        // console.log(`Processed range ${JSON.stringify(seedCopy)} into ${JSON.stringify(seedInputs[seedIndex])} with delta ${map.delta}`);
                    } else {
                        // console.log(`Partial match on start of range`);

                        // range extends beyond the map (start is in, end is out)
                        seedInputs[seedIndex].start += map.delta;
                        seedInputs[seedIndex].end = map.fromHigher + map.delta;
                        seedInputs[seedIndex].steps.push(stepName);
                        seedInputs[seedIndex].calculations.push(map.delta);
                        // console.log(`Processed range ${JSON.stringify(seedCopy)} into ${JSON.stringify(seedInputs[seedIndex])} with delta ${map.delta}`);

                        // create new input of the unmatched portion
                        let newSeedInput = {
                            start: map.fromHigher + 1,
                            end: seedCopy.end,
                            steps: [...seedCopy.steps, "end split"],
                            originStart: seedCopy.originStart,
                            originEnd: seedCopy.originEnd,
                            calculations: seedCopy.calculations
                        };
                        seedsToAddOnNextIteration.push(newSeedInput);
                        // console.log("Created New Input " + JSON.stringify(newSeedInput));
                    }
                } else if (seedCopy.end >= map.fromLower && seedCopy.end <= map.fromHigher) {
                    // console.log(`Partial match on end of range`);

                    // range extends beyond the map (end is in, start is out)
                    seedInputs[seedIndex].start = map.fromLower + map.delta;
                    seedInputs[seedIndex].end += map.delta;
                    seedInputs[seedIndex].steps.push(stepName);
                    seedInputs[seedIndex].calculations.push(map.delta);
                    // console.log(`Processed range ${JSON.stringify(seedCopy)} into ${JSON.stringify(seedInputs[seedIndex])} with delta ${map.delta}`);

                    // create new input of the unmatched portion
                    let newSeedInput = {
                        start: seedCopy.start,
                        end: map.fromLower - 1,
                        steps: [...seedCopy.steps, "start split"],
                        originStart: seedCopy.originStart,
                        originEnd: seedCopy.originEnd,
                        calculations: seedCopy.calculations
                    };
                    seedsToAddOnNextIteration.push(newSeedInput);
                    // console.log("Created New Input " + JSON.stringify(newSeedInput));
                } else if (seedCopy.start < map.fromLower && seedCopy.end > map.fromHigher) {
                    // console.log(`Range extends outside of the map in both directions :facepalm:`);

                    // range extends beyond the map in both directions
                    seedInputs[seedIndex].start = map.fromLower + map.delta;
                    seedInputs[seedIndex].end = map.fromHigher + map.delta;
                    seedInputs[seedIndex].steps.push(stepName);
                    seedInputs[seedIndex].calculations.push(map.delta);

                    // create new input of the unmatched portions
                    let newSeedInputLower = {
                        start: seedCopy.start,
                        end: map.fromLower - 1,
                        steps: [...seedCopy.steps, "start split"],
                        originStart: seedCopy.originStart,
                        originEnd: seedCopy.originEnd,
                        calculations: seedCopy.calculations
                    };
                    seedsToAddOnNextIteration.push(newSeedInputLower);

                    let newSeedInputUpper = {
                        start: map.fromHigher + 1,
                        end: seedCopy.end,
                        steps: [...seedCopy.steps, "end split"],
                        originStart: seedCopy.originStart,
                        originEnd: seedCopy.originEnd,
                        calculations: seedCopy.calculations
                    };
                    seedsToAddOnNextIteration.push(newSeedInputUpper);
                } else {
                    // console.log(`skip`);
                    // range is outside of the map so do nothing
                }
            }
        }
    }
    seedInputs.push(...seedsToAddOnNextIteration);
    seedsToAddOnNextIteration = [];
}

lineReader.on('line', (line) => {
    if (line.includes("seeds:")) {
        parseDesiredSeeds(line);
        console.log(`Seed inputs are ${JSON.stringify(seedInputs)}`);
    } else if (line.includes("-to-")) {
        stepName = line.split("-to-")[1].split(" ")[0];
        // console.log(`--- --- processing section for ${line}`);
        // do nothing
    } else if (line.trim() === "") {
        // console.log(`Adjustment map is ${JSON.stringify(adjustmentMap)}`);
        // calculate adjustments
        calculate();
        // clear adjustment map
        adjustmentMap = [];
    } else {
        processAdjustmentData(line);
    }
});

lineReader.on('close', () => {
    let closestLocation = Number.MAX_SAFE_INTEGER;

    let winningSeed = {};

    seedInputs.forEach(element => {
        if (element.start < closestLocation) {
            closestLocation = element.start;
            winningSeed = element;
        }
    });

    console.log(`Closest location is ${closestLocation} with seed ${JSON.stringify(winningSeed)}`);
});

// final answer is 54632