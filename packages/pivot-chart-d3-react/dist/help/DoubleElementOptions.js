"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ElementOptions_1 = require("./ElementOptions");
class DoubleElementOptions {
    constructor(x1, y1, x2, y2) {
        this.x = new ElementOptions_1.ElementOptions(x1, y1);
        this.y = new ElementOptions_1.ElementOptions(x2, y2);
    }
    getX() {
        return this.getOptions('x');
    }
    getY() {
        return this.getOptions('y');
    }
    getOptions(key) {
        return this[key];
    }
    getSize(key) {
        return this.x.getSize(key) + this.y.getSize(key);
    }
    transform2Size() {
        return {
            width: this.getWidth(),
            height: this.getHeight(),
        };
    }
    getWidth() {
        return this.getSize('width');
    }
    getHeight() {
        return this.getSize('height');
    }
}
exports.DoubleElementOptions = DoubleElementOptions;
