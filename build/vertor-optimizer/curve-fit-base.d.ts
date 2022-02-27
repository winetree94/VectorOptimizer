import { CubicBezier } from './cubic-bezier';
import { Vector } from './vector';
export declare class CurveFitBase {
    _pts: ReadonlyArray<Vector>;
    _arclen: ReadonlyArray<number>;
    protected _u: number[];
    protected _squaredError: number;
    protected fitCurve(first: number, last: number, tanL: Vector, tanR: Vector, curve: CubicBezier, split: number): {
        response: boolean;
        split: number;
        curve: CubicBezier;
    };
    protected findMaxSquaredError(first: number, last: number, curve?: CubicBezier, split?: number): {
        response: number;
        split: number;
    };
    protected generateBezier(first: number, last: number, tanL: Vector, tanR: Vector): CubicBezier;
    protected reparameterize(first: number, last: number, curve: CubicBezier): void;
    protected arcLengthParamaterize(first: number, last: number): void;
    protected getLeftTangent(last: number): Vector;
    protected getRightTangent(first: number): Vector;
    protected getCenterTangent(first: number, last: number, split: number): Vector;
}
//# sourceMappingURL=curve-fit-base.d.ts.map