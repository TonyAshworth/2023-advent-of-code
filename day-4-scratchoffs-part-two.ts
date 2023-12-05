import * as fs from 'fs';
import * as readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('./resources/day-4-input.txt'),
    terminal: false,
});

// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11

var total = 0;

var cardMultipliers = {}

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

  console.log(`Matches: ${matches}`);
  return matches;
}

function incrementFutureCards(howMany: number, index: number, copies: number) {
    for (let i = index; i < howMany + index; i++) {
      if (cardMultipliers[i] === undefined) {
        cardMultipliers[i] = 0;
      }
      cardMultipliers[i] = +(cardMultipliers[i]) + copies;
      console.log(`Incrementing card ${i} to ${cardMultipliers[i]}`);
    }
}

var cardIndex = 1;

lineReader.on('line', (line) => {
    if (cardMultipliers[cardIndex] === undefined) {
      cardMultipliers[cardIndex] = 0;
    }

    var copies = cardMultipliers[cardIndex] + 1
    console.log(`We have ${copies} copies of card ${cardIndex}`);
    
    var multiplier = parseCard(line);
    // console.log(`Multiplier is ${multiplier} for card ${cardIndex}`);

    incrementFutureCards(multiplier, cardIndex + 1, copies);
    total += copies; // add the current card and it's copies

    // console.log(`Total is ${total} after adding ${+(cardMultipliers[cardIndex])} at index ${cardIndex}`);
    cardIndex++;
});

lineReader.on('close', () => {
    console.log(`Final total is ${total}`);
});

// final answer is 54632