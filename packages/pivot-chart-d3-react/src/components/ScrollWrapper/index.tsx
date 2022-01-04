import * as React from 'react';
import { OffsetConfig } from '../../global.d';
import Offset from '../../help/Offset';
export interface ScrollWrapperProps {
  scrollOffset: OffsetConfig;
  type: SCROLL_TYPE;
}

export interface ScrollWrapperState {}

class ScrollWrapper extends React.Component<
  ScrollWrapperProps,
  ScrollWrapperState
> {
  constructor(props: ScrollWrapperProps) {
    super(props);
  }

  public getTransform() {
    const { scrollOffset, type } = this.props;
    let transform;
    switch (type) {
      case SCROLL_TYPE.ALL:
        transform = new Offset(-scrollOffset.offsetX, -scrollOffset.offsetY);
        break;
      case SCROLL_TYPE.X:
        transform = new Offset(-scrollOffset.offsetX, 0);
        break;
      case SCROLL_TYPE.Y:
        transform = new Offset(0, -scrollOffset.offsetY);
        break;
      default:
        transform = new Offset(-scrollOffset.offsetX, -scrollOffset.offsetY);
        break;
    }
    return transform.toTransform();
  }
  public render() {
    return (
      <g className="scroll_wrapper" transform={this.getTransform()}>
        {this.props.children}
      </g>
    );
  }
}

export default ScrollWrapper;

export enum SCROLL_TYPE {
  X = 'x',
  Y = 'y',
  ALL = 'all',
}
