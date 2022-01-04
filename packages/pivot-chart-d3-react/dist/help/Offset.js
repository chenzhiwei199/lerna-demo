"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Offset {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toTransform() {
        return `translate(${this.x}, ${this.y})`;
    }
    toOffset() {
        return {
            offsetX: this.x,
            offsetY: this.y,
        };
    }
    get(key) {
        return this[key];
    }
}
exports.default = Offset;
