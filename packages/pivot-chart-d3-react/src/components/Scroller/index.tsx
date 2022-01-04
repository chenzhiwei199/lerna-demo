import * as React from 'react';
import * as d3 from 'd3';
import color from '../../utils/color';
import { getScollInfo } from '../../utils/chartUtils';
import Point from '../../help/Point';
import { SizeConfig, GridConfig, DIRECTION } from '../../global.d';
import Line from '../Line';
import { BaseType } from 'd3';

export interface ScrollerProps {
  sizeConfig: SizeConfig;
  realSizeConfig: SizeConfig;
  direction: DIRECTION;
  offset: number;
  updateScrollPosition?: (diretion: DIRECTION, offset: number) => void;
}

export interface ScrollerState {}

class Scroller extends React.Component<ScrollerProps, ScrollerState> {
  public static defaultProps = {
    direction: DIRECTION.HORIZONTAL,
  };
  public scrollGap: number = 3;
  public scrollSize: number = 15;
  public minSize: number = 18;
  public scrollBar: BaseType;
  public dragBehaviour;
  constructor(props: ScrollerProps) {
    super(props);
    this.scrollBar = null;
  }

  public bindEvents() {
    const { direction, updateScrollPosition } = this.props;
    const { scrollInfo } = this.getScrollConfig();
    const { viewMaxScroll, maxScroll } = scrollInfo;
    // 拖拽事件
    this.dragBehaviour = d3.drag().on('drag', () => {
      const ds = direction === DIRECTION.HORIZONTAL ? d3.event.dx : d3.event.dy;
      if (updateScrollPosition) {
        updateScrollPosition(direction, (ds / maxScroll) * viewMaxScroll);
      }
    });
    d3.select(this.scrollBar).call(this.dragBehaviour);
  }

  public componentDidMount() {
    this.bindEvents();
  }
  public componentDidUpdate() {
    this.bindEvents();
  }

  public getScrollConfig() {
    const { offset, direction, sizeConfig, realSizeConfig } = this.props;
    const size = this.scrollSize;
    let scrollInfo;
    let scrollBarHeight;
    let scrollBarWidth;
    let scrollX;
    let scrollY;
    let scrollContainerWidth;
    let scrollContainerHeight;
    let scrollLinePointLeft: [Point, Point];
    let scrollLinePointRight: [Point, Point];
    const scrollInnerSize = size - 2 * this.scrollGap;
    let transform = '';
    if (direction === DIRECTION.HORIZONTAL) {
      scrollInfo = getScollInfo(sizeConfig.width, realSizeConfig.width);
      scrollBarHeight = scrollInnerSize;
      scrollBarWidth = scrollInfo.scrollBarSize;
      scrollX = 0;
      scrollY = this.scrollGap;
      scrollContainerWidth = sizeConfig.width;
      scrollContainerHeight = size;
      transform = `translate(${offset}, ${0})`;
      scrollLinePointLeft = [new Point(0, 0), new Point(sizeConfig.width, 0)];
      scrollLinePointRight = [
        new Point(0, size),
        new Point(sizeConfig.width, size),
      ];
    } else {
      scrollInfo = getScollInfo(sizeConfig.height, realSizeConfig.height);
      scrollBarHeight = scrollInfo.scrollBarSize;
      scrollBarWidth = scrollInnerSize;
      scrollX = this.scrollGap;
      scrollY = 0;
      transform = `translate(${0}, ${offset})`;
      scrollContainerWidth = size;
      scrollContainerHeight = sizeConfig.height;
      scrollLinePointLeft = [new Point(0, 0), new Point(0, sizeConfig.height)];
      scrollLinePointRight = [
        new Point(size, 0),
        new Point(size, sizeConfig.height),
      ];
    }
    return {
      scrollInfo,
      transform,
      scrollBarHeight,
      scrollBarWidth,
      scrollX,
      scrollY,
      scrollContainerWidth,
      scrollContainerHeight,
      scrollLinePointLeft,
      scrollLinePointRight,
      scrollInnerSize,
    };
  }
  public render() {
    const {
      transform,
      scrollBarHeight,
      scrollBarWidth,
      scrollX,
      scrollY,
      scrollContainerWidth,
      scrollContainerHeight,
      scrollLinePointLeft,
      scrollLinePointRight,
      scrollInnerSize,
    } = this.getScrollConfig();
    return (
      <g>
        <rect
          width={scrollContainerWidth}
          height={scrollContainerHeight}
          fill={color.SCROLL_CONTAINER}
        />
        <Line points={scrollLinePointLeft} />
        <Line points={scrollLinePointRight} />
        <rect
          ref={scrollBar => {
            this.scrollBar = scrollBar;
          }}
          fill={color.SCROLL_BAR}
          height={scrollBarHeight}
          width={scrollBarWidth}
          transform={transform}
          rx={scrollInnerSize / 2}
          ry={scrollInnerSize / 2}
          x={scrollX}
          y={scrollY}
        />
      </g>
    );
  }
}

export default Scroller;
