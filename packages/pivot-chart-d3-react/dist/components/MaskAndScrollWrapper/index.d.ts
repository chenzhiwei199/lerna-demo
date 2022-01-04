import * as React from 'react';
import { SCROLL_TYPE } from '../ScrollWrapper';
import { SizeConfig, OffsetConfig } from '../../global.d';
export interface MaskAndScrollWrapperProps {
    id: string;
    transform: string;
    maskSizeConfig: SizeConfig;
    scrollType: SCROLL_TYPE;
    scrollOffsetConfig: OffsetConfig;
}
declare class MaskAndScrollWrapper extends React.Component<MaskAndScrollWrapperProps> {
    static defaultProps: {
        scrollOffsetConfig: {
            offsetX: number;
            offsetY: number;
        };
    };
    constructor(props: MaskAndScrollWrapperProps);
    render(): JSX.Element;
}
export default MaskAndScrollWrapper;
