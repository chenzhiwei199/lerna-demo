import BaseGeomProps, {
  DataSource,
  DIRECTION,
  PositionConfig,
  SizeConfig,
} from './BaseGeom2';
import {
  getCategoryValues,
  checkIsCategory,
  getScale,
  checkIsLinear,
} from '../utils/chart';
import { matrixMultiplication, bl2lbMatrix } from '../utils/matrix';
import * as d3 from 'd3';
import SizeOptions, { Cell, Container, GContainer } from './BaseGeom';

export default class IntervalGeom extends BaseGeomProps {
  intervalGap: number = 4;
  bandSize: number = 30;

  getPadding() {
    const paddingRight = this.bandSize / 2;
    const paddingLeft = this.bandSize / 2;
    const paddingTop = this.bandSize / 2;
    const paddingBottom = this.bandSize / 2;
    return [paddingTop, paddingRight, paddingBottom, paddingLeft];
  }

  drawGraph(contaienr: GContainer, data: any[], sizeConfig: SizeConfig) {
    const { height } = sizeConfig;
    contaienr
      .selectAll('.interval')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', `bar1`)
      .attr('x', (d, index) => {
        return data[index].x;
      })
      .attr('y', (d, index) => {
        // 默认将坐标轴原点作为绘制起点，这里需要抹平
        return height - data[index].y - data[index].h;
      })
      .attr('width', (d, index) => {
        return data[index].w;
      })
      .attr('height', (d, index) => {
        return data[index].h;
      });
  }

  transformData(
    data: DataSource,
    tranpose: DIRECTION,
    positionConfig: PositionConfig,
    sizeConfig: SizeConfig
  ) {
    const { width, height } = sizeConfig;
    let { x, y } = positionConfig;

    let xSize = width;
    let ySize = height;
    // 转置
    if (tranpose === DIRECTION.LB) {
      // 交换x, y
      let temp = x;
      x = y;
      y = temp;

      xSize = height;
      ySize = width;
    }

    let xAxisScale = getScale(x, xSize);
    let yAxisScale = getScale(y, ySize);
    let barOffsetX = 0;
    if (checkIsLinear(x)) {
      barOffsetX = this.bandSize / 2;
    }
    // 2. 定义图形绘制方式
    // 图形绘制横轴起点
    // x轴坐标 - 柱状图宽度 + (是否是线性？减去bandSize / 2 ： 不需要减去)柱状图间距
    // let drawX = x ? (d) => { return xAxisScale(d[x.code])  + this.intervalGap; } : () => 0;
    let drawX = x
      ? d => {
          return xAxisScale(d[x.code]) - barOffsetX;
        }
      : () => 0;
    // 图形绘制竖轴起点
    let drawY = d => 0;
    // 图形宽度
    const bandWidth = checkIsCategory(x)
      ? xAxisScale.bandwidth()
      : this.bandSize;
    let drawWidth = d => {
      return bandWidth;
    };
    // 图形高度
    // const bandHeight = checkIsCategory(y) ? xAxisScale.bandwidth() : this.bandSize;
    let drawHeight = y
      ? d => {
          return yAxisScale(d[y.code]);
        }
      : d => 2;

    // 3. 绘制图形数据处理
    // 图形变化矩阵
    const matrixPosition = bl2lbMatrix();
    // 定义数据转化
    const newData = data.map(d => {
      // x, y 位置信息值， width height当前值
      let positionX = drawX(d);
      let positionY = drawY(d);
      let newWidth = drawWidth(d);
      let newHeight = drawHeight(d);

      // 转置
      if (tranpose === DIRECTION.LB) {
        // 图形绘制方式，通过矩阵进行重新定位
        const [currentX, currentY] = matrixMultiplication(
          [[positionX, positionY, 1]],
          matrixPosition
        )[0];
        positionX = currentX;
        positionY = currentY;
        // 交换宽度和高度
        let temp = newWidth;
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
    console.log('drawGraph', newData);
    return newData;
  }

  getCellValues(data: DataSource, cells: Cell[]) {
    const currentValues =
      cells && cells[0] ? getCategoryValues(data, [cells[0].code]) : [];
    return currentValues;
  }

  beforeRender(x: Cell[], y: Cell[]) {
    if (checkIsCategory(x)) {
      const cellValues = this.getCellValues(this.data, x);
      let maxLength = 0;
      cellValues.forEach((currentValue, index) => {
        currentValue.forEach(item => {
          maxLength = d3.max([item[x[index].code].length, maxLength]);
        });
      });
      const textSize = (maxLength * 6 * maxLength + this.bandSize) / maxLength;
      //  修改bandSize
      this.bandSize = this.bandSize > textSize ? this.bandSize : textSize;
    }
  }

  getMinSize(cell: Cell[]) {
    const cellValues = this.getCellValues(this.data, cell);
    let bandSize = this.bandSize;
    if (checkIsCategory(cell)) {
      return cellValues[0].length * bandSize + bandSize;
    }
    return this.minWidth;
  }
}
