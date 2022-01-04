import { SizeInterface } from './SizeOptions';
export declare class ElementOptions implements SizeInterface {
    width: number;
    height: number;
    constructor(width?: number, height?: number);
    getHeight(): any;
    getWidth(): any;
    getSize(key: string): any;
    transform2Size(): {
        width: any;
        height: any;
    };
}
