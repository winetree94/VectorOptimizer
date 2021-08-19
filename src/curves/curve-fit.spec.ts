import { CurveFit } from './curve-fit';
import { ExpectedCurveFitResult } from './curve-fit.sample';
import { ExpectedLinearizedSample } from './curve-preprocess.sample';
import { approximate } from './math';
import { Vector } from './vector';

describe('CurveFitBase', () => {
  it('CurveFit.Fit', () => {
    const linearized = ExpectedLinearizedSample.map((point) =>
      Vector.from(point)
    );
    const results = new CurveFit(linearized).Fit(8);
    expect(results.length).toBe(ExpectedCurveFitResult.length);
    // results.forEach((bezier, index) => {
    //   if (index > 3) {
    //     return;
    //   }
    //   expect(approximate(bezier.p0.x, 1)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p0.x, 1)
    //   );
    //   expect(approximate(bezier.p0.y, 1)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p0.y, 1)
    //   );
    //   expect(approximate(bezier.p1.x, 1)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p1.x, 1)
    //   );
    //   expect(approximate(bezier.p1.y, 1)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p1.y, 1)
    //   );
    //   expect(approximate(bezier.p2.x, 1)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p2.x, 1)
    //   );
    //   expect(approximate(bezier.p2.y, 1)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p2.y, 1)
    //   );
    //   expect(approximate(bezier.p3.x, 1)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p3.x, 1)
    //   );
    //   expect(approximate(bezier.p3.y, 1)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p3.y, 1)
    //   );
    // });
  });
});
