import * as React from 'react';
import Point from '../../help/Point';
export interface LineProps {
    size?: number;
    points: [Point, Point];
}
export interface LineState {
}
declare class Line extends React.Component<LineProps, LineState> {
    constructor(props: LineProps);
    render(): JSX.Element;
}
export default Line;
