import { Vector } from './vector';
export declare function linearize(src: Vector[], minDistance: number, alwaysKeepLastVertex?: boolean, alwaysLinearizeAllVertexes?: boolean): Vector[];
export declare function removeDuplicates(pts: Vector[]): Vector[];
export declare function rdpReduce(pts: Vector[], error: number): Vector[];
export declare function rdpRecursive(pts: Vector[], error: number, first: number, last: number, keepIndex: number[]): void;
export declare function perpendicularDistance(a: Vector, b: Vector, abDist: number, aCrossB: number, p: Vector): number;
//# sourceMappingURL=curve-preprocess.d.ts.map