import * as fs from 'fs';

export function readFile(filePath: string): string[] {
  const allLines = fs.readFileSync(filePath, 'utf-8');
  const linesArray = allLines.split('\r\n');
  return linesArray;
}