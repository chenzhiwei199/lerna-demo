import { Selection, EnterElement } from 'd3';

export default class BaseGeom {
  rows: Array<Cell>;
  cols: Array<Cell>;
  data: Array<any>;
  // svg: Container;
  container: RootContainer;
  width: number;
  height: number;
  scrollSize: number = 15;
  scrollGap: number = 3;
  labelSize: number = 30;
  minWidth: number = 150;
  minHeight: number = 100;
  dom: any;
  groupCellPadding: Padding = [0, 50, 0, 0];
  treeCellPadding: Padding = [0, 50, 0, 0];
  constructor(props: BaseGeomProps) {
    const { rows, cols, container, data, width, height, dom } = props;
    this.dom = dom;
    this.width = width;
    this.height = height;
    this.rows = rows;
    this.cols = cols;
    this.data = data;
    this.container = container;
    // this.svg = svg;
  }

  getTreeCellPadding() {
    return this.treeCellPadding;
  }

  getGroupCellPadding() {
    return this.groupCellPadding;
  }
  render() {
    console.warn('BaseGeom render');
  }
}

export interface BaseGeomProps {
  rows: Array<Cell>;
  cols: Array<Cell>;
  data: Array<any>;
  width: number;
  height: number;
  dom: any;
  // svg: Container;
  container: RootContainer;
}

export interface BaseCell {
  code: string;
  type: CellType;
  metrics?: string;
}
export interface Cell extends BaseCell {
  position?: 'row' | 'col';
  range?: Array<string> | [number, number];
}

export type CellType = LinearType | CategoryType;
export type LinearType = CellTypeEnum.LINEAR | CellTypeEnum.TIME_LINEAR;
export type CategoryType = CellTypeEnum.CATEGORY | CellTypeEnum.TIME_CATEGORY;

export enum PositionEnum {
  ROW = 'row',
  COL = 'col',
}

export enum CellTypeEnum {
  LINEAR = 'linear',
  CATEGORY = 'category',
  TIME_LINEAR = 'timeLinear',
  TIME_CATEGORY = 'timeCategory',
}

export type Padding = [number, number, number, number];

export type Container = Selection<SVGElement, unknown, null, undefined>;
export type RootContainer = Selection<SVGSVGElement, unknown, null, undefined>;
export type GContainer = Selection<SVGGElement, unknown, null, undefined>;
