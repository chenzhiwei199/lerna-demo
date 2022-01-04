import * as React from 'react';
import { ChartProps } from '../Chart';
export interface BlockProps {
    config: ChartProps;
    data: any[];
    index: number;
}
export interface BlockState {
}
declare class Block extends React.Component<BlockProps> {
    renderMetrics(data: any): string;
    render(): JSX.Element;
}
export default Block;
