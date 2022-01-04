import * as React from 'react';
import BaseGeom from '../Geom/BaseGeom';
import { SizeConfig, DataSource, AXIS_DIRECTION, PositionConfig, VisibleConfig } from '../../global.d';
export interface GraphProps {
    data: DataSource;
    visibleSize: VisibleConfig;
    geomInstance: BaseGeom;
    positionConfig: PositionConfig;
    realSizeConfig: SizeConfig;
    containerSizeConfig: SizeConfig;
    transpose: AXIS_DIRECTION;
}
export interface GraphState {
}
declare class Graph extends React.Component<GraphProps, GraphState> {
    constructor(props: GraphProps);
    render(): JSX.Element;
}
export default Graph;
