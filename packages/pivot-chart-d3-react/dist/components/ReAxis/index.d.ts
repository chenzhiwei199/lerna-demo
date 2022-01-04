import * as React from 'react';
import { BaseType } from 'd3';
import { DIRECTION, ScaleType, SCALE_RANGE } from '../../global.d';
export interface AxisProps {
    virtualConfig?: {
        /**
         * 坐标轴在展示区域的开始偏移量
         */
        startOffset: number;
        /**
         * 坐标轴在展示区域的结束时的偏移量
         */
        endOffset: number;
        /**
         * 坐标轴容器宽度
         */
        containerSize: number;
    };
    range: SCALE_RANGE;
    /**
     * domain类型
     */
    domainType: ScaleType;
    /**
     * 坐标轴方向
     */
    direction: DIRECTION;
    /**
     * 坐标轴高度
     */
    axisHeight: number;
    /**
     * 坐标轴实际宽度
     */
    size: number;
    /**
     * 坐标轴标签是否旋转
     */
    isLabelRotate: boolean;
}
declare class Axis extends React.Component<AxisProps> {
    static defaultProps: {
        type: DIRECTION;
        axisHeight: number;
        size: number;
        containerSize: number;
        isLabelRotate: boolean;
    };
    axis: BaseType;
    constructor(props: AxisProps);
    getOffsetConfig(): {
        startOffset: any;
        startIndex: any;
        endIndex: any;
        rangeUnitSize: number;
    };
    getAxisConfig(): {
        scale: any;
        axis: any;
        transform: any;
        angle: any;
        textAnchor: any;
        verticalAnchor: any;
        firstTextAnchor: any;
        firstVerticalAnchor: any;
    };
    getRange(): SCALE_RANGE;
    getRangeAndSize(): {
        range: SCALE_RANGE;
        size: number;
        groupTransform: any;
    };
    renderLine(): JSX.Element;
    render(): JSX.Element;
}
export default Axis;
export declare enum AxisType {
    x = "x",
    y = "y"
}
