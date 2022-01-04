import * as React from 'react';
import { checkIsCategory, getScale, checkIsLinear } from '../../utils/chartUtils';
import { matrixMultiplication, bl2lbMatrix } from '../../utils/matrix';
import * as d3 from 'd3';
import BaseGeom from './BaseGeom';
import { SizeConfig, DataSource, AXIS_DIRECTION, PositionConfig, GContainer, Cell } from '../../global.d';

export default class IntervalGeom extends BaseGeom {
  public getPadding(x: Cell[], y: Cell[]) {
    return [0, 0, 0, 0 ];
  }

  public drawGraph(DataSource, sizeConfig: SizeConfig) {
      // contaienr.selectAll('.point') .data(data).enter().append('circle')
      //   .attr('fill', '#cce5df')
      //   .attr('stroke', '#69b3a2')
      //   .attr('stroke-width', 1.5)
      //   .attr('cx', (d, index) => {
      //     return data[index].x;
      //   })
      //   .attr('cy', (d, index) => data[index].y)
      //   .attr('r', '4');
      return <g />;
  }

  public transformData(data: DataSource, tranpose: AXIS_DIRECTION, positionConfig: PositionConfig, sizeConfig: SizeConfig, containerSizeConfig: SizeConfig) {
      let { x, y } = positionConfig;
      const { width, height } = sizeConfig;
      let xSize = width;
      let ySize = height;
      if (tranpose === AXIS_DIRECTION.LB) {
          // 交换x, y
          const temp = x;
          x = y;
          y = temp;

          xSize = height;
          ySize = width;
      }

      const xAxisScale = getScale(x, xSize);
      const yAxisScale = getScale(y, ySize);
      let bandSize = 0;
      if (checkIsCategory(x.type)) {
        bandSize = xAxisScale.bandwidth() / 2;
      }
      // 2. 定义图形绘制方式
      const drawX = x ? (d) => xAxisScale(d[x.code]) + bandSize : () => 0;
      // 图形绘制竖轴起点
      const drawY = y ? (d) => yAxisScale(d[y.code]) : () => 0;

      // 3. 绘制图形数据处理
      // 图形变化矩阵
      const matrixPosition = bl2lbMatrix();
      // 定义数据转化
      const newData = data.map((d) => {
        // x, y 位置信息值， width height当前值
        let positionX = drawX(d);
        let positionY = drawY(d);

        // 转置
        if (tranpose === AXIS_DIRECTION.LB) {
          // 图形绘制方式，通过矩阵进行重新定位
          const [currentX, currentY] = matrixMultiplication([[positionX, positionY, 1]], matrixPosition)[0];
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

  public getMinSize( cell: Cell[]) {
    let maxLength = 0;
    let labelNums = 0;
    const cellValues = this.getCellValues(this.data, cell);
    if (checkIsCategory(cell.map(item => item.type))) {
      const cellLength = cellValues.length;
      cellValues.forEach((currentValue, index) => {
        if (index === cellLength - 1 ) {
          labelNums  = currentValue.length;
        }
        currentValue.forEach((item) => {
          maxLength = d3.max([item[cell[index].code].length, maxLength]);
        });
      });
      const textSize = (maxLength * 7 * labelNums) / labelNums;
      return cellValues[0].length * textSize ;
    }
    return this.minWidth;
  }
}
