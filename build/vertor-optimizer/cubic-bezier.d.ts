import { Point, Vector } from './vector';
export declare class CubicBezier {
    readonly p0: Vector;
    readonly p1: Vector;
    readonly p2: Vector;
    readonly p3: Vector;
    static from(cubicBezierLike: {
        p0: Point;
        p1: Point;
        p2: Point;
        p3: Point;
    }): CubicBezier;
    constructor(p0: Vector, p1: Vector, p2: Vector, p3: Vector);
    sample(t: number): Vector;
}
//# sourceMappingURL=cubic-bezier.d.ts.map