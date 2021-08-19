import { CubicBezier } from './cubic-bezier';
import { CurveFitBase } from './curve-fit-base';
import { Vector } from './vector';

// Copyright (c) 2015 burningmime
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//    claim that you wrote the original software. If you use this software
//    in a product, an acknowledgement in the product documentation would be
//    appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//    misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const END_TANGENT_N_PTS = 8;
const NO_CURVES: CubicBezier[] = [];

export class CurveFit extends CurveFitBase {
  private _result: CubicBezier[] = [];

  public constructor(public readonly _pts: ReadonlyArray<Vector>) {
    super();
    const arclen = [];
    arclen.push(0);
    let clen = 0;
    let pp = this._pts[0];
    for (let i = 1; i < this._pts.length; i++) {
      const np = this._pts[i];
      clen += Vector.from(pp).distance(Vector.from(np));
      arclen.push(clen);
      pp = np;
    }
    this._arclen = arclen;
  }

  public fit(maxError: number): CubicBezier[] {
    if (maxError < Number.EPSILON) {
      throw new Error(
        'maxError cannot be negative/zero/less than epsilon value'
      );
    }
    if (!this._pts) {
      throw new Error('points');
    }
    if (this._pts.length < 2) {
      return NO_CURVES;
    }

    this._squaredError = maxError * maxError;

    const last: number = this._pts.length - 1;
    const tanL = this.getLeftTangent(last);
    const tanR = this.getRightTangent(0);

    this.fitRecursive(0, last, tanL, tanR);
    return this._result;
  }

  private fitRecursive(first = 0, last = 0, tanL: Vector, tanR: Vector): void {
    let split = 0;
    let curve = null;

    const fitCurveResult = this.fitCurve(first, last, tanL, tanR, curve, split);
    split = fitCurveResult.split;
    curve = fitCurveResult.curve;

    if (fitCurveResult.response) {
      this._result.push(curve);
    } else {
      const tanM1 = this.getCenterTangent(first, last, split);
      const tanM2 = new Vector(-tanM1.x, -tanM1.y);

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
      this.fitRecursive(first, split, tanL, tanM1);
      this.fitRecursive(split, last, tanM2, tanR);
    }
  }
}
