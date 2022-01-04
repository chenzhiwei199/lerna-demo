import { ElementOptions } from './ElementOptions';
import { SizeInterface } from './SizeOptions';
export declare class DoubleElementOptions implements SizeInterface {
    x: ElementOptions;
    y: ElementOptions;
    constructor(x1: number, y1: number, x2: number, y2: number);
    getX(): any;
    getY(): any;
    getOptions(key: string): any;
    getSize(key: string): any;
    transform2Size(): {
        width: any;
        height: any;
    };
    getWidth(): any;
    getHeight(): any;
}
