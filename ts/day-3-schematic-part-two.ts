import * as fs from 'fs';
import * as readline from 'readline';

// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..

/*
* Parse each line, turn the periods into spaces.
* Loop through each character in the line to find the numbers and symbols
* if you find a number, parse it and figure out all the coordinates that are adjacent to it.
* create a coordinates array around each number.
* if you find a symbol then put it in the symbols map coordinates array.
* After all the lines are parsed then loop through all the numbers and
* check if any of their surrounding coordinates are in the symbols map.
*/


const lineReader = readline.createInterface({
    input: fs.createReadStream('./resources/day-3-input.txt'),
    terminal: false,
});

class partNumber {
  value: number;
  coordinates: string[]; // Initialize coordinates as an array of objects

  constructor(value: number, upperLeft: [number, number], lowerRight: [number, number]) {
    this.value = value;
    this.coordinates = []; // Initialize coordinates as an empty array

    // Loop through the coordinates and add them to the coordinates array
    for (let i = upperLeft[0]; i <= lowerRight[0]; i++) {
      for (let j = upperLeft[1]; j <= lowerRight[1]; j++) {
        this.coordinates.push(`{ x: ${i}, y: ${j}}`);
      }
    }
  }

  toString() {
    return `value: ${this.value}, coordinates: ${JSON.stringify(this.coordinates)}`;
  }
}

var total = 0;
const gearsSymbol = "*";
const symbolsValues = "/$+&@#%=-.".split("");
const numbersValues = "0123456789".split("");

var parts = [];
var symbolsCoordinates = [];

function parseLine(line: string, index: number): string {
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (symbolsValues.includes(char)) {
      // do nothing
    } else if ( char === "*" ) {
      symbolsCoordinates.push(`{ x: ${i}, y: ${index}}`);
    } else {
      // it's a number
      const lowX = i - 1;
      const lowY = index - 1;
      const highY = index + 1;
      var highX = i;
      var numString = "";
      while (numbersValues.includes(line[i])) {
        if (numbersValues.includes(line[i])) {
          numString += line[i];
        } else {
          break;
        }
        i++;
      }
      highX = i;

      i--;

      parts.push(new partNumber(+numString, [lowX, lowY], [highX, highY]));
    }
  }

  return;
}

var lineNum = 0;

lineReader.on('line', (line) => {
  parseLine(line, lineNum++);
});

lineReader.on('close', () => {
  for (let index = 0; index < symbolsCoordinates.length; index++) {
    const element = symbolsCoordinates[index];
    var gearMultipliers = [];
    parts.forEach(part => {
      if (part.coordinates.includes(element)) {
        gearMultipliers.push(part.value);
        // console.log(`found ${element} in ${part.toString()}`);
      }
    });

    if (gearMultipliers.length == 2) {
      total += gearMultipliers[0] * gearMultipliers[1];
    }
  }
  // console.log(JSON.stringify(symbolsCoordinates));
  console.log(`total: ${total}`);
});

// final answer is ???