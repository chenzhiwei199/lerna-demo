"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __importStar(require("d3"));
const global_d_1 = require("../../global.d");
const matrix_1 = require("../../utils/matrix");
const chartUtils_1 = require("../../utils/chartUtils");
function getScaleByType(type, min = 0, max) {
    switch (type) {
        case global_d_1.ScaleType.LINEAR:
            return d3
                .scaleLinear()
                .range([min, max])
                .nice();
        case global_d_1.ScaleType.CATEGORY:
            return d3.scaleBand().range([min, max]);
        default:
            return d3.scaleBand().range([min, max]);
    }
}
exports.getScaleByType = getScaleByType;
function getScale(scaleType, range, max) {
    let scale;
    if (chartUtils_1.checkIsLinear(scaleType)) {
        // 双轴线性
        scale = getScaleByType(scaleType, 0, max);
        scale = scale.domain(range);
    }
    else if (chartUtils_1.checkIsCategory(scaleType)) {
        // x轴离散，y轴线性
        scale = getScaleByType(scaleType, 0, max);
        scale = scale.domain(range).padding(0.2);
    }
    return scale;
}
exports.getScale = getScale;
function getAxis(type, scaleType, range, size, isLabelRotate = false) {
    const scale = getScale(scaleType, range, size);
    let axis;
    // 坐标轴举证变换
    let transform;
    // 调度
    let angle;
    let firstTextAnchor;
    let firstVerticalAnchor;
    let textAnchor;
    let verticalAnchor;
    const { axis: b2lMatrix } = matrix_1.b2LAxisMatrix(size);
    if (chartUtils_1.checkIsLinear(scaleType)) {
        if (type === global_d_1.DIRECTION.VERTICAL) {
            // 线性 & 垂直 = 首个坐标轴标签样式优化，画到x轴线之上
            firstVerticalAnchor = 'end';
        }
        else {
            // 线性 & 水平 = 首个坐标轴标签样式优化，画到y轴线之右
            firstTextAnchor = 'start';
        }
    }
    // 离散，标签旋转
    if (isLabelRotate) {
        (textAnchor = 'start'), (verticalAnchor = 'middle'), (angle = 90);
    }
    // 根据方向不同，画不同的坐标轴
    if (type === global_d_1.DIRECTION.HORIZONTAL) {
        axis = d3.axisBottom(scale);
    }
    else {
        axis = d3.axisLeft(scale);
        transform = `matrix(${matrix_1.getTransformMatrix(b2lMatrix)})`;
    }
    return {
        // scale
        scale,
        // 标签
        axis,
        // 坐标轴变换
        transform,
        // 旋转角度
        angle,
        // 文本变化
        textAnchor,
        verticalAnchor,
        firstTextAnchor,
        firstVerticalAnchor,
    };
}
exports.getAxis = getAxis;
