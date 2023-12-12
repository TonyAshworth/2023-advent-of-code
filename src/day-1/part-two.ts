import * as fs from 'fs';
import * as readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('./input.txt'),
    terminal: false,
});

const output = fs.createWriteStream('./converted.csv');

var total = 0;

function replaceAt(input: string, index: number, replacement: string): string {
    return input.substring(0, index) + replacement + input.substring(index + replacement.length);
}

function convertNumberStringsToNumbers(line: string): string {
    const inputLine = line;
    const replacements: Record<string, string> = {
        "one": "1",
        "two": "2",
        "three": "3",
        "four": "4",
        "five": "5",
        "six": "6",
        "seven": "7",
        "eight": "8",
        "nine": "9",
    };

    for (let i = 0; i < line.length; i++) {
        for (const key in replacements) {
            if (inputLine.indexOf(key, i) === i) {
                line =  replaceAt(line, i, replacements[key]);
            }
        }
    }

    return line;
}

lineReader.on('line', (inputLine) => {
    var line = convertNumberStringsToNumbers(inputLine);
    line = line.replace(/[^0-9\.]+/g, "");
    const first = line.slice(0, 1);
    const last = line.slice(-1);
    const value = +(`${first}${last}`)
    // console.log(`${inputLine} > ${line} turns into ${first} + ${last} = ${value}`);
    total += value;
    // console.log(`Total is now ${total} after adding ${value}`);
    output.write(`${inputLine},${line},${first},${last},${value}\n`);
});

lineReader.on('close', () => {
    console.log(`Final Total is ${total}`);
});

// final answer is 54875

