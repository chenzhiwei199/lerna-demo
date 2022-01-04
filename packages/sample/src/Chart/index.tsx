import * as d3 from 'd3';
import { Selection } from 'd3';
import IntervalGeom from '../Geom/IntervalGeom';
import LineGeom from '../Geom/LineGeom';
import PointGeom from '../Geom/PointGeom';
import { Cell, Container, BaseCell, RootContainer } from '../Geom/BaseGeom';
function createAxis(name: string) {
  switch (name) {
    case POSITION.ROW:
      return 'Left';
    case POSITION.COL:
      return 'Bottom';
    default:
      break;
  }
}
export default class ChartRender {
  data: any;
  config: ChartConfig;
  dom: any;
  rows: Array<Cell>;
  cols: Array<Cell>;
  /**
   *
   * 容器宽度
   * @type {string}
   * @memberof ChartRender
   */
  width: number;
  /**
   * 画布容器高度
   *
   * @type {string}
   * @memberof ChartRender
   */
  height: number;
  /**
   * 画布宽度
   *
   * @type {string}
   * @memberof ChartRender
   */
  innerWidth: number;
  /**
   * 画布高度
   *
   * @type {string}
   * @memberof ChartRender
   */
  innerHeight: number;
  /**
   * x轴比例尺
   *
   * @type {string}
   * @memberof ChartRender
   */
  x: any;
  /**
   * y轴比例尺
   *
   * @type {string}
   * @memberof ChartRender
   */
  yL: any;
  /**
   * y 右轴比例尺
   *
   * @type {string}
   * @memberof ChartRender
   */
  yR: any;
  /**
   * x坐标轴
   *
   * @type {string}
   * @memberof ChartRender
   */
  xAxis: any;
  /**
   * y(左)轴坐标轴
   *
   * @type {string}
   * @memberof ChartRender
   */
  yAxisLeft: any;
  /**
   * y(右)轴坐标轴
   *
   * @type {string}
   * @memberof ChartRender
   */
  yAxisRight: any;
  constructor(dom: any, config: ChartConfig) {
    this.dom = dom;
    this.config = config;

    const { width: innerWidth, height: innerHeight } = this.getSize();
    const { width, height, margin, rows, cols } = config;
    this.rows = rows;
    this.cols = cols;
    this.innerWidth = innerWidth;
    this.innerHeight = innerHeight;
    this.width = width;
    this.height = height;
  }

  getSize() {
    const { width, height } = this.config;
    const margin = [0, 0, 0, 0];
    return {
      width: width - margin[1],
      height: height - margin[2],
    };
  }

  getGeom() {
    switch (this.config.geom) {
      case 'interval':
        return IntervalGeom;
      case 'line':
        return LineGeom;
      case 'point':
        return PointGeom;
      default:
        return IntervalGeom;
    }
  }

  drawInterval(container: RootContainer) {
    const Geom = this.getGeom();
    const geom = new Geom({
      dom: this.dom,
      width: this.innerWidth,
      height: this.innerHeight,
      container: container,
      // svg: this.content.append('g').attr('class', 'draw_graph'),
      rows: this.rows,
      cols: this.cols,
      data: this.data,
    });
    geom.render();
  }

  render(data) {
    this.data = data;

    const content = d3
      .select(this.dom)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.drawInterval(content);
  }
}

const SCALE_TYPE = {
  LINEAR: 'linear',
  CATEGORY: 'category',
  TIME_LINEAR: 'timeLinear',
  TIME_CATEGORY: 'timeCategory',
};
const POSITION = {
  ROW: 'row',
  COL: 'col',
  FACET: 'facet',
  COLOR: 'color',
  SHAPE: 'shape',
  SIZE: 'size',
};

const GEOM_TYPE = {
  INTERVAL: 'interval',
  SCATTER: 'scatter',
  LINE: 'line',
  PIE: 'pie',
};

export type GEOM_TYPE = 'interval' | 'scatter' | 'line' | 'pie' | 'point';
export interface BaseChartConfig {
  width: number;
  height: number;
  geom: GEOM_TYPE;
  margin?: MarginConfig;
}
export interface BlockChartConfig extends BaseChartConfig {
  rows: Array<BaseCell>;
  cols: Array<BaseCell>;
}
export interface ChartConfig extends BaseChartConfig {
  rows: Array<Cell>;
  cols: Array<Cell>;
  // dataFormat: (data: Array<any>) => Array<any>;
}
export interface PositionConfig {
  code: string;
  position: 'row' | 'col' | 'facet' | 'color' | 'shape' | 'size';
  type: 'linear' | 'category' | 'timeLinear' | 'timeCategory';
}

export interface MarginConfig {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ScaleMap {
  key: any;
}
