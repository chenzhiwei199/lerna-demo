export default class Offset {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public toTransform() {
    return `translate(${this.x}, ${this.y})`;
  }

  public toOffset() {
    return {
      offsetX: this.x,
      offsetY: this.y,
    };
  }
  public get(key: string) {
    return this[key];
  }
}
