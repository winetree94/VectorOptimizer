import { CubicBezier } from './cubic-bezier';
import { CurveFitBase } from './curve-fit-base';
import { Vector } from './vector';
export declare function fit(points: readonly Vector[]): CubicBezier[];
export declare function generateArcLengths(points: ReadonlyArray<Vector>): number[];
export declare class CurveFit extends CurveFitBase {
    readonly _pts: ReadonlyArray<Vector>;
    private _result;
    constructor(_pts: ReadonlyArray<Vector>);
    fit(maxError: number): CubicBezier[];
    private fitRecursive;
}
//# sourceMappingURL=curve-fit.d.ts.map