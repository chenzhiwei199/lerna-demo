declare class Node<Measure> {
    children: Map<any, any>;
    key: string;
    childKey: string;
    level: number;
    rawData: any[];
    _aggData: any;
    constructor(key?: any, childKey?: any, level?: any);
    push(): void;
    aggData(aggFunc: any, measures?: Measure[]): any;
}
export declare class MomentCube<Dimension, Measures> {
    aggFunc: () => void;
    factTable: any;
    dimensions: Dimension[];
    measures: Measures[];
    tree: Node<Measures> | null;
    constructor(props: any);
    setData(props: any): void;
    buildTree(): Node<unknown>;
    insertNode(record: any, node: any, level: any): void;
    aggTree(node: any): any;
}
declare function count(subset: any, MEASURES: any): {};
export default function createCube<K, U>({ aggFunc, factTable, dimensions, measures, }: {
    aggFunc?: typeof count | undefined;
    factTable?: never[] | undefined;
    dimensions?: never[] | undefined;
    measures?: never[] | undefined;
}): MomentCube<K, U>;
export {};
