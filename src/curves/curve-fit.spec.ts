import { CubicBezier } from './cubic-bezier';
import { CurveFit } from './curve-fit';
import { ExpectedCurveFitResult } from './curve-fit.sample';
import { ExpectedLinearizedSample } from './curve-preprocess.sample';
import { Vector } from './vector';

const approximate = (a: number) => Math.floor(a * 10) / 10;

describe('CurveFitBase', () => {
  const linearized = ExpectedLinearizedSample.map((point) =>
    Vector.from(point)
  );
  let curveFit: CurveFit;
  let result: CubicBezier[];

  beforeEach(() => {
    // curveFit = CurveFit.GetInstance();
    // result = CurveFit.Fit(linearized, 1);
  });

  it('CurveFit.Fit', () => {
    const results = CurveFit.Fit(linearized, 8);
    expect(results.length).toBe(ExpectedCurveFitResult.length);
    results.forEach((bezier, index) => {
      expect(approximate(bezier.p0.x)).toBe(
        approximate(ExpectedCurveFitResult[index].p0.x)
      );
      expect(approximate(bezier.p0.y)).toBe(
        approximate(ExpectedCurveFitResult[index].p0.y)
      );
      expect(approximate(bezier.p1.x)).toBe(
        approximate(ExpectedCurveFitResult[index].p1.x)
      );
      expect(approximate(bezier.p1.y)).toBe(
        approximate(ExpectedCurveFitResult[index].p1.y)
      );
      expect(approximate(bezier.p2.x)).toBe(
        approximate(ExpectedCurveFitResult[index].p2.x)
      );
      expect(approximate(bezier.p2.y)).toBe(
        approximate(ExpectedCurveFitResult[index].p2.y)
      );
      expect(approximate(bezier.p3.x)).toBe(
        approximate(ExpectedCurveFitResult[index].p3.x)
      );
      expect(approximate(bezier.p3.y)).toBe(
        approximate(ExpectedCurveFitResult[index].p3.y)
      );
    });
  });
});
