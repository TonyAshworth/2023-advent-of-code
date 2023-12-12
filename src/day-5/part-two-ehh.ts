import * as fs from 'fs';
import * as readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('./input.txt'),
    terminal: false,
});

var lineNumber = 0;
var desiredSeeds: seedMapData[] = [];
var from: string;
var to: string;
var seedMapParts = [`seed`, `soil`, `fertilizer`, `water`, `light`, `temperature`, `humidity`, `location`];

class seedMapData {
    seed: number;
    soil: number;
    fertilizer: number;
    water: number;
    light: number;
    temperature: number;
    humidity: number;
    location: number;
}

// lol this did NOT work, it ran out of memory even trying it
// i suspected that would be the case, but i wanted to try it anyway

function parseDesiredSeeds(line: string) {
    var pairSet = {start: 0, end: 0};
    line.substring(7).split(" ").every((seedInput) => {
        if (pairSet.start === 0) {
            pairSet.start = +seedInput;
        } else {
            pairSet.end = pairSet.start + +seedInput;
            
            for (var i = pairSet.start; i <= pairSet.end; i++) {
                let newSeed = new seedMapData;
                newSeed.seed = i;
                desiredSeeds.push(newSeed);
            }
        }
        return true;
    });
    console.log(`Desired seeds are ${JSON.stringify(desiredSeeds)}`);
}

function processMapData(line: string, from: string, to: string) {
    var mapParts = line.split(" ");

    console.log(`mapParts: ${mapParts}`);

    var fromLower = +mapParts[1];
    var fromHigher = fromLower + +(mapParts[2]) - 1;
    var toLower = +mapParts[0];

    desiredSeeds.forEach(seedData => {
        if (seedData[from] === undefined) {
            // console.log(`Seed ${seedData.seed} is missing ${from}`);
            seedData[from] = seedData[seedMapParts[seedMapParts.indexOf(from) - 1]];
            // console.log(`Seed ${seedData.seed} now has ${from} ${seedData[from]}`)
        }

        if (seedData[from] >= fromLower && seedData[from] <= fromHigher) {
            // console.log(`Seed ${seedData[from]} is in range ${fromLower} to ${fromHigher}`);
            seedData[to] = toLower + (seedData[from] - fromLower);
            console.log(`Seed ${from} ${seedData[from]} maps to ${to} ${seedData[to]}`);
        } else {
            // console.log(`Seed ${seedData[from]} is NOT in range ${fromLower} to ${fromHigher}`);
        }
    });
}

lineReader.on('line', (line) => {
    if (lineNumber === 0) {
        parseDesiredSeeds(line);
    } else {
        if (line.includes("-to-")) {
            var fromToParts = line.split("-to-");
            console.log(`fromToParts: ${fromToParts}`);
            from = fromToParts[0];
            to = fromToParts[1].replace(" map:", "");
            console.log(`From ${from} to ${to}`);
        } else {
            if (line.trim() !== "") {
                processMapData(line, from, to);
            }
        }
    }

    lineNumber++;
});

lineReader.on('close', () => {
    var closestLocation = desiredSeeds[0].location;
    desiredSeeds.forEach(seedData => {
        if (seedData.location === undefined) {
            seedData.location = seedData.humidity;
        }
        console.log(`Seed ${seedData.seed} is at ${seedData.location}`);
        closestLocation = Math.min(closestLocation, seedData.location);
    });
    console.log(`Closest location is ${closestLocation}`);
});

// final answer is 54632