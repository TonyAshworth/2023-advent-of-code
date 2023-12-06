import * as fs from 'fs';
import * as readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('./resources/day-5-input.txt'),
    terminal: false,
});

var adjustmentMap = [];
var seedInputs = [];

function parseDesiredSeeds(line: string) {
    var pairSet = {start: 0, end: 0, processed: false};
    line.substring(7).split(" ").every((seedInput) => {
        if (pairSet.start === 0) {
            pairSet.start = +seedInput;
        } else {
            pairSet.end = pairSet.start + (+seedInput) - 1;
            seedInputs.push(pairSet);
            pairSet = {start: 0, end: 0, processed: false};
        }
        return true;
    });
}

function processAdjustmentData(line: string) {
    var mapParts = line.split(" ");

    // get the parts of the line
    let fromLower = +mapParts[1];
    let fromHigher = fromLower + +(mapParts[2]) - 1;
    let delta = +mapParts[0] - fromLower;

    // figure out if any other matrix values already map for this range
    adjustmentMap.push({fromLower, fromHigher, delta});
}

function calculate() {
    for (var mapIndex = 0; mapIndex < adjustmentMap.length; mapIndex++) {
        const map = adjustmentMap[mapIndex];
        // console.log(`Processing adjustment map ${JSON.stringify(map)}`);
        for (var seedIndex = 0; seedIndex < seedInputs.length; seedIndex++) {
            const seedCopy = seedInputs[seedIndex];
            if (seedCopy.processed) {
                continue;
            }
            if (seedCopy.start >= map.fromLower && seedCopy.start <= map.fromHigher) {
                if (seedCopy.end <= map.fromHigher) {
                    // range fully encompased so just add deltas
                    // console.log(`Range fully encompassed`);
                    seedInputs[seedIndex].start += map.delta;
                    seedInputs[seedIndex].end += map.delta;
                    seedInputs[seedIndex].processed = true;
                    // console.log(`Processed range ${JSON.stringify(seedCopy)} into ${JSON.stringify(seedInputs[seedIndex])} with delta ${map.delta}`);
                } else {
                    // console.log(`Partial match on start of range`);

                    // range extends beyond the map (start is in, end is out)
                    seedInputs[seedIndex].start += map.delta;
                    seedInputs[seedIndex].end = map.fromHigher + map.delta;
                    seedInputs[seedIndex].processed = true;
                    // console.log(`Processed range ${JSON.stringify(seedCopy)} into ${JSON.stringify(seedInputs[seedIndex])} with delta ${map.delta}`);

                    // create new input of the unmatched portion
                    let newSeedInput = {start: map.fromHigher + 1, end: seedCopy.end, processed: false};
                    seedInputs.push(newSeedInput);
                    // console.log("Created New Input " + JSON.stringify(newSeedInput));
                }
            } else if (seedCopy.end >= map.fromLower && seedCopy.end <= map.fromHigher) {
                // console.log(`Partial match on end of range`);

                // range extends beyond the map (end is in, start is out)
                seedInputs[seedIndex].start = map.fromLower + map.delta;
                seedInputs[seedIndex].end += map.delta;
                seedInputs[seedIndex].processed = true;
                // console.log(`Processed range ${JSON.stringify(seedCopy)} into ${JSON.stringify(seedInputs[seedIndex])} with delta ${map.delta}`);

                // create new input of the unmatched portion
                let newSeedInput = {start: seedCopy.start, end: map.fromLower - 1, processed: false};
                seedInputs.push(newSeedInput);
                // console.log("Created New Input " + JSON.stringify(newSeedInput));
            } else if (seedCopy.start < map.fromLower && seedCopy.end > map.fromHigher) {
                // console.log(`Range extends outside of the map in both directions :facepalm:`);

                // range extends beyond the map in both directions
                seedInputs[seedIndex].start = map.fromLower + map.delta;
                seedInputs[seedIndex].end = map.fromHigher + map.delta;
                seedInputs[seedIndex].processed = true;

                // create new input of the unmatched portions
                let newSeedInputLower = {start: seedCopy.start, end: map.fromLower - 1, processed: false};
                seedInputs.push(newSeedInputLower);

                let newSeedInputUpper = {start: map.fromHigher + 1, end: seedCopy.end, processed: false};
                seedInputs.push(newSeedInputUpper);
            } else {
                // console.log(`skip`);
                // range is outside of the map so do nothing
            }
        }
    }
    seedInputs.forEach(element => {
        element.processed = false;
    });
}

lineReader.on('line', (line) => {
    if (line.includes("seeds:")) {
        parseDesiredSeeds(line);
        console.log(`Seed inputs are ${JSON.stringify(seedInputs)}`);
    } else if (line.includes("-to-")) {
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
    var closestLocation = Number.MAX_SAFE_INTEGER;

    var count = 0;

    seedInputs.forEach(element => {
        count++;
        closestLocation = Math.min(closestLocation, element.start);
    });

    console.log(`Closest location is ${closestLocation} with ${count} seeds`);
});

// final answer is 54632