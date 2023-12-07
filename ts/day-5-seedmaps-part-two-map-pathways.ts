import * as fs from 'fs';
import * as readline from 'readline';
import 'lodash';

const lineReader = readline.createInterface({
    input: fs.createReadStream('./resources/day-5-input.txt'),
    terminal: false,
});

let adjustmentMap = [];
let seedInputs = [];
let stepName = "";
let verbose = false;
let seedId = 0;

function parseDesiredSeeds(line: string) {
    let pairSet = {start: 0, end: 0, steps: [], calculations: [], id: 0, ancestorChain: []};
    line.substring(7).split(" ").every((seedInput) => {
        if (pairSet.start === 0) {
            pairSet.start = +seedInput;
        } else {
            pairSet.end = pairSet.start + (+seedInput) - 1;
            pairSet.id = seedId++;
            seedInputs.push(pairSet);
            pairSet = {start: 0, end: 0, steps: [], calculations: [], id: 0, ancestorChain: []};
        }
        return true;
    });
    debugLog(idToLog, `Seed inputs are ${JSON.stringify(seedInputs)}`);
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

function debugLog(id: number, input: string) {
    if (verbose || id === idToLog) console.log(input);
}

function createNewSeedInputFromUnmatched(start: number, end: number, steps: string[], source: any) {
    let newSeedInput = {
        start: start,
        end: end,
        steps: [...steps],
        calculations: [...source.calculations],
        id: seedId++,
        ancestorChain: [...source.ancestorChain, source.id]
    };
    seedsToAddOnNextIteration.push(newSeedInput);
    debugLog(source.id, `Created New Input ${JSON.stringify(newSeedInput)}`);
}

const idToLog = 31;

function calculate() {
    // sort the adjustmentMap by fromLower
    adjustmentMap = _.orderBy(adjustmentMap, ['fromLower'], ['asc']);
    console.log(`---ORDERED---Adjustment map is ${JSON.stringify(adjustmentMap)}`);
    for (let mapIndex = 0; mapIndex < adjustmentMap.length; mapIndex++) {
        const map = adjustmentMap[mapIndex];
        const stepCalculation = stepName + ":" + map.delta;

        debugLog(-1, `Processing adjustment map ${JSON.stringify(map)}`);

        // sort seedInputs by start
        seedInputs = _.orderBy(seedInputs, ['start'], ['asc']);
        console.log(`---ORDERED---Seed inputs are ${JSON.stringify(seedInputs)}`);
        for (let seedIndex = 0; seedIndex < seedInputs.length; seedIndex++) {

            let seedCopy = { ...seedInputs[seedIndex], steps: [...seedInputs[seedIndex].steps], calculations: [...seedInputs[seedIndex].calculations]};
            Object.freeze(seedCopy);

            debugLog(seedCopy.id, `Processing seed ${JSON.stringify(seedCopy)}`);
            if (!seedInputs[seedIndex].steps.includes(stepName)) {
                if (seedCopy.start >= map.fromLower && seedCopy.start <= map.fromHigher) {
                    if (seedCopy.end <= map.fromHigher) {
                        debugLog(seedCopy.id, `Full match on range ${JSON.stringify(seedCopy)} with map ${JSON.stringify(map)}`);

                        // range fully encompased so just add deltas
                        seedInputs[seedIndex].start += map.delta;
                        seedInputs[seedIndex].end += map.delta;
                        seedInputs[seedIndex].steps.push(stepName);
                        seedInputs[seedIndex].calculations.push(stepCalculation);

                        debugLog(seedCopy.id, `Processed range ${JSON.stringify(seedCopy)} into ${JSON.stringify(seedInputs[seedIndex])} with delta ${map.delta}`);
                    } else {
                        debugLog(seedCopy.id, `Partial match on start of range ${JSON.stringify(seedCopy)} with map ${JSON.stringify(map)}`);

                        // range extends beyond the map (start is in, end is out)
                        seedInputs[seedIndex].start += map.delta;
                        seedInputs[seedIndex].end = map.fromHigher + map.delta;
                        seedInputs[seedIndex].steps.push(stepName);
                        seedInputs[seedIndex].calculations.push(stepCalculation);

                        debugLog(seedCopy.id, `Processed range ${JSON.stringify(seedCopy)} into ${JSON.stringify(seedInputs[seedIndex])} with delta ${map.delta}`);

                        // create new input of the unmatched portion
                        createNewSeedInputFromUnmatched(
                            map.fromHigher + 1,
                            seedCopy.end,
                            [...seedCopy.steps, "end split"],
                            seedCopy);
                    }
                } else if (seedCopy.end >= map.fromLower && seedCopy.end <= map.fromHigher) {
                    debugLog(seedCopy.id, `Partial match on end of range ${JSON.stringify(seedCopy)} with map ${JSON.stringify(map)}`);

                    // range extends beyond the map (end is in, start is out)
                    seedInputs[seedIndex].start = map.fromLower + map.delta;
                    seedInputs[seedIndex].end += map.delta;
                    seedInputs[seedIndex].steps.push(stepName);
                    seedInputs[seedIndex].calculations.push(stepCalculation);

                    debugLog(seedCopy.id, `Processed range ${JSON.stringify(seedCopy)} into ${JSON.stringify(seedInputs[seedIndex])} with delta ${map.delta}`);

                    createNewSeedInputFromUnmatched(
                        seedCopy.start,
                        map.fromLower - 1,
                        [...seedCopy.steps, "start split"],
                        seedCopy);

                    // console.log("Created New Input " + JSON.stringify(newSeedInput));
                } else if (seedCopy.start < map.fromLower && seedCopy.end > map.fromHigher) {
                    debugLog(seedCopy.id, `Range extends outside of the map in both directions ${JSON.stringify(seedCopy)} with map ${JSON.stringify(map)}`);

                    // range extends beyond the map in both directions
                    seedInputs[seedIndex].start = map.fromLower + map.delta;
                    seedInputs[seedIndex].end = map.fromHigher + map.delta;
                    seedInputs[seedIndex].steps.push(stepName);
                    seedInputs[seedIndex].calculations.push(stepCalculation);

                    debugLog(seedCopy.id, `Processed range ${JSON.stringify(seedCopy)} into ${JSON.stringify(seedInputs[seedIndex])} with delta ${map.delta}`);

                    // create new input of the unmatched portions
                    createNewSeedInputFromUnmatched(
                        map.fromHigher + 1,
                        seedCopy.end,
                        [...seedCopy.steps, "end split"],
                        seedCopy);

                    createNewSeedInputFromUnmatched(
                        seedCopy.start,
                        map.fromLower - 1,
                        [...seedCopy.steps, "start split"],
                        seedCopy);
                } else {
                    debugLog(seedCopy.id, `skipping`);
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
        console.log(`--- --- processing section for ${line}`);
        // do nothing
    } else if (line.trim() === "") {
        debugLog(-1, `Adjustment map is ${JSON.stringify(adjustmentMap)}`);
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