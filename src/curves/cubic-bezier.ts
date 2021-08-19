import { Point, Vector } from './vector';

export class CubicBezier {
  public static from(cubicBezierLike: {
    p0: Point;
    p1: Point;
    p2: Point;
    p3: Point;
  }): CubicBezier {
    return new CubicBezier(
      Vector.from(cubicBezierLike.p0),
      Vector.from(cubicBezierLike.p1),
      Vector.from(cubicBezierLike.p2),
      Vector.from(cubicBezierLike.p3)
    );
  }

  public constructor(
    public readonly p0: Vector,
    public readonly p1: Vector,
    public readonly p2: Vector,
    public readonly p3: Vector
  ) {}

  public sample(t: number): Vector {
    const ti = 1 - t;
    const t0 = ti * ti * ti;
    const t1 = 3 * ti * ti * t;
    const t2 = 3 * ti * t * t;
    const t3 = t * t * t;
    return this.p0
      .multiply(t0)
      .add(this.p1.multiply(t1))
      .add(this.p2.multiply(t2))
      .add(this.p3.multiply(t3));
  }
}
