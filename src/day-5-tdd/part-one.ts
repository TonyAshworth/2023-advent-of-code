import * as fs from "fs";
import * as readline from "readline";

const lineReader = readline.createInterface({
  input: fs.createReadStream("./input.txt"),
  terminal: false,
});

// let total = 0;
let lineNumber = 0;
const desiredSeeds: seedMapData[] = [];
let from: string;
let to: string;
const seedMapParts = [
  `seed`,
  `soil`,
  `fertilizer`,
  `water`,
  `light`,
  `temperature`,
  `humidity`,
  `location`,
];

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

function parseDesiredSeeds(line: string) {
  line
    .substring(7)
    .split(" ")
    .every((seedInput) => {
      const newSeed = new seedMapData();
      newSeed.seed = +seedInput;
      desiredSeeds.push(newSeed);
      return true;
    });
  console.log(`Desired seeds are ${JSON.stringify(desiredSeeds)}`);
}

function processMapData(line: string, from: string, to: string) {
  const mapParts = line.split(" ");

  console.log(`mapParts: ${mapParts}`);

  const fromLower = +mapParts[1];
  const fromHigher = fromLower + +mapParts[2] - 1;
  const toLower = +mapParts[0];

  desiredSeeds.forEach((seedData) => {
    if (seedData[from] === undefined) {
      // console.log(`Seed ${seedData.seed} is missing ${from}`);
      seedData[from] = seedData[seedMapParts[seedMapParts.indexOf(from) - 1]];
      // console.log(`Seed ${seedData.seed} now has ${from} ${seedData[from]}`)
    }

    if (seedData[from] >= fromLower && seedData[from] <= fromHigher) {
      // console.log(`Seed ${seedData[from]} is in range ${fromLower} to ${fromHigher}`);
      seedData[to] = toLower + (seedData[from] - fromLower);
      console.log(
        `Seed ${from} ${seedData[from]} maps to ${to} ${seedData[to]}`
      );
    } else {
      // console.log(`Seed ${seedData[from]} is NOT in range ${fromLower} to ${fromHigher}`);
    }
  });
}

lineReader.on("line", (line) => {
  if (lineNumber === 0) {
    parseDesiredSeeds(line);
  } else {
    if (line.includes("-to-")) {
      const fromToParts = line.split("-to-");
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

lineReader.on("close", () => {
  let closestLocation = desiredSeeds[0].location;
  desiredSeeds.forEach((seedData) => {
    if (seedData.location === undefined) {
      seedData.location = seedData.humidity;
    }
    console.log(`Seed ${seedData.seed} is at ${seedData.location}`);
    closestLocation = Math.min(closestLocation, seedData.location);
  });
  console.log(`Closest location is ${closestLocation}`);
});

// final answer is 457535844
