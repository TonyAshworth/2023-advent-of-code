import * as fs from 'fs';
import { forEach } from 'lodash';
import * as readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('./resources/day-5-input.txt'),
    terminal: false,
});

var adjustmentMap = [];
var seedInputs = [];
var mapTo = "";

function parseDesiredSeeds(line: string) {
    var pairSet = {start: 0, end: 0, originStart: 0, originEnd: 0, processed: false, calculations: []};
    line.substring(7).split(" ").every((seedInput) => {
        if (pairSet.start === 0) {
            pairSet.start = +seedInput;
            pairSet.originStart = +seedInput;
        } else {
            pairSet.end = pairSet.start + (+seedInput) - 1;
            pairSet.originEnd = pairSet.end;
            seedInputs.push(pairSet);
            pairSet = {start: 0, end: 0, originStart: 0, originEnd: 0, processed: false, calculations: []};
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
    console.log(`-------------------`);
    let mappedSeeds = [];
    adjustmentMap = adjustmentMap.sort((a, b) => {
        return a.fromLower - b.fromLower;
    });
    seedInputs = seedInputs.sort((a, b) => {
        return a.start - b.start;
    });
    for (var mapIndex = 0; mapIndex < adjustmentMap.length; mapIndex++) {
        const map = adjustmentMap[mapIndex];
        let seedIndex = 0;
        let seedIndexMax = seedInputs.length;
        let processingSeeds = true;
        console.log(`Processing adjustment map ${JSON.stringify(map)}`);
        while (processingSeeds) {
            if (seedIndex >= seedIndexMax || seedInputs.length === 0) {
                break;
            }
            if (seedInputs[seedIndex] == null) {
                seedInputs.splice(seedIndex, 1);
                continue;
            }
            const seedCopy = {...seedInputs[seedIndex], calculations: [...seedInputs[seedIndex].calculations]};
            console.log(`Processing seed with ${JSON.stringify(seedCopy)}`);
            Object.freeze(seedCopy);
            if (seedCopy.start >= map.fromLower && seedCopy.start <= map.fromHigher) {
                if (seedCopy.end <= map.fromHigher) {
                    console.log(`Range fully encompassed`);
                    seedInputs[seedIndex].start += map.delta;
                    seedInputs[seedIndex].end += map.delta;
                    seedInputs[seedIndex].calculations.push(`${mapTo}-${map.delta}`);
                    mappedSeeds.push(seedInputs[seedIndex]);
                    console.log(`Pushed output ${JSON.stringify(seedInputs[seedIndex])} to mappedSeeds`);
                    seedInputs.splice(seedIndex, 1);
                } else {
                    console.log(`Partial match on start of range`);
                    // range extends beyond the map (start is in, end is out)
                    seedInputs[seedIndex].start += map.delta;
                    seedInputs[seedIndex].end = map.fromHigher + map.delta;
                    seedInputs[seedIndex].calculations.push(`${mapTo}-${map.delta}`);
                    mappedSeeds.push(seedInputs[seedIndex]);
                    console.log(`Pushed output ${JSON.stringify(seedInputs[seedIndex])} to mappedSeeds`);
                    seedInputs.splice(seedIndex, 1);

                    // create new input of the unmatched portion
                    let newSeedInput = {
                        start: map.fromHigher + 1,
                        end: seedCopy.end,
                        processed: false,
                        calculations: seedCopy.calculations,
                        originStart: seedCopy.originStart,
                        originEnd: seedCopy.originEnd
                    };
                    seedInputs.push(newSeedInput);
                    seedIndexMax++;
                    console.log("Created New Input " + JSON.stringify(newSeedInput));
                }
            } else if (seedCopy.end >= map.fromLower && seedCopy.end <= map.fromHigher) {
                console.log(`Partial match on end of range`);

                // range extends beyond the map (end is in, start is out)
                seedInputs[seedIndex].start = map.fromLower + map.delta;
                seedInputs[seedIndex].end += map.delta;
                seedInputs[seedIndex].calculations.push(`${mapTo}-${map.delta}`);
                mappedSeeds.push(seedInputs[seedIndex]);
                console.log(`Pushed output ${JSON.stringify(seedInputs[seedIndex])} to mappedSeeds`);
                seedInputs.splice(seedIndex, 1);

                // create new input of the unmatched portion
                let newSeedInput = {
                    start: seedCopy.start,
                    end: map.fromLower - 1,
                    processed: false,
                    calculations: seedCopy.calculations,
                    originStart: seedCopy.originStart,
                    originEnd: seedCopy.originEnd
                };
                seedInputs.push(newSeedInput);
                seedIndexMax++;

                console.log("Created New Input " + JSON.stringify(newSeedInput));
            } else if (seedCopy.start < map.fromLower && seedCopy.end > map.fromHigher) {
                console.log(`Range extends outside of the map in both directions`);

                // range extends beyond the map in both directions
                seedInputs[seedIndex].start = map.fromLower + map.delta;
                seedInputs[seedIndex].end = map.fromHigher + map.delta;
                seedInputs[seedIndex].calculations.push(`${mapTo}-${map.delta}`);
                mappedSeeds.push(seedInputs[seedIndex]);
                console.log(`Pushed output ${JSON.stringify(seedInputs[seedIndex])} to mappedSeeds`);
                seedInputs.splice(seedIndex, 1);

                // create new input of the unmatched portions
                let newSeedInputLower = {
                    start: seedCopy.start,
                    end: map.fromLower - 1,
                    processed: false,
                    calculations: seedCopy.calculations,
                    originStart: seedCopy.originStart,
                    originEnd: seedCopy.originEnd
                };
                seedInputs.push(newSeedInputLower);
                seedIndexMax++;
                console.log("Created New Input " + JSON.stringify(newSeedInputLower));

                let newSeedInputUpper = {
                    start: map.fromHigher + 1,
                    end: seedCopy.end,
                    processed: false,
                    calculations: seedCopy.calculations,
                    originStart: seedCopy.originStart,
                    originEnd: seedCopy.originEnd
                };
                seedInputs.push(newSeedInputUpper);
                seedIndexMax++;
                console.log("Created New Input " + JSON.stringify(newSeedInputUpper));

            } else {
                console.log(`skip because range is outside of the map`);
                // range is outside of the map so do nothing
                seedIndex++;
            }
        }
    }
    console.log(`calculation complete`);
    seedInputs.push(...mappedSeeds);
    for(var i = seedInputs.length - 1; i >= 0; i--) {
        if(seedInputs[i] == null) {
            seedInputs.splice(i, 1);
        } else {
            seedInputs[i].processed = false;
        }
    }
    console.log(`Seed inputs length is now ${seedInputs.length}`);
}

lineReader.on('line', (line) => {
    if (line.includes("seeds:")) {
        parseDesiredSeeds(line);
        console.log(`Seed inputs are ${JSON.stringify(seedInputs)}`);
    } else if (line.includes("-to-")) {
        console.log(`--- --- processing section for ${line}`);
        mapTo = line.split("-to-")[1].replace(" map:", "");
        // do nothing
    } else if (line.trim() === "") {
        console.log(`Adjustment map is ${JSON.stringify(adjustmentMap)}`);
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

    var winningSeed = {};

    seedInputs.forEach(element => {
        if (element.start < closestLocation) {
            closestLocation = element.start;
            winningSeed = element;
        }
    });

    console.log(`Closest location is ${closestLocation} with seed ${JSON.stringify(winningSeed)}`);
});

// final answer is 54632