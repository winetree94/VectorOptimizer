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
    results.forEach((bezier, index) => {
      if (index > 3) {
        return;
      }
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
});

// {CubicBezier: (<127, 152> <264.752, 58.261> <249.197, 317.985> <177.083, 217.083>)}
// {CubicBezier: (<177.083, 217.083> <161.115, 194.74> <185.11, 180.015> <205.938, 188.938>)}
// {CubicBezier: (<205.938, 188.938> <235.782, 201.723> <251.807, 239.502> <277.054, 258.054>)}
// {CubicBezier: (<277.054, 258.054> <314.238, 285.377> <406.84, 279.919> <441.635, 252>)}
// {CubicBezier: (<441.635, 252> <463, 234.857> <485.145, 208.545> <463.484, 182.484>)}
// {CubicBezier: (<463.484, 182.484> <438.334, 152.224> <372.164, 166.874> <368, 208.165>)}
// {CubicBezier: (<368, 208.165> <360.836, 279.213> <472.908, 328.853> <339.73, 401.635>)}
// {CubicBezier: (<339.73, 401.635> <260.134, 445.134> <103.141, 340.667> <148.344, 295>)}
// {CubicBezier: (<148.344, 295> <154.507, 288.773> <163.538, 299.558> <171.348, 302.739>)}
// {CubicBezier: (<171.348, 302.739> <215.019, 320.529> <262.927, 327.404> <308, 319>)}
