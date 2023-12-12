import * as fs from 'fs';
import * as readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('./input.txt'),
    terminal: false,
});


// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11

var total = 0;

function parseCard(input: string): number {
  const cardParts = input.split("|");
  const winningNumbers = cardParts[0].split(":")[1].trim().split(" ");
  const scratchOffNumbers = cardParts[1].trim().split(" ");
  var matches = 0;

  var cardTotal = 0;

  for (let i = 0; i < scratchOffNumbers.length; i++) {
    if (scratchOffNumbers[i] !== "") {
      for (let j = 0; j < winningNumbers.length; j++) {
        if (scratchOffNumbers[i] === winningNumbers[j]) {
          // console.log(`Match found: ${scratchOffNumbers[i]} === ${winningNumbers[j]}`);
          matches++;
        }
      }
    }
  }

  // console.log(`Matches: ${matches}`);
  for (let i = 0; i < matches; i++) {
    if (i === 0) {
      cardTotal = 1;
    } else {
      cardTotal = cardTotal * 2;
    }
  }

  // console.log(`Total: ${cardTotal}`);
  return cardTotal;
} 

lineReader.on('line', (line) => {
    var cardValue = parseCard(line);
    total += cardValue;
    // console.log(`Total is ${total}`);
});

lineReader.on('close', () => {
    console.log(`Final Total is ${total}`);
});

// final answer is 25004