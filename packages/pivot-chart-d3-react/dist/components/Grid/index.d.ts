import * as React from 'react';
import { BaseType } from 'd3';
import { Cell, DIRECTION } from '../../global.d';
export interface AxisProps {
    type: DIRECTION;
    cell: Cell;
    size: number;
    gridSize: number;
}
declare class Grid extends React.Component<AxisProps> {
    axis: BaseType;
    constructor(props: AxisProps);
    renderGrid(): any;
    render(): JSX.Element;
}
export default Grid;
