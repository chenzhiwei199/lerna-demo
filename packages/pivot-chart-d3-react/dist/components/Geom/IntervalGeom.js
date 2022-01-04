"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const chartUtils_1 = require("../../utils/chartUtils");
const d3 = __importStar(require("d3"));
const BaseGeom_1 = __importDefault(require("./BaseGeom"));
const matrix_1 = require("../../utils/matrix");
const global_d_1 = require("../../global.d");
const utils_1 = require("../../utils");
class IntervalGeom extends BaseGeom_1.default {
    constructor() {
        super(...arguments);
        this.intervalGap = 4;
        this.bandSize = 30;
    }
    getPadding(x, y) {
        let paddingRight = this.bandSize / 2;
        let paddingLeft = this.bandSize / 2;
        let paddingTop = this.bandSize / 2;
        let paddingBottom = this.bandSize / 2;
        if (chartUtils_1.checkIsLinear(x.map(item => item.type)) && chartUtils_1.checkIsLinear(y.map(item => item.type))) {
            paddingTop = 0;
            paddingBottom = 0;
        }
        else {
            paddingRight = 0;
            paddingLeft = 0;
            paddingTop = 0;
            paddingBottom = 0;
        }
        // else if (checkIsLinear(x.type)) {
        //   paddingTop = 0;
        //   paddingBottom = 0;
        // } else if (checkIsLinear(y.type)) {
        //   paddingLeft = 0;
        //   paddingRight = 0;
        // }
        return [paddingTop, paddingRight, paddingBottom, paddingLeft];
    }
    drawGraph(data, sizeConfig) {
        const { height } = sizeConfig;
        const bars = data.map((item, index) => {
            return React.createElement("rect", { fill: 'steelblue', key: index, x: item.x, y: height - item.y - item.h, width: item.w, height: item.h });
        });
        return (React.createElement("g", null, bars));
        // contaienr.selectAll('.interval').data(data).enter().append('rect')
        //   .attr('class', `bar1`)
        //   .attr('x', (d, index) => data[index].x)
        //   .attr('y', (d, index) => {
        //     // 默认将坐标轴原点作为绘制起点，这里需要抹平
        //     return height - data[index].y - data[index].h;
        //   })
        //   .attr('width', (d, index) => data[index].w )
        //   .attr('height', (d, index) => data[index].h);
    }
    transformData(data, transpose, positionConfig, sizeConfig, containerSizeConfig, visibleSize) {
        const { width, height } = sizeConfig;
        const { width: containerWidth, height: containerHeight } = containerSizeConfig;
        let { x, y } = positionConfig;
        // getCellConfig(visibleSize.x.first, width, )
        let xSize = width;
        let ySize = height;
        // 当前是转置，所以讲x, y轴对调，变为垂直情况
        if (transpose === global_d_1.AXIS_DIRECTION.LB) {
            // 交换x, y
            const temp = x;
            x = y;
            y = temp;
            xSize = height;
            ySize = width;
        }
        const xAxisScale = chartUtils_1.getScale(x, xSize);
        const yAxisScale = chartUtils_1.getScale(y, ySize);
        let barOffsetX = 0;
        if (chartUtils_1.checkIsLinear(x.type)) {
            barOffsetX = this.bandSize / 2;
        }
        // 2. 定义图形绘制方式
        // 图形绘制横轴起点
        const drawX = x ? (d) => xAxisScale(d[x.code]) - barOffsetX : () => 0;
        // 图形绘制竖轴起点
        const drawY = (d) => 0;
        // 图形宽度
        const bandWidth = chartUtils_1.checkIsCategory(x.type) ? xAxisScale.bandwidth() : this.bandSize;
        const drawWidth = (d) => bandWidth;
        // 图形高度
        // const bandHeight = checkIsCategory(y) ? xAxisScale.bandwidth() : this.bandSize;
        const drawHeight = y ? (d) => yAxisScale(d[y.code]) : (d) => 2;
        // 3. 绘制图形数据处理
        // 图形变化矩阵
        const matrixPosition = matrix_1.bl2lbMatrix();
        let cellConfig;
        // 仅过滤当前可见图形
        if (transpose === global_d_1.AXIS_DIRECTION.LB && chartUtils_1.checkIsCategory(y.type)) {
            const cellSize = height / data.length;
            cellConfig = utils_1.getCellConfig(visibleSize.y.startOffset, visibleSize.y.endOffset, height, containerHeight, cellSize);
        }
        else if (transpose === global_d_1.AXIS_DIRECTION.BL && chartUtils_1.checkIsCategory(x.type)) {
            const cellSize = width / data.length;
            cellConfig = utils_1.getCellConfig(visibleSize.x.startOffset, visibleSize.x.startOffset, width, containerWidth, cellSize);
        }
        if (cellConfig) {
            data = data.slice(cellConfig.startIndex, cellConfig.endIndex);
        }
        // 定义数据转化
        const newData = data.map((d) => {
            // x, y 位置信息值， width height当前值
            let positionX = drawX(d);
            let positionY = drawY(d);
            let newWidth = drawWidth(d);
            let newHeight = drawHeight(d);
            // 转置
            if (transpose === global_d_1.AXIS_DIRECTION.LB) {
                // 图形绘制方式，通过矩阵进行重新定位
                const [currentX, currentY] = matrix_1.matrixMultiplication([[positionX, positionY, 1]], matrixPosition)[0];
                positionX = currentX;
                positionY = currentY;
                // 交换宽度和高度
                const temp = newWidth;
                newWidth = newHeight;
                newHeight = temp;
            }
            return {
                x: positionX,
                y: positionY,
                w: newWidth,
                h: newHeight,
            };
        });
        return newData;
    }
    getCellValues(data, cells) {
        const currentValues = cells && cells[0] ? chartUtils_1.getCategoryValues(data, [cells[0].code]) : [];
        return currentValues;
    }
    beforeRender(x, y) {
        if (chartUtils_1.checkIsCategory(x.map(item => item.type))) {
            const cellValues = this.getCellValues(this.data, x);
            let maxLength = 0;
            cellValues.forEach((currentValue, index) => {
                currentValue.forEach((item) => {
                    maxLength = d3.max([item[x[index].code].length, maxLength]);
                });
            });
            const textSize = (maxLength * 6 * maxLength + this.bandSize) / maxLength;
            //  修改bandSize
            this.bandSize = this.bandSize > textSize ? this.bandSize : textSize;
        }
    }
    getMinSize(cell) {
        const cellValues = this.getCellValues(this.data, cell);
        const bandSize = this.bandSize;
        if (chartUtils_1.checkIsCategory(cell.map(item => item.type))) {
            return cellValues[0].length * bandSize + bandSize;
        }
        return this.minWidth;
    }
}
exports.default = IntervalGeom;
