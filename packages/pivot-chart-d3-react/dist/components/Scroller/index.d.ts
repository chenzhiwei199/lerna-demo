import * as React from 'react';
import Point from '../../help/Point';
import { SizeConfig, DIRECTION } from '../../global.d';
import { BaseType } from 'd3';
export interface ScrollerProps {
    sizeConfig: SizeConfig;
    realSizeConfig: SizeConfig;
    direction: DIRECTION;
    offset: number;
    updateScrollPosition?: (diretion: DIRECTION, offset: number) => void;
}
export interface ScrollerState {
}
declare class Scroller extends React.Component<ScrollerProps, ScrollerState> {
    static defaultProps: {
        direction: DIRECTION;
    };
    scrollGap: number;
    scrollSize: number;
    minSize: number;
    scrollBar: BaseType;
    dragBehaviour: any;
    constructor(props: ScrollerProps);
    bindEvents(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    getScrollConfig(): {
        scrollInfo: any;
        transform: string;
        scrollBarHeight: any;
        scrollBarWidth: any;
        scrollX: any;
        scrollY: any;
        scrollContainerWidth: any;
        scrollContainerHeight: any;
        scrollLinePointLeft: [Point, Point];
        scrollLinePointRight: [Point, Point];
        scrollInnerSize: number;
    };
    render(): JSX.Element;
}
export default Scroller;
