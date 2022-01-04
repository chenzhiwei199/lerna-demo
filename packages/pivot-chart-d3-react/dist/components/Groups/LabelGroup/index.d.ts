import * as React from 'react';
import { DIRECTION, OffsetConfig } from '../../../global.d';
export interface LabelGroupProps {
    data: Array<{
        label?: string;
    }>;
    type: DIRECTION;
    /**
     * 整体坐标轴的大小
     */
    size: number;
    labelHeight: number;
    containerSize: number;
    scrollOffsetConfig: OffsetConfig;
    gapStart?: number;
    gapEnd?: number;
}
declare class LabelGroup extends React.PureComponent<LabelGroupProps> {
    renderFacetCell: (visibleSize: any, cell: any) => JSX.Element;
    renderAxisGroup(): JSX.Element;
    render(): JSX.Element;
}
export default LabelGroup;
