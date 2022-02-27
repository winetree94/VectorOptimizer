export interface Point {
    x: number;
    y: number;
}
export declare class Vector {
    x: number;
    y: number;
    static from(point: Point): Vector;
    constructor(x: number, y: number);
    add(a: Vector | number): Vector;
    subtract(a: Vector | number): Vector;
    multiply(a: Vector | number): Vector;
    divide(a: Vector | number): Vector;
    distance(a: Vector): number;
    distanceSquared(a: Vector): number;
    lerp(v: Vector, fraction: number): Vector;
    equalsOrClose(a: Vector): boolean;
    dot(a: Vector): number;
    lengthSquared(): number;
    length(): number;
    normalize(): Vector;
}
//# sourceMappingURL=vector.d.ts.map