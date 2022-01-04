import { Selection, EnterElement } from 'd3';
import {
  DataSource,
  Cell,
  CellScaleType,
  AXIS_DIRECTION,
  PositionConfig,
  SizeConfig,
  VisibleConfig,
} from '../../global.d';
import { getCategoryValues } from '../../utils/chartUtils';

export default abstract class BaseGeom {
  public rows: Cell[];
  public cols: Cell[];
  public data: any[];
  public width: number;
  public height: number;
  public scrollSize: number = 15;
  public scrollGap: number = 3;
  public labelSize: number = 30;
  public minWidth: number = 150;
  public minHeight: number = 100;
  public dom: any;
  public groupCellPadding: Padding = [0, 50, 0, 0];
  public treeCellPadding: Padding = [0, 50, 0, 0];
  constructor(props: BaseGeomProps) {
    const { rows, cols, data, width, height } = props;
    this.width = width;
    this.height = height;
    this.rows = rows;
    this.cols = cols;
    this.data = data;
  }

  public abstract getMinSize(cell: Cell[]);
  public getTreeCellPadding() {
    return this.treeCellPadding;
  }

  public abstract transformData(
    data: DataSource,
    tranpose: AXIS_DIRECTION,
    positionConfig: PositionConfig,
    sizeConfig: SizeConfig,
    containerSizeConfig: SizeConfig,
    visibleSize?: VisibleConfig
  );

  public abstract drawGraph(
    data: DataSource,
    sizeConfig: SizeConfig,
    visibleSize?: VisibleConfig
  );

  public getCellValues(data: DataSource, cells: Cell[]) {
    const currentValues =
      cells && cells[0] ? getCategoryValues(data, [cells[0].code]) : [];
    return currentValues;
  }

  public getGroupCellPadding() {
    return this.groupCellPadding;
  }
  public abstract getPadding(x: Cell[], y: Cell[]);
  public render() {
    console.warn('BaseGeom render');
  }
}

export interface BaseGeomProps {
  rows: Cell[];
  cols: Cell[];
  data: any[];
  width: number;
  height: number;
}

export type Padding = [number, number, number, number];

// export type CellType = LinearType | CategoryType;
// export type LinearType = CellTypeEnum.LINEAR | CellTypeEnum.TIME_LINEAR;
// export type CategoryType = CellTypeEnum.CATEGORY | CellTypeEnum.TIME_CATEGORY;

// export enum PositionEnum  {
//   ROW = 'row',
//   COL = 'col',
// }

// export enum CellTypeEnum {
//   LINEAR = 'linear',
//   CATEGORY = 'category',
//   TIME_LINEAR = 'timeLinear',
//   TIME_CATEGORY = 'timeCategory',
// }

// export type Container = d3.Selection<SVGGElement, {}, SVGGElement, {}>;
