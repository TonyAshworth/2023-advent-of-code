import * as fs from 'fs';
import * as readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('./resources/day-5-input-sample.txt'),
    terminal: false,
});

var lineNumber = 0;
var mapIndex = 0;
var mapMatrix = [[], []];
var seedInputs = [];

// var seedMapParts = [`seed`, `soil`, `fertilizer`, `water`, `light`, `temperature`, `humidity`, `location`];

// class seedMapData {
//     seed: number;
//     soil: number;
//     fertilizer: number;
//     water: number;
//     light: number;
//     temperature: number;
//     humidity: number;
//     location: number;
// }

function parseDesiredSeeds(line: string) {
    var pairSet = {start: 0, end: 0};
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
    console.log(`Desired seeds are ${JSON.stringify(seedInputs)}`);
}

function processMapData(line: string, mapIndex: number) {
    var mapParts = line.split(" ");

    // get the parts of the line
    var fromLower = +mapParts[1];
    var fromHigher = fromLower + +(mapParts[2]) - 1;
    var delta = +mapParts[0] - fromLower;

    // figure out if any other matrix values already map for this range
    mapMatrix[mapIndex].push({fromLower, fromHigher, delta});
}

function calculate() {
    for (var i = 0; i < mapMatrix.length; i++) {
        for (var j = 0; j < mapMatrix[i].length; j++) {
            for (var k = 0; k < seedInputs.length; k++) {
                if (seedInputs[k].start >= mapMatrix[i][j].fromLower && seedInputs[k].start <= mapMatrix[i][j].fromHigher) {
                    seedInputs[k].start = seedInputs[k].start + mapMatrix[i][j].delta;
                }
                if (seedInputs[k].end >= mapMatrix[i][j].fromLower && seedInputs[k].end <= mapMatrix[i][j].fromHigher) {
                    seedInputs[k].end = seedInputs[k].end + mapMatrix[i][j].delta;
                }
            }
        }
    }
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
    // var closestLocation = desiredSeeds[0].location;
    // desiredSeeds.forEach(seedData => {
    //     if (seedData.location === undefined) {
    //         seedData.location = seedData.humidity;
    //     }
    //     console.log(`Seed ${seedData.seed} is at ${seedData.location}`);
    //     closestLocation = Math.min(closestLocation, seedData.location);
    // });
    // console.log(`Closest location is ${closestLocation}`);
    // console.log(`Map matrix is ${JSON.stringify(mapMatrix)}`);
    mapMatrix.forEach(element => {
        console.log(`Map matrix element is ${JSON.stringify(element)}`);
    });
});

// final answer is 54632