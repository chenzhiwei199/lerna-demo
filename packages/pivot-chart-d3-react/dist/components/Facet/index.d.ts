import * as React from 'react';
import { OffsetConfig, Cell, VisibleConfig, VisibleCell } from '../../global.d';
export interface Field {
    data?: any[];
    size?: number;
    containerSize?: number;
    gapStart?: number;
}
export interface FacetProps {
    xField?: Field;
    yField?: Field;
    isTransform?: boolean;
    scrollOffsetConfig: OffsetConfig;
    renderFacetCell: (visibleSize: VisibleConfig | VisibleCell, cell1: Cell, cell2?: Cell) => JSX.Element;
}
declare class Facet extends React.Component<FacetProps> {
    constructor(props: FacetProps);
    getStartAndEnd(scrollStartOffst: number, cellSize: number, containerSize: number): {
        startIndex: number;
        endIndex: number;
        startOffset: number;
        endOffset: number;
    };
    getRenderType(): FACET_TYPE | undefined;
    renderFacet(): JSX.Element;
    render(): JSX.Element;
}
export default Facet;
export declare enum FACET_TYPE {
    X = "x",
    Y = "y",
    ALL = "all"
}
