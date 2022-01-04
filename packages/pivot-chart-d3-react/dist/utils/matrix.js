"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function matrixMultiplication(a, b) {
    return a.map((row) => {
        return row.map((_, i) => {
            return row.reduce((sum, cell, j) => {
                return sum + cell * b[j][i];
            }, 0);
        });
    });
}
exports.matrixMultiplication = matrixMultiplication;
function getTransformMatrix(matrix) {
    if (!matrix || matrix.length < 1) {
        return '';
    }
    const m = reverseMatrix(matrix);
    return `${m[0][0]},${m[1][0]},${m[0][1]},${m[1][1]},${m[0][2]},${m[1][2]}`;
}
exports.getTransformMatrix = getTransformMatrix;
function matrixMultiplications(matrix) {
    return matrix.slice(1).reduce((preMatrix, curMatrix) => {
        return matrixMultiplication(preMatrix, curMatrix);
    }, matrix[0]);
}
exports.matrixMultiplications = matrixMultiplications;
// 矩阵转置
function reverseMatrix(sourceArr) {
    if (!sourceArr || sourceArr.length === 0) {
        return sourceArr;
    }
    const reversedArr = [];
    for (let n = 0; n < sourceArr[0].length; n++) {
        reversedArr[n] = [0, 0, 0];
        for (let j = 0; j < sourceArr.length; j++) {
            reversedArr[n][j] = sourceArr[j][n];
        }
    }
    return reversedArr;
}
exports.reverseMatrix = reverseMatrix;
function bl2lbMatrix() {
    const composeMatrix = [
        // leftTranslateMatrix(bandWidth, x),
        // yAxisReflection(),
        // rightTranslateMatrix(bandWidth, x),
        originReflectionMatrix(),
    ];
    return matrixMultiplications(composeMatrix);
}
exports.bl2lbMatrix = bl2lbMatrix;
/**
 * bottom axis transoform to left
 *
 * @export
 * @param {number} scale
 * @param {number} height
 * @returns
 */
function b2LAxisMatrix(height) {
    const composeMatrix = [
        originReflectionMatrix(180),
        yAxisReflection(),
        bottomTranslateMatrix(height),
    ];
    const composeLabelMatrix = [xAxisReflection()];
    return {
        axis: matrixMultiplications(composeMatrix),
        label: matrixMultiplications(composeLabelMatrix),
    };
}
exports.b2LAxisMatrix = b2LAxisMatrix;
function l2BAxisMatrix(scale, height) {
    const composeMatrix = [
        originReflectionMatrix(180),
        yAxisReflection(),
        bottomTranslateMatrix(height),
    ];
    const composeLabelMatrix = [xAxisReflection()];
    return {
        axis: matrixMultiplications(composeMatrix),
        label: matrixMultiplications(composeLabelMatrix),
    };
}
exports.l2BAxisMatrix = l2BAxisMatrix;
function bl2lbSizeMatrix(scale) {
    const composeMatrix = [
        originReflectionMatrix(),
        scaleMatrix(scale),
    ];
    return matrixMultiplications(composeMatrix);
}
exports.bl2lbSizeMatrix = bl2lbSizeMatrix;
exports.noChangeMatrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
];
exports.originMatrix = [
    [-1, 0],
    [0, -1],
];
function leftTranslateMatrix(bandWidth, x) {
    return [
        [1, 0, 0],
        [0, 1, 0],
        [-(x + bandWidth / 2), 0, 1],
    ];
}
exports.leftTranslateMatrix = leftTranslateMatrix;
function bottomTranslateMatrix(height) {
    return [
        [1, 0, 0],
        [0, 1, 0],
        [0, height, 1],
    ];
}
exports.bottomTranslateMatrix = bottomTranslateMatrix;
function yAxisReflection() {
    return [
        [-1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ];
}
exports.yAxisReflection = yAxisReflection;
function xAxisReflection() {
    return [
        [1, 0, 0],
        [0, -1, 0],
        [0, 0, 1],
    ];
}
exports.xAxisReflection = xAxisReflection;
function rightTranslateMatrix(bandWidth, x) {
    return [
        [1, 0, 0],
        [0, 1, 0],
        [x + bandWidth / 2, 0, 1],
    ];
}
exports.rightTranslateMatrix = rightTranslateMatrix;
function originReflectionMatrix(angle = 90) {
    // 角度转化
    angle = (angle * Math.PI) / 180.0;
    return [
        [Math.cos(angle), Math.sin(angle), 0],
        [-Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1],
    ];
}
exports.originReflectionMatrix = originReflectionMatrix;
function getNoneMatrix() {
    return [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ];
}
exports.getNoneMatrix = getNoneMatrix;
function scaleMatrix(scale) {
    return [
        [scale, 0, 0],
        [0, scale, 0],
        [0, 0, 1],
    ];
}
exports.scaleMatrix = scaleMatrix;
