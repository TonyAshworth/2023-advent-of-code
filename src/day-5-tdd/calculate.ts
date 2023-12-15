import { seedMapAdjustment, seedSet } from "./parsers";

export function calculate(
  seedInputs: seedSet[],
  adjustmentMap: seedMapAdjustment[]
): seedSet[] {
  const mappedSeeds = [];
  adjustmentMap = adjustmentMap.sort((a, b) => {
    return a.fromLower - b.fromLower;
  });
  seedInputs = seedInputs.sort((a, b) => {
    return a.start - b.start;
  });
  for (let mapIndex = 0; mapIndex < adjustmentMap.length; mapIndex++) {
    const map = adjustmentMap[mapIndex];
    let seedIndex = 0;
    let seedIndexMax = seedInputs.length;
    const processingSeeds = true;
    while (processingSeeds) {
      if (seedIndex >= seedIndexMax || seedInputs.length === seedIndex) {
        break;
      }
      if (seedInputs[seedIndex] == null) {
        seedInputs.splice(seedIndex, 1);
        continue;
      }
      const seedCopy = {
        ...seedInputs[seedIndex],
      };
      Object.freeze(seedCopy);
      if (seedCopy.start >= map.fromLower && seedCopy.start <= map.fromHigher) {
        if (seedCopy.end <= map.fromHigher) {
          seedInputs[seedIndex].start += map.delta;
          seedInputs[seedIndex].end += map.delta;
          mappedSeeds.push(seedInputs[seedIndex]);
          seedInputs.splice(seedIndex, 1);
        } else {
          // range extends beyond the map (start is in, end is out)
          seedInputs[seedIndex].start += map.delta;
          seedInputs[seedIndex].end = map.fromHigher + map.delta;
          mappedSeeds.push(seedInputs[seedIndex]);
          seedInputs.splice(seedIndex, 1);

          // create new input of the unmatched portion
          const newSeedInput = {
            start: map.fromHigher + 1,
            end: seedCopy.end,
            processed: false,
          };
          seedInputs.push(newSeedInput);
          seedIndexMax++;
        }
      } else if (
        seedCopy.start < map.fromLower &&
        seedCopy.end <= map.fromHigher &&
        seedCopy.end >= map.fromLower
      ) {
        // range extends beyond the map (end is in, start is out)
        seedInputs[seedIndex].start = map.fromLower + map.delta;
        seedInputs[seedIndex].end += map.delta;
        mappedSeeds.push(seedInputs[seedIndex]);
        seedInputs.splice(seedIndex, 1);

        // create new input of the unmatched portion
        const newSeedInput = {
          start: seedCopy.start,
          end: map.fromLower - 1,
          processed: false,
        };
        seedInputs.push(newSeedInput);
        seedIndexMax++;
      } else if (
        seedCopy.start < map.fromLower &&
        seedCopy.end > map.fromHigher
      ) {
        // range extends beyond the map in both directions
        seedInputs[seedIndex].start = map.fromLower + map.delta;
        seedInputs[seedIndex].end = map.fromHigher + map.delta;
        mappedSeeds.push(seedInputs[seedIndex]);
        seedInputs.splice(seedIndex, 1);

        // create new input of the unmatched portions
        const newSeedInputLower = {
          start: seedCopy.start,
          end: map.fromLower - 1,
          processed: false,
        };
        seedInputs.push(newSeedInputLower);
        seedIndexMax++;

        const newSeedInputUpper = {
          start: map.fromHigher + 1,
          end: seedCopy.end,
          processed: false,
        };
        seedInputs.push(newSeedInputUpper);
        seedIndexMax++;
      } else {
        // range is outside of the map so do nothing
        seedIndex++;
      }
    }
  }
  seedInputs.push(...mappedSeeds);
  for (let i = seedInputs.length - 1; i >= 0; i--) {
    if (seedInputs[i] == null) {
      seedInputs.splice(i, 1);
    } else {
      seedInputs[i].processed = false;
    }
  }
  return seedInputs;
}
