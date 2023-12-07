import * as fs from 'fs';
import * as readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('resources/day-1-calibration.txt'),
    terminal: false,
});

var total = 0;

lineReader.on('line', (line) => {
    line = line.replace(/[^0-9\.]+/g, "");
    const first = line.slice(0, 1);
    const last = line.slice(-1);
    const value = +(`${first}${last}`)
    total += value;
});

lineReader.on('close', () => {
    console.log(`Final Total is ${total}`);
});

// final answer is 54632