import * as React from 'react';
import color from '../../utils/color';
import Point from '../../help/Point';
export interface LineProps {
  size?: number;
  points: [Point, Point];
}

export interface LineState {

}

class Line extends React.Component<LineProps, LineState> {
  constructor(props: LineProps) {
    super(props);
  }
  public render() {
    const { size = 2, points } = this.props;
    const [p1, p2]  = points;
    return (
      <line
        strokeWidth={size}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke={color.GRID}
      />

    );
  }
}

export default Line;
