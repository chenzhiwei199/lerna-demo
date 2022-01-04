import * as React from 'react';
import { OffsetConfig } from '../../global.d';
export interface ScrollWrapperProps {
    scrollOffset: OffsetConfig;
    type: SCROLL_TYPE;
}
export interface ScrollWrapperState {
}
declare class ScrollWrapper extends React.Component<ScrollWrapperProps, ScrollWrapperState> {
    constructor(props: ScrollWrapperProps);
    getTransform(): any;
    render(): JSX.Element;
}
export default ScrollWrapper;
export declare enum SCROLL_TYPE {
    X = "x",
    Y = "y",
    ALL = "all"
}
