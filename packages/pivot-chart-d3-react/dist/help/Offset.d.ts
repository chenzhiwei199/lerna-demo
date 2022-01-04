export default class Offset {
    x: number;
    y: number;
    constructor(x: number, y: number);
    toTransform(): string;
    toOffset(): {
        offsetX: number;
        offsetY: number;
    };
    get(key: string): any;
}
