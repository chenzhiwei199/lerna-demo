import { Container, GContainer } from '../Geom/BaseGeom';

export class ContaienrOptions {
  container: GContainer;
  constructor(container: GContainer) {
    this.container = container;
  }
  get() {
    return this.container;
  }
}

export class DoubleContainerOptions {
  x: ContaienrOptions;
  y: ContaienrOptions;
  constructor(x: GContainer, y: GContainer) {
    this.x = new ContaienrOptions(x);
    this.y = new ContaienrOptions(y);
  }
  getXOptions() {
    return this.x;
  }

  getYOptions() {
    return this.y;
  }
}

export type ContainerElement = ContaienrOptions | DoubleContainerOptions;
