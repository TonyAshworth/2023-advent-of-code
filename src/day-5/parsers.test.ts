import { parseDesiredSeeds, seedSet } from './parsers';

describe('parseDesiredSeeds', () => {
  it('should parse the desired seeds correctly', () => {
    const line = 'seeds: 3 5 10 7';
    const expectedOutput = [
      new seedSet(3, 7),
      new seedSet(10, 16),
    ];

    const output = parseDesiredSeeds(line);

    expect(output).toEqual(expectedOutput);
  });
});
