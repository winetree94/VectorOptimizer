import { CubicBezier } from './cubic-bezier';
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

const MAX_ITERS = 4; // maximum number of iterations of newton's method to run before giving up and splitting curve
const END_TANGENT_N_PTS = 8; // maximum number of points to base end tangent on
const MID_TANGENT_N_PTS = 4; // maximum number of points on each side to base mid tangent on

// This is the base class containing implementations common to CurveFit and CurveBuilder.
// Most of this is ported from http://tog.acm.org/resources/GraphicsGems/gems/FitCurves.c
export class CurveFitBase {
  // Points in the whole line being used for fitting.
  protected _pts: Vector[] = [];
  // length of curve before each point (so, arclen[0] = 0, arclen[1] = distance(pts[0], pts[1]),
  // arclen[2] = arclen[1] + distance(pts[1], pts[2]) ... arclen[n -1] = length of the entire curve, etc).
  protected _arclen: number[] = [];
  // current parametrization of the curve. When fitting, u[i] is the parametrization for the point in pts[first + i]. This is
  // an optimization for CurveBuilder, since it might not need to allocate as big of a _u as is necessary to hold the whole curve.
  protected _u: number[] = [];
  // maximum squared error before we split the curve
  protected _squaredError: number = 0;

  /// <summary>
  /// Tries to fit single Bezier curve to the points in [first ... last]. Destroys anything in <see cref="_u"/> in the process.
  /// Assumes there are at least two points to fit.
  /// </summary>
  /// <param name="first">Index of first point to consider.</param>
  /// <param name="last">Index of last point to consider (inclusive).</param>
  /// <param name="tanL">Tangent at teh start of the curve ("left").</param>
  /// <param name="tanR">Tangent on the end of the curve ("right").</param>
  /// <param name="curve">The fitted curve.</param>
  /// <param name="split">Point at which to split if this method returns false.</param>
  /// <returns>true if the fit was within error tolerence, false if the curve should be split. Even if this returns false, curve will contain
  /// a curve that somewhat fits the points; it's just outside error tolerance.</returns>
  protected FitCurve(
    first: number,
    last: number,
    tanL: Vector,
    tanR: Vector,
    curve: CubicBezier,
    split: number
  ): {
    response: boolean;
    split: number;
    curve: CubicBezier;
  } {
    const result: {
      response: boolean;
      split: number;
      curve: CubicBezier;
    } = {
      response: false,
      split: split,
      curve: curve,
    };

    const pts = this._pts;
    const nPts = last - first + 1;
    if (nPts < 2) {
      throw new Error(
        'INTERNAL ERROR: Should always have at least 2 points here'
      );
    } else if (nPts == 2) {
      // if we only have 2 points left, estimate the curve using Wu/Barsky
      const p0 = pts[first];
      const p3 = pts[last];
      const alpha = p0.distance(p3) / 3;
      const p1 = tanL.multiply(alpha).add(p0);
      const p2 = tanR.multiply(alpha).add(p3);
      curve = new CubicBezier(p0, p1, p2, p3);
      result.curve = curve;
      split = 0;
      result.split = split;
      result.response = true;
      return result;
    } else {
      split = 0;
      result.split = split;
      this.arcLengthParamaterize(first, last); // initially start u with a simple chord-length paramaterization
      curve = null;
      result.curve = curve;
      for (let i = 0; i < MAX_ITERS + 1; i++) {
        // use newton's method to find better parameters (except on first run, since we don't have a curve yet)
        if (i != 0) {
          this.Reparameterize(first, last, curve);
        }
        // generate the curve itself
        curve = this.GenerateBezier(first, last, tanL, tanR);
        result.curve = curve;
        // calculate error and get split point (point of max error)
        const res = this.FindMaxSquaredError(first, last, curve, result.split);
        result.split = res.split;
        // if we're within error tolerance, awesome!
        if (res.response < this._squaredError) {
          result.response = true;
          return result;
        }
      }
      result.response = false;
      return result;
    }
  }

  protected initializeArcLengths(): void {
    const pts = this._pts;
    const arclen = this._arclen;
    const count = pts.length;
    arclen.push(0);
    let clen = 0;
    let pp = pts[0];
    for (let i = 1; i < count; i++) {
      const np = pts[i];
      clen += Vector.from(pp).distance(Vector.from(np));
      arclen.push(clen);
      pp = np;
    }
  }

  protected FindMaxSquaredError(
    first: number,
    last: number,
    curve: CubicBezier = null,
    split = 0
  ): {
    response: number;
    split: number;
  } {
    const result = {
      response: 0,
      split: split,
    };

    const pts = this._pts;
    const u = this._u;
    let s = (last - first + 1) / 2;
    const nPts = last - first + 1;
    let max = 0;
    for (let i = 1; i < nPts; i++) {
      const v0 = pts[first + i];
      const v1 = curve.sample(u[i]);
      const d = v0.distanceSquared(v1);
      if (d > max) {
        max = d;
        s = i;
      }
    }

    // split at point of maximum error
    split = s + first;
    if (split <= first) split = first + 1;
    if (split >= last) split = last - 1;

    result.split = split;
    result.response = max;
    return result;
  }

  protected GenerateBezier(
    first: number,
    last: number,
    tanL: Vector,
    tanR: Vector
  ): CubicBezier {
    const pts = this._pts;
    const u = this._u;
    const nPts = last - first + 1;
    const p0 = pts[first],
      p3 = pts[last]; // first and last points of curve are actual points on data
    let c00 = 0,
      c01 = 0,
      c11 = 0,
      x0 = 0,
      x1 = 0; // matrix members -- both C[0,1] and C[1,0] are the same, stored in c01
    for (let i = 1; i < nPts; i++) {
      // Calculate cubic bezier multipliers
      const t = u[i];
      const ti = 1 - t;
      const t0 = ti * ti * ti;
      const t1 = 3 * ti * ti * t;
      const t2 = 3 * ti * t * t;
      const t3 = t * t * t;

      // For X matrix; moving this up here since profiling shows it's better up here (maybe a0/a1 not in registers vs only v not in regs)
      const s = p0
        .multiply(t0)
        .add(p0.multiply(t1))
        .add(p3.multiply(t2))
        .add(p3.multiply(t3)); // NOTE: this would be Q(t) if p1=p0 and p2=p3
      const v = pts[first + i].subtract(s);

      // C matrix
      const a0 = tanL.multiply(t1);
      const a1 = tanR.multiply(t2);
      c00 += a0.dot(a0);
      c00 += a0.dot(a0);
      c01 += a0.dot(a1);
      c11 += a1.dot(a1);

      // X matrix
      x0 += a0.dot(v);
      x1 += a1.dot(v);
    }

    // determinents of X and C matrices
    const det_C0_C1 = c00 * c11 - c01 * c01;
    const det_C0_X = c00 * x1 - c01 * x0;
    const det_X_C1 = x0 * c11 - x1 * c01;
    const alphaL = det_X_C1 / det_C0_C1;
    const alphaR = det_C0_X / det_C0_C1;

    // if alpha is negative, zero, or very small (or we can't trust it since C matrix is small), fall back to Wu/Barsky heuristic
    const linDist = p0.distance(p3);
    const epsilon2 = Number.EPSILON * linDist;
    if (
      Math.abs(det_C0_C1) < Number.EPSILON ||
      alphaL < epsilon2 ||
      alphaR < epsilon2
    ) {
      const alpha = linDist / 3;
      const p1 = tanL.multiply(alpha).add(p0);
      const p2 = tanR.multiply(alpha).add(p3);
      return new CubicBezier(p0, p1, p2, p3);
    } else {
      const p1 = tanL.multiply(alphaL).add(p0);
      const p2 = tanR.multiply(alphaR).add(p3);
      return new CubicBezier(p0, p1, p2, p3);
    }
  }

  /// <summary>
  /// Attempts to find a slightly better parameterization for u on the given curve.
  /// </summary>
  protected Reparameterize(
    first: number,
    last: number,
    curve: CubicBezier
  ): void {
    const pts = this._pts;
    const u = this._u;
    const nPts = last - first;
    for (let i = 1; i < nPts; i++) {
      const p = pts[first + i];
      const t = u[i];
      const ti = 1 - t;

      // Control vertices for Q'
      const qp0 = curve.p1.subtract(curve.p0).multiply(3);
      const qp1 = curve.p2.subtract(curve.p1).multiply(3);
      const qp2 = curve.p3.subtract(curve.p2).multiply(3);

      // Control vertices for Q''
      const qpp0 = qp1.subtract(qp0).multiply(2);
      const qpp1 = qp2.subtract(qp1).multiply(2);

      // Evaluate Q(t), Q'(t), and Q''(t)
      const p0 = curve.sample(t);
      const p1 = qp0
        .multiply(ti * ti)
        .add(qp1.multiply(2 * ti * t))
        .add(qp2.multiply(t * t));
      const p2 = qpp0.multiply(ti).add(qpp1.multiply(t));

      // these are the actual fitting calculations using http://en.wikipedia.org/wiki/Newton%27s_method
      // We can't just use .X and .Y because Unity uses lower-case "x" and "y".
      const num = (p0.x - p.x) * p1.x + (p0.y - p.y) * p1.y;
      const den =
        p1.x * p1.x + p1.y * p1.y + (p0.x - p.x) * p2.x + (p0.y - p.y) * p2.y;
      const newU = t - num / den;
      if (Math.abs(den) > Number.EPSILON && newU >= 0 && newU <= 1) {
        u[i] = newU;
      }
    }
  }

  protected arcLengthParamaterize(first: number, last: number): void {
    const arclen = this._arclen;
    const u = this._u;
    u.splice(0);
    const diff = arclen[last] - arclen[first];
    const start = arclen[first];
    const nPts = last - first;
    u.push(0);
    for (let i = 1; i < nPts; i++) {
      u.push((arclen[first + i] - start) / diff);
    }
    u.push(1);
  }

  protected getLeftTangent(last: number): Vector {
    const pts = this._pts;
    const arclen = this._arclen;
    const totalLen = arclen[arclen.length - 1];
    const p0 = pts[0];
    let tanL = pts[1].subtract(p0).normalize();
    let total = tanL;
    let weightTotal = 1;
    last = Math.min(END_TANGENT_N_PTS, last - 1);
    for (let i = 2; i <= last; i++) {
      const ti = 1 - arclen[i] / totalLen;
      const weight = ti * ti * ti;
      const v = pts[i].subtract(p0).normalize();
      total = total.add(v.multiply(weight));
      weightTotal += weight;
    }
    // if the vectors add up to zero (ie going opposite directions), there's no way to normalize them
    if (total.length() > Number.EPSILON) {
      tanL = total.divide(weightTotal).normalize();
    }
    return tanL;
  }

  protected getRightTangent(first: number): Vector {
    const pts = this._pts;
    const arclen = this._arclen;
    const totalLen = arclen[arclen.length - 1];
    const p3 = pts[pts.length - 1];
    let tanR = pts[pts.length - 2].subtract(p3).normalize();
    let total = tanR;
    let weightTotal = 1;
    first = Math.max(pts.length - (END_TANGENT_N_PTS + 1), first + 1);
    for (let i = pts.length - 3; i >= first; i--) {
      const t = arclen[i] / totalLen;
      const weight = t * t * t;
      const v = pts[i].subtract(p3).normalize();
      total = total.add(v.multiply(weight));
      weightTotal += weight;
    }
    if (total.length() > Number.EPSILON) {
      tanR = total.divide(weightTotal).normalize();
    }
    return tanR;
  }

  /// <summary>
  /// Gets the tangent at a given point in the curve.
  /// </summary>
  protected GetCenterTangent(
    first: number,
    last: number,
    split: number
  ): Vector {
    const pts = this._pts;
    const arclen = this._arclen;

    // because we want to maintain C1 continuity on the spline, the tangents on either side must be inverses of one another
    // Debug.Assert(first < split && split < last);
    const splitLen = arclen[split];
    const pSplit = pts[split];

    // left side
    const firstLen = arclen[first];
    let partLen = splitLen - firstLen;
    let total = new Vector(0, 0);
    let weightTotal = 0;
    for (let i = Math.max(first, split - MID_TANGENT_N_PTS); i < split; i++) {
      const t = (arclen[i] - firstLen) / partLen;
      const weight = t * t * t;
      const v = pts[i].subtract(pSplit).normalize();
      total = total.add(v.multiply(weight));
      weightTotal += weight;
    }
    let tanL =
      total.length() > Number.EPSILON && weightTotal > Number.EPSILON
        ? total.divide(weightTotal).normalize()
        : pts[split - 1].subtract(pSplit).normalize();

    // right side
    partLen = arclen[last] - splitLen;
    const rMax = Math.min(last, split + MID_TANGENT_N_PTS);
    total = new Vector(0, 0);
    weightTotal = 0;
    for (let i = split + 1; i <= rMax; i++) {
      const ti = 1 - (arclen[i] - splitLen) / partLen;
      const weight = ti * ti * ti;
      const v = pSplit.subtract(pts[i]).normalize();
      total = total.add(v.multiply(weight));
      weightTotal += weight;
    }

    let tanR =
      total.length() > Number.EPSILON && weightTotal > Number.EPSILON
        ? total.divide(weightTotal).normalize()
        : pSplit.subtract(pts[split + 1]).normalize();

    // The reason we separate this into two halves is because we want the right and left tangents to be weighted
    // equally no matter the weights of the individual parts of them, so that one of the curves doesn't get screwed
    // for the pleasure of the other half
    total = tanL.add(tanR);

    // Since the points are never coincident, the vector between any two of them will be normalizable, however this can happen in some really
    // odd cases when the points are going directly opposite directions (therefore the tangent is undefined)
    if (total.lengthSquared() < Number.EPSILON) {
      // try one last time using only the three points at the center, otherwise just use one of the sides
      tanL = pts[split - 1].subtract(pSplit).normalize();
      tanR = pSplit.subtract(pts[split + 1]).normalize();
      total = tanL.add(tanR);
      return total.lengthSquared() < Number.EPSILON
        ? tanL
        : total.divide(2).normalize();
    } else {
      return total.divide(2).normalize();
    }
  }
}
