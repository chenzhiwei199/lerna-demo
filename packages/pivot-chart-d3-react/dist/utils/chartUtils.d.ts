import { ScaleLinear, ScaleBand } from 'd3';
import { MatrixType } from './matrix';
import { Cell, AxisType, PositionsConfig, DIRECTION, CellScaleType } from '../global.d';
import SizeOptions from '../help/SizeOptions';
import Offset from '../help/Offset';
export declare function checkIsCategory(types: CellScaleType | CellScaleType[]): boolean;
export declare function checkIsLinear(types: CellScaleType | CellScaleType[]): boolean;
export declare function check(types: CellScaleType | CellScaleType[], checkFunc: (type: CellScaleType) => boolean): boolean;
export declare function getScale(cell: Cell, max: number): any;
export declare function getScaleByType(type: string, min: number | undefined, max: number): ScaleLinear<number, number> | ScaleBand<string>;
export declare function getAxis(type: DIRECTION, cell: Cell, size: number, isLabelRotate?: boolean): {
    scale: any;
    axis: any;
    transform: any;
    angle: any;
    textAnchor: any;
    verticalAnchor: any;
    firstTextAnchor: any;
    firstVerticalAnchor: any;
};
export declare function produceScale(data: any[], x: Cell[], y: Cell[]): PositionsConfig;
/**
 *
 * @param x
 */
export declare function produceCategoryInfo(x: Cell[]): {
    cell: Cell[];
    categorys: Cell[];
};
/**
 * 1.获取分面的维度 2.获取分面的深度 3. 获取一个方向分面的数量 4.获取当前最小cell的字段类型
 *
 * @export
 * @param {Array<any>} data
 * @param {Array<Cell>} x
 * @returns
 */
export declare function produceConfig(x: Cell[]): {
    categorys: Cell[];
    cells: Cell[];
};
export declare function produceSizeConfig(size: number, nums: number, minSize: number): {
    isControl: boolean;
    size: number;
};
export declare function flattenCategoryValues(root: string[] | undefined, data: string[][], categorys: Cell[], level?: number): any;
export declare function getScollInfo(containerSize: number, realSize: number, minSize?: number): {
    scrollBarSize: number;
    maxScroll: number;
    viewMaxScroll: number;
};
export declare const getViewScrollDistance: (containerSize: number, realSize: number) => (scrollDistance: any) => {
    viewPosition: number;
    scrollBarPosition: number;
};
export declare const getAxisInfo: (type: AxisType, cell: Cell, size: number) => {
    scale: any;
    axis: any;
    transform: any;
    labelTransform: any;
};
export declare function getCategoryValues(data: any[], categorys: string[]): any;
export declare function countTreeData(data: any[], keyArray: string[]): number;
export declare function getGraphOffset(sizeOptions: SizeOptions): Offset;
export declare function getXAxisOffset(sizeOptions: SizeOptions): Offset;
export declare function getXFacetOffset(sizeOptions: SizeOptions): Offset;
export declare function getYFacetOffset(sizeOptions: SizeOptions): Offset;
export declare function getXMeasureNameOffset(sizeOptions: SizeOptions): Offset;
export declare function getYMeasureNameOffset(sizeOptions: SizeOptions): Offset;
export declare function getYAxisOffset(sizeOptions: SizeOptions): Offset;
export interface AxisRowData {
    label: string;
}
/**
 * 获取坐标轴的数据
 * @param categorys
 * @param values
 * @param cells
 * @param size
 */
export declare function createAxisData(categorys: Cell[], values: string[][], cells: Cell[], size: number): {
    size: number;
    facetData: {
        data: AxisRowData[];
        size: number;
    }[];
    data: (Cell & {
        label: string;
    })[];
};
export declare function isRotate(xData: Cell[]): boolean;
/**
 * Get the ticks of an axis
 * @param  {Object}  axis The configuration of an axis
 * @param {Boolean} isGrid Whether or not are the ticks in grid
 * @param {Boolean} isAll Return the ticks of all the points or not
 * @return {Array}  Ticks
 */
export declare const getTicksOfAxis: (axis: any, isGrid: any, isAll: any) => any;
export declare function getMatrix(direction: DIRECTION, size: number): MatrixType[];
