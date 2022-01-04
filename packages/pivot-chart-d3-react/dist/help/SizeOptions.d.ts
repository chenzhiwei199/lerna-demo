import * as d3 from 'd3';
import { DoubleElementOptions } from './DoubleElementOptions';
import { ElementOptions } from './ElementOptions';
import { Cell, AxisConfig, DimensionConfig, SizeConfig, PositionsConfig, Config, DIRECTION, SVGContainer } from '../global.d';
export default class Size {
    config: Config;
    sizeMap: Map<ELEMENT_TYPE, DoubleElementOptions | ElementOptions>;
    scrollSize: number;
    scrollGap: number;
    labelSize: number;
    constructor(config: Config);
    measureScrollSize(axisConfig: AxisConfig): {
        scrollWidth: number;
        scrollHeight: number;
    };
    getScrollerSize(axisConfig: AxisConfig): DoubleElementOptions;
    getFacetLabelSize(dimensionsConfig: DimensionConfig): DoubleElementOptions;
    getMeasureContiner(): d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    measureAxisSize(container: SVGContainer, width: number, type: DIRECTION, cells: Cell[], isLabelRotate?: boolean): number;
    getAxisSize(sizeConfig: SizeConfig, positionConfig: PositionsConfig, graphDataConfig: PositionsConfig): DoubleElementOptions;
    sumSize(sizes: SizeInterface[], key: string): number;
    getGraphSize(sizeConfig: SizeConfig): ElementOptions;
    getMeasureNameContainerSize(positionConfig: PositionsConfig): DoubleElementOptions;
    initSizeOptions(): void;
    get(): Map<ELEMENT_TYPE, ElementOptions | DoubleElementOptions>;
}
export declare enum ELEMENT_TYPE {
    AXIS = "AXIS",
    GRID = "GRID",
    FACET_LABEL = "FACET_LABEL",
    MEASURE_LABEL = "MEASURE_LABEL",
    SCROLLER = "SCROLLER",
    GEOM = "GEOM"
}
export interface SizeInterface {
    getSize(key: string): any;
    getWidth(): any;
    transform2Size(): any;
    getHeight(): any;
}
