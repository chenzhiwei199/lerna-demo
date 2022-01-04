import BaseGeom from './BaseGeom';
import { DataSource, SizeConfig, PositionConfig, AXIS_DIRECTION, Cell, VisibleConfig } from '../../global.d';
export default class IntervalGeom extends BaseGeom {
    intervalGap: number;
    bandSize: number;
    getPadding(x: Cell[], y: Cell[]): number[];
    drawGraph(data: DataSource, sizeConfig: SizeConfig): JSX.Element;
    transformData(data: DataSource, transpose: AXIS_DIRECTION, positionConfig: PositionConfig, sizeConfig: SizeConfig, containerSizeConfig: SizeConfig, visibleSize: VisibleConfig): {
        x: number;
        y: number;
        w: any;
        h: any;
    }[];
    getCellValues(data: DataSource, cells: Cell[]): any;
    beforeRender(x: Cell[], y: Cell[]): void;
    getMinSize(cell: Cell[]): number;
}
