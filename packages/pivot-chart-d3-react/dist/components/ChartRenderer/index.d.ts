import * as React from 'react';
import { SizeConfig, DIRECTION } from '../../global.d';
import SizeOptions from '../../help/SizeOptions';
import { ChartConfig } from '../Chart';
import Offset from '../../help/Offset';
export interface ChartProps {
    width: number;
    height: number;
    config: ChartConfig;
}
export interface ChartState {
}
declare class Chart extends React.Component<ChartProps, ChartState> {
    dom: SVGSVGElement | null;
    wheelEventListener: () => void;
    creatId: string;
    constructor(props: ChartProps);
    bindEvent(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    getScrollConfig(sizeConfig: SizeConfig, sizeOptions: SizeOptions): {
        xScrollOffset: Offset;
        yScrollOffset: Offset;
    };
    getScrollType(direction: DIRECTION): any;
    setScrollSize(direction: DIRECTION, size: number): void;
    onScrollPositionChange: (scrollInfo: any, direction: DIRECTION, diff: number) => void;
    render(): JSX.Element;
}
export default Chart;
