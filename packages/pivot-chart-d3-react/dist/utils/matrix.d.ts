export declare type MatrixType = [number, number, number];
export declare function matrixMultiplication(a: MatrixType[], b: MatrixType[]): MatrixType[];
export declare function getTransformMatrix(matrix: MatrixType[]): string;
export declare function matrixMultiplications(matrix: MatrixType[][]): MatrixType[];
export declare function reverseMatrix(sourceArr: MatrixType[]): MatrixType[];
export declare function bl2lbMatrix(): MatrixType[];
/**
 * bottom axis transoform to left
 *
 * @export
 * @param {number} scale
 * @param {number} height
 * @returns
 */
export declare function b2LAxisMatrix(height: number): {
    axis: MatrixType[];
    label: MatrixType[];
};
export declare function l2BAxisMatrix(scale: number, height: number): {
    axis: MatrixType[];
    label: MatrixType[];
};
export declare function bl2lbSizeMatrix(scale: number): MatrixType[];
export declare const noChangeMatrix: number[][];
export declare const originMatrix: number[][];
export declare function leftTranslateMatrix(bandWidth: number, x: number): number[][];
export declare function bottomTranslateMatrix(height: number): number[][];
export declare function yAxisReflection(): number[][];
export declare function xAxisReflection(): number[][];
export declare function rightTranslateMatrix(bandWidth: number, x: number): number[][];
export declare function originReflectionMatrix(angle?: number): number[][];
export declare function getNoneMatrix(): number[][];
export declare function scaleMatrix(scale: number): number[][];
