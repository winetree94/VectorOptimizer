"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CubicBezier = void 0;
const vector_1 = require("./vector");
class CubicBezier {
    constructor(p0, p1, p2, p3) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
    static from(cubicBezierLike) {
        return new CubicBezier(vector_1.Vector.from(cubicBezierLike.p0), vector_1.Vector.from(cubicBezierLike.p1), vector_1.Vector.from(cubicBezierLike.p2), vector_1.Vector.from(cubicBezierLike.p3));
    }
    sample(t) {
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
exports.CubicBezier = CubicBezier;
//# sourceMappingURL=cubic-bezier.js.map