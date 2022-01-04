import * as React from 'react';
import { Cell } from '../../../global.d';
import { ChartConfig } from '../../../components/Chart';
export interface AxisGroupProps {
    xData: Cell[];
    yData: Cell[];
    config: ChartConfig;
}
declare class GridGroup extends React.PureComponent<AxisGroupProps> {
    renderFacetCell: (visibleSize: any, x: any, y: any) => JSX.Element;
    getRealSizeConfig(): {
        width: number;
        height: number;
    };
    renderGridGroup(): JSX.Element;
    render(): JSX.Element;
}
export default GridGroup;
export declare enum AxisType {
    x = "x",
    y = "y"
}
