import * as fs from "fs";
import * as readline from "readline";
import { parseDesiredSeeds, parseMapData } from "./parsers";
import { calculate } from "./calculate";

const lineReader = readline.createInterface({
  input: fs.createReadStream("./input.txt"),
  terminal: false,
});

let adjustmentMap = [];
let seedInputs = [];

lineReader.on("line", (line) => {
  if (line.includes("seeds:")) {
    seedInputs = parseDesiredSeeds(line);
  } else if (line.includes("-to-")) {
    // do nothing
  } else if (line.trim() === "") {
    // calculate adjustments
    seedInputs = calculate(seedInputs, adjustmentMap);
    // clear adjustment map
    adjustmentMap = [];
  } else {
    adjustmentMap.push(parseMapData(line));
  }
});

lineReader.on("close", () => {
  let closestLocation = Number.MAX_SAFE_INTEGER;

  let winningSeed = {};

  seedInputs.forEach((element) => {
    if (element.start < closestLocation) {
      closestLocation = element.start;
      winningSeed = element;
    }
  });

  console.log(
    `Closest location is ${closestLocation} with seed ${JSON.stringify(
      winningSeed
    )}`
  );
});

// final answer is 54632
