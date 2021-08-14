import { CubicBezier } from './cubic-bezier';
import { CurveFitBase } from './curve-fit-base';
import { Vector } from './vector';

const MAX_ITERS = 4;
const END_TANGENT_N_PTS = 8;
const MID_TANGENT_N_PTS = 4;

export class CurveFit extends CurveFitBase {
  private static _instance: CurveFit;

  private static GetInstance() {
    if (!CurveFit._instance) {
      CurveFit._instance = new CurveFit();
    }
    return CurveFit._instance;
  }

  private _result: CubicBezier[] = [];

  private constructor() {
    super();
  }

  public static Fit(points: Vector[], maxError: number): CubicBezier[] {
    const instance = CurveFit.GetInstance();

    try {
      // initialize arrays
      instance._pts = points;
      instance.initializeArcLengths();
      instance._squaredError = maxError * maxError;

      // Find tangents at ends
      const last: number = points.length - 1;
      const tanL = instance.getLeftTangent(last);
      const tanR = instance.getRightTangent(last);

      // do the actual fit
      instance.FitRecursive(0, last, tanL, tanR);
      return instance._result;
    } finally {
      instance._pts = [];
      instance._result = [];
      instance._arclen = [];
      instance._u = [];
    }

    return [];
  }

  private FitRecursive(first = 0, last = 0, tanL: Vector, tanR: Vector): void {
    let split = 0;
    let curve = null;

    const fitCurveResult = this.FitCurve(first, last, tanL, tanR, curve, split);
    split = fitCurveResult.split;
    curve = fitCurveResult.curve;

    if (fitCurveResult.response) {
      this._result.push(curve);
    } else {
      // If we get here, fitting failed, so we need to recurse
      // first, get mid tangent
      const tanM1 = this.GetCenterTangent(first, last, split);
      const tanM2 = new Vector(-tanM1.x, -tanM1.y);

      // our end tangents might be based on points outside the new curve (this is possible for mid tangents too
      // but since we need to maintain C1 continuity, it's too late to do anything about it)
      if (first == 0 && split < END_TANGENT_N_PTS) {
        tanL = this.getLeftTangent(split);
      }
      if (
        last == this._pts.length - 1 &&
        split > this._pts.length - (END_TANGENT_N_PTS + 1)
      ) {
        tanR = this.getRightTangent(split);
      }

      // do actual recursion
      this.FitRecursive(first, split, tanL, tanM1);
      this.FitRecursive(split, last, tanM2, tanR);
    }
  }
}
