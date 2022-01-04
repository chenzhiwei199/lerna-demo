import BaseGeom from './BaseGeom';
import { SizeConfig, DataSource, AXIS_DIRECTION, PositionConfig, Cell } from '../../global.d';
export default class IntervalGeom extends BaseGeom {
    getPadding(x: Cell[], y: Cell[]): number[];
    drawGraph(DataSource: any, sizeConfig: SizeConfig): JSX.Element;
    transformData(data: DataSource, tranpose: AXIS_DIRECTION, positionConfig: PositionConfig, sizeConfig: SizeConfig, containerSizeConfig: SizeConfig): {
        x: any;
        y: number;
    }[];
    getMinSize(cell: Cell[]): number;
}
