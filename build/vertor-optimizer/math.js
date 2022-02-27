"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approximate = void 0;
function approximate(v, precision = 10) {
    return Math.floor(v * precision) / precision;
}
exports.approximate = approximate;
//# sourceMappingURL=math.js.map