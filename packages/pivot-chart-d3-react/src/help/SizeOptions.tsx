import * as d3 from 'd3';
import { DoubleElementOptions } from './DoubleElementOptions';
import { ElementOptions } from './ElementOptions';
import {
  Cell,
  AxisConfig,
  DimensionConfig,
  SizeConfig,
  PositionsConfig,
  AxisType,
  GContainer,
  Config,
  DIRECTION,
  DimensionValueConfig,
  SVGContainer,
} from '../global.d';
import { checkIsLinear, checkIsCategory, isRotate } from '../utils/chartUtils';
import { drawAxis } from '../core';

export default class Size {
  public config: Config;
  public sizeMap: Map<
    ELEMENT_TYPE,
    DoubleElementOptions | ElementOptions
  > = new Map();
  // 滚动条容器大小
  public scrollSize: number = 15;
  // 滚动条容器与内部scrollBar的间距
  public scrollGap: number = 3;
  // 分面标签的大小
  public labelSize: number = 30;

  constructor(config: Config) {
    this.config = config;
    this.initSizeOptions();
  }

  public measureScrollSize(axisConfig: AxisConfig) {
    const { isXShowScroll, isYShowScroll } = axisConfig;
    const scrollSize = 15;
    // 滚动条大小
    const scrollHeight = 0;
    const scrollWidth = 0;
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

  public getScrollerSize(axisConfig: AxisConfig) {
    // 滚动条的大小
    const { scrollHeight, scrollWidth } = this.measureScrollSize(axisConfig);
    return new DoubleElementOptions(0, scrollHeight, scrollWidth, 0);
  }

  public getFacetLabelSize(dimensionsConfig: DimensionConfig) {
    const { x: xCategorys, y: yCategorys } = dimensionsConfig;
    // 滚动条的大小
    // 分面文本标签的高度和宽度
    const xLabelHeight = xCategorys.length * this.labelSize;
    const yLabelWidth = yCategorys.length * this.labelSize;
    return new DoubleElementOptions(0, xLabelHeight, yLabelWidth, 0);
  }

  public getMeasureContiner() {
    const contaienr = d3.select('body').append('svg');
    return contaienr;
  }

  public measureAxisSize(
    container: SVGContainer,
    width: number,
    type: DIRECTION,
    cells: Cell[],
    isLabelRotate: boolean = false
  ) {
    let size = 0;
    cells.forEach(cell => {
      if (checkIsCategory(cell.type)) {
        cell = { ...cell };
        cell.range = [
          (cell.range as string[]).reduce((max, item) => {
            const currentLength = item ? item.length : 0;
            return currentLength > max.length ? item : max;
          }, ''),
        ];
      }
      const currentSize = drawAxis(
        container,
        width,
        type,
        cell,
        true,
        isLabelRotate
      );
      size = currentSize > size ? currentSize : size;
    });
    container.remove();
    // 旋转文本需要偏移tickLine的高度
    return size + 30;
  }

  public getAxisSize(
    sizeConfig: SizeConfig,
    positionConfig: PositionsConfig,
    graphDataConfig: PositionsConfig
  ) {
    const { x: xPosition, y: yPositions } = positionConfig;
    const { width, height } = sizeConfig;
    const { x: xData } = graphDataConfig;
    // 滚动条的大小
    // 分面文本标签的高度和宽度
    // 测量坐标轴的宽度和高度
    const labelRotate = isRotate(xData);
    const xAxisHeight = this.measureAxisSize(
      this.getMeasureContiner(),
      width,
      DIRECTION.HORIZONTAL,
      xPosition,
      labelRotate
    );
    const yAxisWidth = this.measureAxisSize(
      this.getMeasureContiner(),
      height,
      DIRECTION.VERTICAL,
      yPositions,
      labelRotate
    );
    return new DoubleElementOptions(0, xAxisHeight, yAxisWidth, 0);
  }

  public sumSize(sizes: SizeInterface[], key: string) {
    let sum = 0;
    sizes.forEach(size => {
      sum = sum + size.getSize(key);
    });
    return sum;
  }

  public getGraphSize(sizeConfig: SizeConfig) {
    const { width, height } = sizeConfig;
    const sizes = Array.from(this.sizeMap.keys())
      .filter(item => item !== ELEMENT_TYPE.GEOM)
      .map(key => this.sizeMap.get(key));
    // 绘图容器的大小
    const graphHeight =
      height - this.sumSize(sizes as SizeInterface[], 'height');
    const graphWidth = width - this.sumSize(sizes as SizeInterface[], 'width');
    return new ElementOptions(graphWidth, graphHeight);
  }

  public getMeasureNameContainerSize(positionConfig: PositionsConfig) {
    const { x, y } = positionConfig;
    let yMeasureNameWidth = 0;
    let xMeasureNameHeight = 0;
    if (checkIsLinear(x.map(item => item.type))) {
      xMeasureNameHeight = this.labelSize;
    }
    if (checkIsLinear(y.map(item => item.type))) {
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

  public initSizeOptions() {
    const {
      axisConfig,
      dimensionsConfig,
      positionConfig,
      graphDataConfig,
      sizeConfig,
    } = this.config;
    this.sizeMap.set(ELEMENT_TYPE.SCROLLER, this.getScrollerSize(axisConfig));
    this.sizeMap.set(
      ELEMENT_TYPE.FACET_LABEL,
      this.getFacetLabelSize(dimensionsConfig)
    );
    this.sizeMap.set(
      ELEMENT_TYPE.AXIS,
      this.getAxisSize(sizeConfig, positionConfig, graphDataConfig)
    );
    this.sizeMap.set(
      ELEMENT_TYPE.MEASURE_LABEL,
      this.getMeasureNameContainerSize(positionConfig)
    );
    this.sizeMap.set(ELEMENT_TYPE.GEOM, this.getGraphSize(sizeConfig));
  }

  public get() {
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
  getWidth();
  transform2Size();
  getHeight();
}
