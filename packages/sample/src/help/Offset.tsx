export class Offset {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toTransform() {
    return `translate(${this.x}, ${this.y})`;
  }

  toOffset() {
    return {
      offsetX: this.x,
      offsetY: this.y
    };
  }
  get(key: string) {
    return this[key];
  }
}