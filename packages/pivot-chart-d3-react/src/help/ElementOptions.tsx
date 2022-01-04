import { SizeInterface } from './SizeOptions';

export class ElementOptions implements SizeInterface {
  public width: number;
  public height: number;
  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
  }
  public getHeight() {
    return this.getSize('height');
  }
  public getWidth() {
    return this.getSize('width');
  }
  public getSize(key: string) {
    return this[key];
  }
  public transform2Size() {
    return {
      width: this.getWidth(),
      height: this.getHeight(),
    };
  }
}
