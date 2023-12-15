import { seedMapAdjustment, seedSet } from "./parsers";
import { calculate } from "./calculate";

describe("calculate tests", () => {
  it("should handle enclosed ranges", () => {
    const seedInputs = [new seedSet(10, 15), new seedSet(5, 7)];
    const adjustmentMap = [new seedMapAdjustment(1, 20, 1)];

    const output = calculate(seedInputs, adjustmentMap);

    expect(output).toEqual([new seedSet(6, 8), new seedSet(11, 16)]);
  });

  it("should handle partial ranges (upper is out of bounds)", () => {
    const seedInputs = [new seedSet(5, 7), new seedSet(10, 15)];
    const adjustmentMap = [new seedMapAdjustment(9, 13, 1)];

    const output = calculate(seedInputs, adjustmentMap);

    const sortedOutput = output.sort((a, b) => {
      return a.start - b.start;
    });

    expect(sortedOutput).toEqual([
      new seedSet(5, 7),
      new seedSet(11, 14),
      new seedSet(14, 15),
    ]);
  });

  it("should handle partial ranges (lower is out of bounds)", () => {
    const seedInputs = [new seedSet(5, 7), new seedSet(10, 15)];
    const adjustmentMap = [new seedMapAdjustment(12, 20, 1)];

    const output = calculate(seedInputs, adjustmentMap);

    const sortedOutput = output.sort((a, b) => {
      return a.start - b.start;
    });

    expect(sortedOutput).toEqual([
      new seedSet(5, 7),
      new seedSet(10, 11),
      new seedSet(13, 16),
    ]);
  });

  it("should handle out of bound ranges on both ends", () => {
    const seedInputs = [new seedSet(5, 15)];
    const adjustmentMap = [new seedMapAdjustment(8, 12, -4)];

    const output = calculate(seedInputs, adjustmentMap);

    const sortedOutput = output.sort((a, b) => {
      return a.start - b.start;
    });

    expect(sortedOutput).toEqual([
      new seedSet(4, 8),
      new seedSet(5, 7),
      new seedSet(13, 15),
    ]);
  });

  it("single set matches multiple adjustments", () => {
    const seedInputs = [new seedSet(5, 20)];
    const adjustmentMap = [
      new seedMapAdjustment(8, 12, -4),
      new seedMapAdjustment(15, 18, 4),
    ];

    const output = calculate(seedInputs, adjustmentMap);

    const sortedOutput = output.sort((a, b) => {
      return a.start - b.start;
    });

    expect(sortedOutput).toEqual([
      new seedSet(4, 8),
      new seedSet(5, 7),
      new seedSet(13, 14),
      new seedSet(19, 20),
      new seedSet(19, 22),
    ]);
  });
});
