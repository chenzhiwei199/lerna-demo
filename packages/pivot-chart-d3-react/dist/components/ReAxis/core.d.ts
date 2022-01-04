import * as d3 from 'd3';
import { ScaleType, DIRECTION, SCALE_RANGE } from '../../global.d';
export declare function getScaleByType(type: string, min: number | undefined, max: number): d3.ScaleLinear<number, number> | d3.ScaleBand<string>;
export declare function getScale(scaleType: any, range: any, max: number): any;
export declare function getAxis(type: DIRECTION, scaleType: ScaleType, range: SCALE_RANGE, size: number, isLabelRotate?: boolean): {
    scale: any;
    axis: any;
    transform: any;
    angle: any;
    textAnchor: any;
    verticalAnchor: any;
    firstTextAnchor: any;
    firstVerticalAnchor: any;
};
