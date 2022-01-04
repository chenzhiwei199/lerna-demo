import * as d3 from 'd3';
import { ScaleType, DIRECTION, Cell, SCALE_RANGE } from '../../global.d';
import { b2LAxisMatrix, getTransformMatrix } from '../../utils/matrix';
import { checkIsLinear, checkIsCategory } from '../../utils/chartUtils';
import { ScaleLinear, ScaleBand } from 'd3';

export function getScaleByType(type: string, min: number = 0, max: number) {
  switch (type) {
    case ScaleType.LINEAR:
      return d3
        .scaleLinear()
        .range([min, max])
        .nice();
    case ScaleType.CATEGORY:
      return d3.scaleBand().range([min, max]);
    default:
      return d3.scaleBand().range([min, max]);
  }
}

export function getScale(scaleType, range, max: number) {
  let scale;
  if (checkIsLinear(scaleType)) {
    // 双轴线性
    scale = getScaleByType(scaleType, 0, max) as ScaleLinear<number, number>;
    scale = scale.domain(range);
  } else if (checkIsCategory(scaleType)) {
    // x轴离散，y轴线性
    scale = getScaleByType(scaleType, 0, max) as ScaleBand<string>;
    scale = scale.domain(range).padding(0.2);
  }
  return scale;
}

export function getAxis(
  type: DIRECTION,
  scaleType: ScaleType,
  range: SCALE_RANGE,
  size: number,
  isLabelRotate: boolean = false
) {
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
  const { axis: b2lMatrix } = b2LAxisMatrix(size);

  if (checkIsLinear(scaleType)) {
    if (type === DIRECTION.VERTICAL) {
      // 线性 & 垂直 = 首个坐标轴标签样式优化，画到x轴线之上
      firstVerticalAnchor = 'end';
    } else {
      // 线性 & 水平 = 首个坐标轴标签样式优化，画到y轴线之右
      firstTextAnchor = 'start';
    }
  }

   // 离散，标签旋转
   if (isLabelRotate) {
    (textAnchor = 'start'), (verticalAnchor = 'middle'), (angle = 90);
  }

  // 根据方向不同，画不同的坐标轴
  if (type === DIRECTION.HORIZONTAL) {
    axis = d3.axisBottom(scale);
  } else {
    axis = d3.axisLeft(scale);
    transform = `matrix(${getTransformMatrix(b2lMatrix)})`;
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
