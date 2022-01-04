"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElementOptions {
    constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
    }
    getHeight() {
        return this.getSize('height');
    }
    getWidth() {
        return this.getSize('width');
    }
    getSize(key) {
        return this[key];
    }
    transform2Size() {
        return {
            width: this.getWidth(),
            height: this.getHeight(),
        };
    }
}
exports.ElementOptions = ElementOptions;
