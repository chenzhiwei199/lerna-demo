"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = __importDefault(require("../utils/color"));
const global_d_1 = require("../global.d");
const chartUtils_1 = require("../utils/chartUtils");
function drawAxis(container, size, type, cell, isJustMeasure = false, isLabelRoatae = false) {
    // 坐标轴容器
    const axisContainer = container.append('g').attr('class', `${type} axis`);
    const { scale, axis, transform, angle } = chartUtils_1.getAxis(type, cell, size, isLabelRoatae);
    // 标签展示优化
    axis.ticks([4]);
    // 为啥会空
    if (axis && scale) {
        axisContainer.attr('transform', transform).call(axis);
    }
    // 坐标轴文本颜色
    axisContainer.selectAll('line').attr('style', `stroke: ${color_1.default.GRID}`);
    axisContainer.selectAll('path').attr('style', `stroke: ${color_1.default.GRID}`);
    axisContainer.selectAll('text').attr('fill', color_1.default.AXIS_LABEL);
    // 是否需要文本旋转
    if (angle) {
        axisContainer.selectAll('text').attr('transform', `rotate(${angle})`);
    }
    // 展示优化，y轴文字展示在坐标轴之上
    if (chartUtils_1.checkIsLinear(cell.type)) {
        // 坐标轴标签可能超出视图，y周通过文字的位置优化，x轴通过调整位置来优化,这里进行视图优化.
        if (type === global_d_1.DIRECTION.VERTICAL) {
            axisContainer
                .selectAll('text')
                .attr('style', 'dominant-baseline: ideographic');
        }
        else {
            axisContainer.select('text').attr('style', 'text-anchor: start');
        }
    }
    let axisSize = 0;
    const { width, height } = axisContainer._groups[0][0].getBBox();
    let maxLabelWidth = 0;
    axisContainer.selectAll('text')._groups[0].forEach(element => {
        const w = element.getBBox().width;
        maxLabelWidth = w > maxLabelWidth ? w : maxLabelWidth;
    });
    if (type === global_d_1.DIRECTION.HORIZONTAL) {
        axisSize = height;
    }
    else {
        axisSize = width;
    }
    if (isJustMeasure) {
        axisContainer.remove();
    }
    return axisSize;
}
exports.drawAxis = drawAxis;
