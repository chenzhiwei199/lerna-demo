import * as React from 'react';
import { Cell } from '../../../global.d';
import { ChartConfig } from '../../Chart';
export interface TreeProps {
    xData: Cell[];
    yData: Cell[];
    config: ChartConfig;
}
export interface TreeState {
}
declare class DoubleDataRenderer extends React.Component<TreeProps, TreeState> {
    constructor(props: TreeProps);
    getRealSizeConfig(): {
        width: number;
        height: number;
    };
    renderFacetCell: (visibleSize: any, x: any, y: any) => JSX.Element;
    renderGraph(): JSX.Element;
    render(): JSX.Element;
}
export default DoubleDataRenderer;
