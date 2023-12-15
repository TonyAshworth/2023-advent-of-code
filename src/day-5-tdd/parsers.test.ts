import {
  seedMapAdjustment,
  parseDesiredSeeds,
  parseMapData,
  parseMapHeader,
  seedSet,
} from "./parsers";

describe("parser tests", () => {
  describe("parseDesiredSeeds", () => {
    it("should parse the desired seeds correctly", () => {
      const line = "seeds: 3 5 10 7";
      const expectedOutput = [new seedSet(3, 7), new seedSet(10, 16)];

      const output = parseDesiredSeeds(line);

      expect(output).toEqual(expectedOutput);
    });
  });

  describe(`parseMapData`, () => {
    it(`should parse the map data correctly`, () => {
      const line = `5 20 5`;
      const expectedOutput = new seedMapAdjustment(20, 24, -15);

      const output = parseMapData(line);
      expect(output).toEqual(expectedOutput);
    });
  });

  describe(`parseMapHeader`, () => {
    it(`should parse the map header correctly`, () => {
      const line = `seeds-to-soil map:`;
      const expectedOutput = `soil`;
      const output = parseMapHeader(line);
      expect(output).toEqual(expectedOutput);
    });
  });
});
