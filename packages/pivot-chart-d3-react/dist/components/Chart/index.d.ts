import * as React from 'react';
import { OffsetConfig, SizeConfig, AxisConfig, Cell, PositionsConfig, DataSource, DimensionConfig, DimensionValueConfig } from '../../global.d';
import SizeOptions from '../../help/SizeOptions';
import IntervalGeom from '../Geom/IntervalGeom';
import LineGeom from '../Geom/LineGeom';
import BaseGeom, { Padding } from '../Geom/BaseGeom';
export declare type FacetData = Array<{
    size: number;
    data: Array<{
        label: string;
    }>;
}>;
export interface ChartConfig {
    data: any[];
    padding: Padding;
    graphMaskId?: string;
    geomInstance: BaseGeom;
    sizeOptions: SizeOptions;
    positionsConfig: PositionsConfig;
    /**
     * 树的深度
     *
     * @type {number}
     */
    offsetConfig: OffsetConfig;
    realSizeConfig: SizeConfig;
    sizeConfig: SizeConfig;
    cellSizeConfig: SizeConfig;
    facetDataConfig: {
        x: FacetData;
        y: FacetData;
    };
    axisDataConfig: PositionsConfig;
    graphDataConfig: PositionsConfig;
    axisConfig: AxisConfig;
    dimensionValuesConfig: DimensionValueConfig;
    dimensionConfig: DimensionConfig;
    scrollOffsetConfig: OffsetConfig;
}
export interface ChartProps {
    data: any[];
    width: number;
    height: number;
    geom: 'interval' | 'scatter' | 'line' | 'pie' | 'point';
    rows: Cell[];
    cols: Cell[];
}
export interface ChartState {
}
declare class Chart extends React.Component<ChartProps, ChartState> {
    constructor(props: ChartProps);
    createTreeKeys(categorys: Cell[], categoryValues: string[][]): string[][];
    createTreeData(data: DataSource, keys: string[], categoryValues: string[][]): {};
    /**
     * createGroupData
     */
    createGroupData(treeData: string[][], cells: Cell[]): any;
    creatSize(config: ChartConfig): void;
    createConfig(): {
        data: any[];
        geomInstance: IntervalGeom | LineGeom;
        sizeOptions: SizeOptions;
        offsetConfig: {
            offsetX: number;
            offsetY: number;
        };
        axisConfig: {
            isXShowScroll: boolean;
            isYShowScroll: boolean;
        };
        dimensionValuesConfig: {
            x: any;
            y: any;
        };
        dimensionConfig: {
            x: Cell[];
            y: Cell[];
        };
        positionsConfig: {
            x: Cell[];
            y: Cell[];
        };
        axisDataConfig: {
            x: (Cell & {
                label: string;
            })[];
            y: (Cell & {
                label: string;
            })[];
        };
        graphDataConfig: {
            x: any;
            y: any;
        };
        facetDataConfig: {
            x: {
                data: import("../../utils/chartUtils").AxisRowData[];
                size: number;
            }[];
            y: {
                data: import("../../utils/chartUtils").AxisRowData[];
                size: number;
            }[];
        };
        realSizeConfig: {
            width: number;
            height: number;
        };
        cellSizeConfig: {
            width: number;
            height: number;
        };
        sizeConfig: {
            width: number;
            height: number;
        };
    };
    getAxisData(): void;
    getGeom(type: any): typeof IntervalGeom | typeof LineGeom;
    getGeomInstance(): IntervalGeom | LineGeom;
    produceSizeConfig(data: DataSource, geomInstance: BaseGeom, cells: Cell[], categorys: Cell[], size: number): {
        isShowScroll: boolean;
        size: number;
    };
    render(): JSX.Element;
}
export default Chart;
