import { AxisScale, AxisDomain, BaseType } from 'd3';
import { SizeInterface } from './help/SizeOptions';

export type CellScaleType = LinearType | CategoryType;
export type LinearType = ScaleType.LINEAR | ScaleType.TIME_LINEAR;
export type CategoryType = ScaleType.CATEGORY | ScaleType.TIME_CATEGORY;

declare global {
  interface Window {
    getTextWidth: any;
  }
}

export enum ScaleType {
  LINEAR = 'linear',
  CATEGORY = 'category',
  TIME_LINEAR = 'timeLinear',
  TIME_CATEGORY = 'timeCategory',
}

export interface Cell {
  code: string;
  label?: string;
  dimensionKeys: string[];
  position?: 'row' | 'col';
  type: CellScaleType;
  range: SCALE_RANGE;
}

export type SCALE_RANGE = string[] | [number, number];

export interface ScaleConfig {
  xAxisScale: AxisScale<AxisDomain>;
  yAxisScale: AxisScale<AxisDomain>;
}

export interface GridConfig {
  isXGridShow: boolean;
  isYGridShow: boolean;
}
export interface PositionConfig {
  x: Cell;
  y: Cell;
}

export interface DimensionConfig {
  x: Cell[];
  y: Cell[];
}

export interface PositionsConfig {
  x: Cell[];
  y: Cell[];
}
export interface SizeConfig {
  width: number;
  height: number;
}
export interface AxisConfig {
  isXShowScroll?: boolean;
  isYShowScroll?: boolean;
  isYAxisShow?: boolean;
  isXAxisShow?: boolean;
}
export interface OffsetConfig {
  offsetX: number;
  offsetY: number;
}
export interface Offset {
  x: number;
  y: number;
}

export interface TreeDataSource {
  label: string;
  value: string;
  children?: DataSource[];
}

export type DataSource = any[];

export enum AxisType {
  x = 'x',
  y = 'y',
}

export type GContainer = d3.Selection<SVGGElement, {}, BaseType, {}>;
export type SVGContainer = d3.Selection<
  SVGSVGElement,
  unknown,
  HTMLElement,
  any
>;

export interface Config {
  container?: GContainer;
  sizeOptions?: Map<string, SizeInterface>;
  data: DataSource;
  sizeConfig: SizeConfig;
  axisConfig: AxisConfig;
  graphDataConfig: PositionsConfig;
  positionConfig: PositionsConfig;
  dimensionsConfig: PositionsConfig;
}

export enum DIRECTION {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export enum PositionEnum {
  ROW = 'row',
  COL = 'col',
}

export enum AXIS_DIRECTION {
  BL = 'bl',
  LB = 'lb',
}

export interface DimensionValueConfig {
  x: string[][];
  y: string[][];
}

export interface VisibleCell {
  startOffset: number;
  endOffset: number;
}
export interface VisibleConfig {
  x: VisibleCell;
  y: VisibleCell;
}
