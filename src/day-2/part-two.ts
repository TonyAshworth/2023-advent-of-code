//12 red cubes, 13 green cubes, and 14 blue cubes

import * as fs from 'fs';
import * as readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('./input.txt'),
    terminal: false,
});

class game {
    source: string;
    game: number;
    red: number;
    green: number;
    blue: number;
   
    constructor(input: string) {
      this.source = input;
      var sourceParts = input.split(':');
      this.game = +(sourceParts[0].replace("Game ", "").trim());
      var diceInfo = sourceParts[1].split(";");

      this.red = 0;
      this.green = 0;
      this.blue = 0;
      
      diceInfo.forEach(snapshot => {
        var snapshotParts = snapshot.split(";");
        var snapshotDice = snapshotParts[0].split(",");

        snapshotDice.forEach(die => {

          var diceParts = die.trim().split(" ");
          var count = +(diceParts[0].trim());
          var color = diceParts[1];

          switch (color) {
              case "red":
                  this.red = Math.max(this.red, count);
                  break;
              case "green":
                  this.green = Math.max(this.green, count);
                  break;
              case "blue":
                  this.blue = Math.max(this.blue, count);
                  break;
              default:
                  console.log("------ ERROR INPUT IS INVALID WITH COLOR " + color + "------");
                  break;
          }
        });
      });
    }
   
    IsValidGame(redLimit: number, greenLimit: number, blueLimit: number): boolean {
        // console.log(`Game ${this.game} has ${this.red} red, ${this.green} green, and ${this.blue} blue.`);
        if (this.red > redLimit) {
            // console.log(`Game ${this.game} has too many red cubes.`);
        }
        if (this.green > greenLimit) {
            // console.log(`Game ${this.game} has too many green cubes.`);
        }
        if (this.blue > blueLimit) {
            // console.log(`Game ${this.game} has too many blue cubes.`);
        }
        // console.log(`Game ${this.game} is valid.`);
        return this.red <= redLimit && this.green <= greenLimit && this.blue <= blueLimit;
    }
  }

var total = 0;

function parseLine(input: string): number {
    var gameForLine = new game(input);
    if (gameForLine.IsValidGame(12, 13, 14)) {
        return gameForLine.game;
    }
    return 0;
}

lineReader.on('line', (line) => {
    var value = parseLine(line);
    total += value;
    if (value > 0) {
        // console.log(`Total is now ${total} after adding ${value}`);
    } else {
        // console.log(`Total is still ${total}`);
    }
});

lineReader.on('close', () => {
    console.log(`Final Total is ${total}`);
});

// final answer is 2369