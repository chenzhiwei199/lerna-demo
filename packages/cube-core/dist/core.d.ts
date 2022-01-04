import { MomentCube } from './cube-core';
export declare function encode(names: any): string;
export declare function decode(key: any): any;
interface Column {
    label: string;
    value: string;
}
export default class Cube {
    cube: MomentCube<Column, Column>[];
    dataSource: any;
    dimensions: Column[];
    rowDimensions: Column[];
    colDimensions: Column[];
    indicators: Column[];
    needSumTree: boolean;
    exprIndicators: Column[];
    constructor(dataSource: any, rowDimensions: any, colDimensions: any, indicators: any, exprIndicators: any, needSumTree?: boolean);
    getDimension(): Column[];
    init(): void;
    get(): void;
    updateData(): void;
    update({ dataSource, rowDimensions, colDimensions, indicators, exprIndicators, }: {
        dataSource: any;
        rowDimensions: any;
        colDimensions: any;
        indicators: any;
        exprIndicators?: never[] | undefined;
    }): void;
    decorateExprIndicators(cube: any, exprIndicators: any): void;
    getTableData(exprIndicator: any): any;
    getDataByPath(path: any, key: any): any;
    set(): void;
}
export {};
