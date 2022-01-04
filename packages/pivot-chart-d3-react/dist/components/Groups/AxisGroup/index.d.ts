import * as React from 'react';
import { Cell, DIRECTION, OffsetConfig } from '../../../global.d';
export interface AxisGroupProps {
    data: Cell[];
    type: DIRECTION;
    /**
     * 整体坐标轴的大小
     */
    size: number;
    containerSize: number;
    axisHeight: number;
    scrollOffsetConfig: OffsetConfig;
    gapStart?: number;
    gapEnd?: number;
    isLabelRotate?: boolean;
}
declare class AxisGroup extends React.PureComponent<AxisGroupProps> {
    renderFacetCell: (visibleSize: any, cell: any) => JSX.Element;
    renderAxisGroup(): JSX.Element;
    render(): JSX.Element;
}
export default AxisGroup;
export declare enum AxisType {
    x = "x",
    y = "y"
}
