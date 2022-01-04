import * as React from 'react';
import * as d3 from 'd3';
import { getAxis, checkIsCategory, getMatrix } from '../../utils/chartUtils';
import { BaseType } from 'd3';
import color from '../../utils/color';
import { Cell, DIRECTION } from '../../global.d';
import Line from '../Line';
import Point from '../../help/Point';
import { matrixMultiplication } from '../../utils/matrix';
import { getScale } from '../ReAxis/core';

export interface AxisProps {
  type: DIRECTION;
  cell: Cell;
  size: number;
  gridSize: number;
}

class Grid extends React.Component<AxisProps> {
  public axis: BaseType;
  constructor(props: AxisProps) {
    super(props);
    this.axis = null;
  }

  public renderGrid() {
    const { type, cell, size, gridSize } = this.props;
    // martrix = b2lMatrix;
    const scale = getScale(
      cell.type,cell.range, size
    );
    const matrix = getMatrix(type, size)
    const ticks = checkIsCategory(cell.type) ? cell.range : scale.ticks([3]);
    return ticks.map((tick, index) => {
      let points;
      let currentPosition = scale(tick);
      if (type === DIRECTION.HORIZONTAL) {
        // 需要矩阵进行转换
        const [currentX, currentY] = matrixMultiplication(
          [[0, currentPosition, 1]],
          matrix
        )[0];
        currentPosition = currentY;
        points = [
          new Point(0, currentPosition),
          new Point(gridSize, currentPosition),
        ];
      } else {
        points = [
          new Point(currentPosition, 0),
          new Point(currentPosition, gridSize),
        ];
      }
      return <Line key={index} points={points} size={1} />;
    });
  }

  public render() {
    return <g className="grid">{this.renderGrid()}</g>;
  }
}

export default Grid;
