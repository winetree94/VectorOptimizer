"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static from(point) {
        return new Vector(point.x, point.y);
    }
    add(a) {
        return new Vector(this.x + (a instanceof Vector ? a.x : a), this.y + (a instanceof Vector ? a.y : a));
    }
    subtract(a) {
        return new Vector(this.x - (a instanceof Vector ? a.x : a), this.y - (a instanceof Vector ? a.y : a));
    }
    multiply(a) {
        return new Vector(this.x * (a instanceof Vector ? a.x : a), this.y * (a instanceof Vector ? a.y : a));
    }
    divide(a) {
        return new Vector(this.x / (a instanceof Vector ? a.x : a), this.y / (a instanceof Vector ? a.y : a));
    }
    distance(a) {
        return Math.sqrt(this.distanceSquared(a));
    }
    distanceSquared(a) {
        const x = this.x - a.x;
        const y = this.y - a.y;
        return x * x + y * y;
    }
    lerp(v, fraction) {
        return new Vector(this.x + (v.x - this.x) * fraction, this.y + (v.y - this.y) * fraction);
    }
    equalsOrClose(a) {
        return this.distanceSquared(a) < Number.EPSILON;
    }
    dot(a) {
        return this.x * a.x + this.y * a.y;
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        return this.divide(this.length());
    }
}
exports.Vector = Vector;
//# sourceMappingURL=vector.js.map