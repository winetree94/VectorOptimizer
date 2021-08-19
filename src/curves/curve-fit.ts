import { CubicBezier } from './cubic-bezier';
import { CurveFitBase } from './curve-fit-base';
import { Vector } from './vector';

const END_TANGENT_N_PTS = 8;

const NO_CURVES: CubicBezier[] = [];

export class CurveFit extends CurveFitBase {
  private _result: CubicBezier[] = [];

  public constructor(public readonly _pts: ReadonlyArray<Vector>) {
    super();
  }

  public Fit(maxError: number): CubicBezier[] {
    if (maxError < Number.EPSILON) {
      throw new Error(
        'maxError cannot be negative/zero/less than epsilon value'
      );
    }
    if (this._pts == null) {
      throw new Error('points');
    }
    if (this._pts.length < 2) {
      return NO_CURVES;
    } // need at least 2 points to do anything

    // initialize arrays
    this.initializeArcLengths();
    this._squaredError = maxError * maxError;

    // Find tangents at ends
    const last: number = this._pts.length - 1;
    const tanL = this.getLeftTangent(last);
    const tanR = this.getRightTangent(last);

    // do the actual fit
    this.FitRecursive(0, last, tanL, tanR);
    return this._result;
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
