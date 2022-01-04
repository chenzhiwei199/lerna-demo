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
const matrix_1 = require("../../utils/matrix");
const d3 = __importStar(require("d3"));
const BaseGeom_1 = __importDefault(require("./BaseGeom"));
const global_d_1 = require("../../global.d");
class IntervalGeom extends BaseGeom_1.default {
    getPadding(x, y) {
        return [0, 0, 0, 0];
    }
    drawGraph(DataSource, sizeConfig) {
        // contaienr.selectAll('.point') .data(data).enter().append('circle')
        //   .attr('fill', '#cce5df')
        //   .attr('stroke', '#69b3a2')
        //   .attr('stroke-width', 1.5)
        //   .attr('cx', (d, index) => {
        //     return data[index].x;
        //   })
        //   .attr('cy', (d, index) => data[index].y)
        //   .attr('r', '4');
        return React.createElement("g", null);
    }
    transformData(data, tranpose, positionConfig, sizeConfig, containerSizeConfig) {
        let { x, y } = positionConfig;
        const { width, height } = sizeConfig;
        let xSize = width;
        let ySize = height;
        if (tranpose === global_d_1.AXIS_DIRECTION.LB) {
            // 交换x, y
            const temp = x;
            x = y;
            y = temp;
            xSize = height;
            ySize = width;
        }
        const xAxisScale = chartUtils_1.getScale(x, xSize);
        const yAxisScale = chartUtils_1.getScale(y, ySize);
        let bandSize = 0;
        if (chartUtils_1.checkIsCategory(x.type)) {
            bandSize = xAxisScale.bandwidth() / 2;
        }
        // 2. 定义图形绘制方式
        const drawX = x ? (d) => xAxisScale(d[x.code]) + bandSize : () => 0;
        // 图形绘制竖轴起点
        const drawY = y ? (d) => yAxisScale(d[y.code]) : () => 0;
        // 3. 绘制图形数据处理
        // 图形变化矩阵
        const matrixPosition = matrix_1.bl2lbMatrix();
        // 定义数据转化
        const newData = data.map((d) => {
            // x, y 位置信息值， width height当前值
            let positionX = drawX(d);
            let positionY = drawY(d);
            // 转置
            if (tranpose === global_d_1.AXIS_DIRECTION.LB) {
                // 图形绘制方式，通过矩阵进行重新定位
                const [currentX, currentY] = matrix_1.matrixMultiplication([[positionX, positionY, 1]], matrixPosition)[0];
                positionX = currentX;
                positionY = currentY;
            }
            return {
                x: positionX,
                y: ySize - positionY,
            };
        });
        return newData;
    }
    getMinSize(cell) {
        let maxLength = 0;
        let labelNums = 0;
        const cellValues = this.getCellValues(this.data, cell);
        if (chartUtils_1.checkIsCategory(cell.map(item => item.type))) {
            const cellLength = cellValues.length;
            cellValues.forEach((currentValue, index) => {
                if (index === cellLength - 1) {
                    labelNums = currentValue.length;
                }
                currentValue.forEach((item) => {
                    maxLength = d3.max([item[cell[index].code].length, maxLength]);
                });
            });
            const textSize = (maxLength * 7 * labelNums) / labelNums;
            return cellValues[0].length * textSize;
        }
        return this.minWidth;
    }
}
exports.default = IntervalGeom;
