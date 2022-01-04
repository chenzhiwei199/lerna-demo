import { DataSource, Cell, AXIS_DIRECTION, PositionConfig, SizeConfig, VisibleConfig } from '../../global.d';
export default abstract class BaseGeom {
    rows: Cell[];
    cols: Cell[];
    data: any[];
    width: number;
    height: number;
    scrollSize: number;
    scrollGap: number;
    labelSize: number;
    minWidth: number;
    minHeight: number;
    dom: any;
    groupCellPadding: Padding;
    treeCellPadding: Padding;
    constructor(props: BaseGeomProps);
    abstract getMinSize(cell: Cell[]): any;
    getTreeCellPadding(): Padding;
    abstract transformData(data: DataSource, tranpose: AXIS_DIRECTION, positionConfig: PositionConfig, sizeConfig: SizeConfig, containerSizeConfig: SizeConfig, visibleSize?: VisibleConfig): any;
    abstract drawGraph(data: DataSource, sizeConfig: SizeConfig, visibleSize?: VisibleConfig): any;
    getCellValues(data: DataSource, cells: Cell[]): any;
    getGroupCellPadding(): Padding;
    abstract getPadding(x: Cell[], y: Cell[]): any;
    render(): void;
}
export interface BaseGeomProps {
    rows: Cell[];
    cols: Cell[];
    data: any[];
    width: number;
    height: number;
}
export declare type Padding = [number, number, number, number];
