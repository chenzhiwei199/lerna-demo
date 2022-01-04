import {
  Config,
  AxisConfig,
  DimensionConfig,
  AxisType,
  SizeConfig,
  PositionConfig,
  PositionsConfig,
} from '../Geom/BaseGeom2';
import { drawAxis } from '../Core';
import * as d3 from 'd3';
import { Cell, Container, RootContainer, GContainer } from '../Geom/BaseGeom';
import { checkIsLinear } from '../utils/chart';

export default class Size {
  config: Config;
  container: RootContainer;
  sizeMap: Map<ELEMENT_TYPE, DoubleElementOptions | ElementOptions> = new Map();
  // 滚动条容器大小
  scrollSize: number = 15;
  // 滚动条容器与内部scrollBar的间距
  scrollGap: number = 3;
  // 分面标签的大小
  labelSize: number = 30;

  constructor(container: RootContainer, config: Config) {
    this.config = config;
    this.container = container;
    this.initSizeOptions();
  }

  measureScrollSize(axisConfig: AxisConfig) {
    const { isXShowScroll, isYShowScroll } = axisConfig;
    const scrollSize = 15;
    // 滚动条大小
    let scrollHeight = 0;
    let scrollWidth = 0;
    // 减去滚动条的宽度和高度
    // if (isXShowScroll) {
    //   scrollHeight = scrollSize;
    // }
    // if (isYShowScroll) {
    //   scrollWidth = scrollSize;
    // }
    // TODO 默认留着滚动条宽度，等到后面抄vscode做成绝对定位的
    return {
      scrollWidth: scrollSize,
      scrollHeight: scrollSize,
    };
  }

  getScrollerSize(axisConfig: AxisConfig) {
    // 滚动条的大小
    const { scrollHeight, scrollWidth } = this.measureScrollSize(axisConfig);
    return new DoubleElementOptions(0, scrollHeight, scrollWidth, 0);
  }

  getFacetLabelSize(dimensionsConfig: DimensionConfig) {
    const { x: xCategorys, y: yCategorys } = dimensionsConfig;
    // 滚动条的大小
    // 分面文本标签的高度和宽度
    const xLabelHeight = xCategorys.length * this.labelSize;
    const yLabelWidth = yCategorys.length * this.labelSize;
    return new DoubleElementOptions(0, xLabelHeight, yLabelWidth, 0);
  }

  getMeasureContainer() {
    const container = this.container
      .append('g')
      .attr('class', 'measure_container');
    return container;
  }

  measureAxisSize(
    container: GContainer,
    width: number,
    type: AxisType,
    cells: Cell[]
  ) {
    let size = 0;
    cells.forEach(cell => {
      const currentSize = drawAxis(container, width, type, cell, true);
      size = currentSize > size ? currentSize : size;
    });
    container.remove();
    return size;
  }

  getAxisSize(sizeConfig: SizeConfig, positionConfig: PositionsConfig) {
    const { x: xPosition, y: yPositions } = positionConfig;
    const { width, height } = sizeConfig;
    // 滚动条的大小
    // 分面文本标签的高度和宽度
    // 测量坐标轴的宽度和高度
    const xAxisHeight = this.measureAxisSize(
      this.getMeasureContainer(),
      width,
      AxisType.x,
      xPosition
    );
    const yAxisWidth = this.measureAxisSize(
      this.getMeasureContainer(),
      height,
      AxisType.y,
      yPositions
    );
    return new DoubleElementOptions(0, xAxisHeight, yAxisWidth, 0);
  }

  sumSize(sizes: SizeInterface[], key: string) {
    let sum = 0;
    sizes.forEach(size => {
      sum = sum + size.getSize(key);
    });
    return sum;
  }

  getGraphSize(sizeConfig: SizeConfig) {
    const { width, height } = sizeConfig;
    const sizes = [...this.sizeMap.keys()]
      .filter(item => item !== ELEMENT_TYPE.GEOM)
      .map(key => this.sizeMap.get(key)) as SizeInterface[];
    // 绘图容器的大小
    const graphHeight = height - this.sumSize(sizes, 'height');
    const graphWidth = width - this.sumSize(sizes, 'width');
    return new ElementOptions(graphWidth, graphHeight);
  }

  getMeasureNameContainerSize(positionConfig: PositionsConfig) {
    const { x, y } = positionConfig;
    let yMeasureNameWidth = 0;
    let xMeasureNameHeight = 0;
    if (checkIsLinear(x)) {
      xMeasureNameHeight = this.labelSize;
    }
    if (checkIsLinear(y)) {
      yMeasureNameWidth = this.labelSize;
    }
    // return new DoubleElementOptions(0, 0, 0, 0);
    return new DoubleElementOptions(
      0,
      xMeasureNameHeight,
      yMeasureNameWidth,
      0
    );
  }

  initSizeOptions() {
    const {
      axisConfig,
      dimensionsConfig,
      positionConfig,
      sizeConfig,
    } = this.config;
    this.sizeMap.set(ELEMENT_TYPE.SCROLLER, this.getScrollerSize(axisConfig));
    this.sizeMap.set(
      ELEMENT_TYPE.FACET_LABEL,
      this.getFacetLabelSize(dimensionsConfig)
    );
    this.sizeMap.set(
      ELEMENT_TYPE.AXIS,
      this.getAxisSize(sizeConfig, positionConfig)
    );
    this.sizeMap.set(
      ELEMENT_TYPE.MEASURE_LABEL,
      this.getMeasureNameContainerSize(positionConfig)
    );
    this.sizeMap.set(ELEMENT_TYPE.GEOM, this.getGraphSize(sizeConfig));
  }

  get() {
    return this.sizeMap;
  }
}

export enum ELEMENT_TYPE {
  AXIS = 'AXIS',
  GRID = 'GRID',
  FACET_LABEL = 'FACET_LABEL',
  MEASURE_LABEL = 'MEASURE_LABEL',
  SCROLLER = 'SCROLLER',
  GEOM = 'GEOM',
}

export interface SizeInterface {
  getSize(key: string);
}
export class ElementOptions implements SizeInterface {
  width: number;
  height: number;
  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
  }
  getHeight() {
    return this.getSize('height');
  }
  getWidth() {
    return this.getSize('width');
  }
  getSize(key: string) {
    return this[key];
  }
}

export class DoubleElementOptions {
  x: ElementOptions;
  y: ElementOptions;
  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x = new ElementOptions(x1, y1);
    this.y = new ElementOptions(x2, y2);
  }
  getX() {
    return this.getOptions('x');
  }
  getY() {
    return this.getOptions('y');
  }
  getOptions(key: string) {
    return this[key];
  }
  getSize(key: string) {
    return this.x.getSize(key) + this.y.getSize(key);
  }
}
