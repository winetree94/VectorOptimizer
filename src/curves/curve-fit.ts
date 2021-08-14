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

  private _squaredError: number;
  private _pts: Vector[] = [];
  private _arclen: number[] = [];
  private _u: number[] = [];

  private _result: CubicBezier[] = [];

  private constructor() {
    super();
  }

  /**
   * passed
   */
  public initializeArcLengths(): void {
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

  private FitCurve(
    first: number,
    last: number,
    tanL: Vector,
    tanR: Vector,
    curve: CubicBezier,
    split: number
  ) {
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

  private FindMaxSquaredError(
    first: number,
    last: number,
    curve: CubicBezier = null,
    split = 0
  ) {
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
    if (split <= first) {
      split = first + 1;
    }
    if (split >= last) {
      split = last - 1;
    }

    result.split = split;
    result.response = max;
    return result;
  }

  private GenerateBezier(
    first: number,
    last: number,
    tanL: Vector,
    tanR: Vector
  ) {
    const pts = this._pts;
    const u = this._u;
    const nPts = last - first + 1;
    const p0 = pts[first];
    const p3 = pts[last]; // first and last points of curve are actual points on data
    let c00 = 0;
    let c01 = 0;
    let c11 = 0;
    let x0 = 0;
    let x1 = 0; // matrix members -- both C[0,1] and C[1,0] are the same, stored in c01
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

  private Reparameterize(first: number, last: number, curve: CubicBezier) {
    const pts = this._pts;
    const u = this._u;
    const nPts = last - first;
    for (let i = 1; i < nPts; i++) {
      const p = pts[first + i];
      const t = u[i];
      const ti = 1 - t;

      // Control vertices for Q'
      const qp0 = curve.p1.subtract(curve.p0).multiply(new Vector(3, 3));
      const qp1 = curve.p2.subtract(curve.p1).multiply(new Vector(3, 3));
      const qp2 = curve.p3.subtract(curve.p2).multiply(new Vector(3, 3));

      // Control vertices for Q''
      const qpp0 = qp1.subtract(qp0).multiply(new Vector(2, 2));
      const qpp1 = qp2.subtract(qp1).multiply(new Vector(2, 2));

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

  private arcLengthParamaterize(first: number, last: number) {
    const arclen = this._arclen;
    const u = this._u;
    u.splice(0);
    const diff = arclen[last] - arclen[first];
    const start = arclen[first];
    const nPts = last - first;
    u.push(0);
    for (let i = 1; i < nPts; i++) u.push((arclen[first + i] - start) / diff);
    u.push(1);
  }

  private getLeftTangent(last: number) {
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

  private getRightTangent(first: number) {
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

  public GetCenterTangent(first: number, last: number, split: number): Vector {
    const pts = this._pts;
    const arclen = this._arclen;

    // because we want to maintain C1 continuity on the spline, the tangents on either side must be inverses of one another
    const splitLen = arclen[split];
    const pSplit = pts[split];

    // left side
    const firstLen = arclen[first];
    let partLen = splitLen - firstLen;
    let total: Vector = new Vector(0, 0);
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
    if (total.length() * total.length() < Number.EPSILON) {
      // try one last time using only the three points at the center, otherwise just use one of the sides
      tanL = pts[split - 1].subtract(pSplit).normalize();
      tanR = pSplit.subtract(pts[split + 1]).normalize();
      total = tanL.add(tanR);
      return total.length() * total.length() < Number.EPSILON
        ? tanL
        : total.subtract(2).normalize();
    } else {
      return total.subtract(2).normalize();
    }
  }
}
