import { ElementOptions } from './ElementOptions';
import { SizeInterface } from './SizeOptions';

export class DoubleElementOptions implements SizeInterface {
  public x: ElementOptions;
  public y: ElementOptions;
  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x = new ElementOptions(x1, y1);
    this.y = new ElementOptions(x2, y2);
  }
  public getX() {
    return this.getOptions('x');
  }
  public getY() {
    return this.getOptions('y');
  }
  public getOptions(key: string) {
    return this[key];
  }
  public getSize(key: string) {
    return this.x.getSize(key) + this.y.getSize(key);
  }

  public transform2Size() {
    return {
      width: this.getWidth(),
      height: this.getHeight(),
    };
  }
  public getWidth() {
    return this.getSize('width');
  }

  public getHeight() {
    return this.getSize('height');
  }
}
