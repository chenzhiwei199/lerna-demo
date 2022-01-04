import BaseGeomProps, {
  DataSource,
  DIRECTION,
  PositionConfig,
  SizeConfig,
} from './BaseGeom2';
import { checkIsCategory, getScale, checkIsLinear } from '../utils/chart';
import { matrixMultiplication, bl2lbMatrix } from '../utils/matrix';
import * as d3 from 'd3';
import { Cell, Container, GContainer } from './BaseGeom';

export default class IntervalGeom extends BaseGeomProps {
  getPadding() {
    return [0, 0, 0, 0];
  }

  drawGraph(contaienr: GContainer, data: any[], sizeConfig: SizeConfig) {
    // console.log(222 ,data)
    // const line = d3.line()
    //   .x((d, index) => data[index].x )
    //   .y((d, index) => data[index].y );
    // contaienr.selectAll('.line').enter().append('path').datum(data)
    //   .attr('class', `line`)
    //   .attr('fill', 'blue')
    //   .attr('d', line);
    // contaienr.append('rect').attr('fill', 'green').attr('width', sizeConfig.width).attr('height', sizeConfig.height);
    contaienr
      .selectAll('.point')
      .data(data)
      .enter()
      .append('circle')
      .attr('fill', '#cce5df')
      .attr('stroke', '#69b3a2')
      .attr('stroke-width', 1.5)
      .attr('cx', (d, index) => {
        return data[index].x;
      })
      .attr('cy', (d, index) => {
        return data[index].y;
      })
      .attr('r', '4');
  }

  transformData(
    data: DataSource,
    tranpose: DIRECTION,
    positionConfig: PositionConfig,
    sizeConfig: SizeConfig
  ) {
    let { x, y } = positionConfig;
    let { width, height } = sizeConfig;
    let xSize = width;
    let ySize = height;
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
    let bandSize = 0;
    if (checkIsCategory(x)) {
      bandSize = xAxisScale.bandwidth() / 2;
    }
    // 2. 定义图形绘制方式
    let drawX = x
      ? d => {
          return xAxisScale(d[x.code]) + bandSize;
        }
      : () => 0;
    // 图形绘制竖轴起点
    let drawY = y
      ? d => {
          return yAxisScale(d[y.code]);
        }
      : () => 0;

    // 3. 绘制图形数据处理
    // 图形变化矩阵
    const matrixPosition = bl2lbMatrix();
    // 定义数据转化
    const newData = data.map(d => {
      // x, y 位置信息值， width height当前值
      let positionX = drawX(d);
      let positionY = drawY(d);

      // 转置
      if (tranpose === DIRECTION.LB) {
        // 图形绘制方式，通过矩阵进行重新定位
        const [currentX, currentY] = matrixMultiplication(
          [[positionX, positionY, 1]],
          matrixPosition
        )[0];
        positionX = currentX;
        positionY = currentY;
      }
      return {
        x: positionX,
        y: ySize - positionY,
      };
    });
    console.log('transformData', sizeConfig);
    console.log('position', newData);
    return newData;
  }

  getMinSize(cell: Cell[]) {
    let maxLength = 0;
    let labelNums = 0;
    const cellValues = this.getCellValues(this.data, cell);
    if (checkIsCategory(cell)) {
      const cellLength = cellValues.length;
      cellValues.forEach((currentValue, index) => {
        if (index === cellLength - 1) {
          labelNums = currentValue.length;
        }
        currentValue.forEach(item => {
          maxLength = d3.max([item[cell[index].code].length, maxLength]);
        });
      });
      const textSize = (maxLength * 7 * labelNums) / labelNums;
      return cellValues[0].length * textSize;
    }
    return this.minWidth;
  }
}
