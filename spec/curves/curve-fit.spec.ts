import { CurveFit } from '../../src/curves/curve-fit';
import { ExpectedCurveFitRamerDouglasResult, ExpectedCurveFitResult } from './curve-fit.sample';
import { approximate } from '../../src/curves/math';
import { Vector } from '../../src/curves/vector';
import { ExpectedLinearizedSample } from './curve-preprocess.sample';

describe('CurveFitBase', () => {
  it('CurveFit.Fit', () => {
    const linearized = ExpectedLinearizedSample.map((point) =>
      Vector.from(point)
    );
    const results = new CurveFit(linearized).fit(8);
    expect(results.length).toBe(ExpectedCurveFitResult.length);
    results.forEach((bezier, index) => {
      expect(approximate(bezier.p0.x, 1)).toBe(
        approximate(ExpectedCurveFitResult[index].p0.x, 1)
      );
      expect(approximate(bezier.p0.y, 1)).toBe(
        approximate(ExpectedCurveFitResult[index].p0.y, 1)
      );
      expect(approximate(bezier.p1.x, 1)).toBe(
        approximate(ExpectedCurveFitResult[index].p1.x, 1)
      );
      expect(approximate(bezier.p1.y, 1)).toBe(
        approximate(ExpectedCurveFitResult[index].p1.y, 1)
      );
      expect(approximate(bezier.p2.x, 1)).toBe(
        approximate(ExpectedCurveFitResult[index].p2.x, 1)
      );
      expect(approximate(bezier.p2.y, 1)).toBe(
        approximate(ExpectedCurveFitResult[index].p2.y, 1)
      );
      expect(approximate(bezier.p3.x, 1)).toBe(
        approximate(ExpectedCurveFitResult[index].p3.x, 1)
      );
      expect(approximate(bezier.p3.y, 1)).toBe(
        approximate(ExpectedCurveFitResult[index].p3.y, 1)
      );
    });
  });

  it('CurveFit.Fit.RamerDouglasPecher', () => {
    const linearized = ExpectedLinearizedSample.map((point) =>
      Vector.from(point)
    );
    const results = new CurveFit(linearized).fit(8);
    expect(results.length).toBe(ExpectedCurveFitRamerDouglasResult.length);
    results.forEach((bezier, index) => {
      expect(approximate(bezier.p0.x, 1)).toBe(
        approximate(ExpectedCurveFitRamerDouglasResult[index].p0.x, 1)
      );
      expect(approximate(bezier.p0.y, 1)).toBe(
        approximate(ExpectedCurveFitRamerDouglasResult[index].p0.y, 1)
      );
      expect(approximate(bezier.p1.x, 1)).toBe(
        approximate(ExpectedCurveFitRamerDouglasResult[index].p1.x, 1)
      );
      expect(approximate(bezier.p1.y, 1)).toBe(
        approximate(ExpectedCurveFitRamerDouglasResult[index].p1.y, 1)
      );
      expect(approximate(bezier.p2.x, 1)).toBe(
        approximate(ExpectedCurveFitRamerDouglasResult[index].p2.x, 1)
      );
      expect(approximate(bezier.p2.y, 1)).toBe(
        approximate(ExpectedCurveFitRamerDouglasResult[index].p2.y, 1)
      );
      expect(approximate(bezier.p3.x, 1)).toBe(
        approximate(ExpectedCurveFitRamerDouglasResult[index].p3.x, 1)
      );
      expect(approximate(bezier.p3.y, 1)).toBe(
        approximate(ExpectedCurveFitRamerDouglasResult[index].p3.y, 1)
      );
    });
  });
});
