export interface Point {
  x: number;
  y: number;
}

export class Vector {
  public static from(point: Point): Vector {
    return new Vector(point.x, point.y);
  }

  public constructor(public x: number, public y: number) {}

  public add(a: Vector | number): Vector {
    return new Vector(
      this.x + (a instanceof Vector ? a.x : a),
      this.y + (a instanceof Vector ? a.y : a)
    );
  }

  public subtract(a: Vector | number): Vector {
    return new Vector(
      this.x - (a instanceof Vector ? a.x : a),
      this.y - (a instanceof Vector ? a.y : a)
    );
  }

  public multiply(a: Vector | number): Vector {
    return new Vector(
      this.x * (a instanceof Vector ? a.x : a),
      this.y * (a instanceof Vector ? a.y : a)
    );
  }

  public divide(a: Vector | number): Vector {
    return new Vector(
      this.x / (a instanceof Vector ? a.x : a),
      this.y / (a instanceof Vector ? a.y : a)
    );
  }

  public distance(a: Vector): number {
    return Math.sqrt(this.distanceSquared(a));
  }

  public distanceSquared(a: Vector): number {
    const x = this.x - a.x;
    const y = this.y - a.y;
    return x * x + y * y;
  }

  public lerp(v: Vector, fraction: number): Vector {
    return new Vector(
      this.x + (v.x - this.x) * fraction,
      this.y + (v.y - this.y) * fraction
    );
  }

  public equalsOrClose(a: Vector): boolean {
    return this.distanceSquared(a) < Number.EPSILON;
  }

  public dot(a: Vector): number {
    return this.x * a.x + this.y * a.y;
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalize(): Vector {
    return this.divide(this.length());
  }
}
