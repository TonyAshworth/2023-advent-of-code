export class seedSet {
  start: number;
  end: number;
  processed: boolean;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
    this.processed = false;
  }
}

export class seedMapAdjustment {
  fromLower: number;
  fromHigher: number;
  delta: number;

  constructor(fromLower: number, fromHigher: number, delta: number) {
    this.fromLower = fromLower;
    this.fromHigher = fromHigher;
    this.delta = delta;
  }
}

export function parseDesiredSeeds(line: string): seedSet[] {
  const output = [];
  let pairSet = new seedSet(0, 0);
  const inputs = line.substring(7).split(" ");
  inputs.forEach((seedInput) => {
    seedInput = seedInput.trim();
    if (pairSet.start === 0) {
      pairSet.start = +seedInput;
    } else {
      pairSet.end = pairSet.start + +seedInput - 1;
      output.push(pairSet);
      pairSet = new seedSet(0, 0);
    }
  });
  return output;
}

export function parseMapData(line: string): seedMapAdjustment {
  const mapParts = line.trim().split(" ");

  // get the parts of the line
  const fromLower = +mapParts[1];
  const fromHigher = fromLower + +mapParts[2] - 1;
  const delta = +mapParts[0] - fromLower;

  // figure out if any other matrix values already map for this range
  return new seedMapAdjustment(fromLower, fromHigher, delta);
}

export function parseMapHeader(line: string): string {
  // seed-to-soil map:
  return line.split(" ")[0].split("-to-")[1];
}
