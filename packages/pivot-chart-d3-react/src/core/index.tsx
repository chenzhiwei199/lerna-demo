import color from '../utils/color';
import {
  GContainer,
  AxisType,
  Cell,
  DIRECTION,
  SVGContainer,
} from '../global.d';
import { getAxis, checkIsLinear, checkIsCategory } from '../utils/chartUtils';

export function drawAxis(
  container: SVGContainer,
  size: number,
  type: DIRECTION,
  cell: Cell,
  isJustMeasure: boolean = false,
  isLabelRoatae: boolean = false
) {
  // 坐标轴容器
  const axisContainer = container.append('g').attr('class', `${type} axis`);
  const { scale, axis, transform, angle } = getAxis(
    type,
    cell,
    size,
    isLabelRoatae
  );
  // 标签展示优化
  axis.ticks([4]);
  // 为啥会空
  if (axis && scale) {
    axisContainer.attr('transform', transform).call(axis);
  }
  // 坐标轴文本颜色
  axisContainer.selectAll('line').attr('style', `stroke: ${color.GRID}`);
  axisContainer.selectAll('path').attr('style', `stroke: ${color.GRID}`);
  axisContainer.selectAll('text').attr('fill', color.AXIS_LABEL);
  // 是否需要文本旋转
  if (angle) {
    axisContainer.selectAll('text').attr('transform', `rotate(${angle})`);
  }
  // 展示优化，y轴文字展示在坐标轴之上
  if (checkIsLinear(cell.type)) {
    // 坐标轴标签可能超出视图，y周通过文字的位置优化，x轴通过调整位置来优化,这里进行视图优化.
    if (type === DIRECTION.VERTICAL) {
      axisContainer
        .selectAll('text')
        .attr('style', 'dominant-baseline: ideographic');
    } else {
      axisContainer.select('text').attr('style', 'text-anchor: start');
    }
  }
  let axisSize = 0;
  const { width, height } = (axisContainer as any)._groups[0][0].getBBox();
  let maxLabelWidth = 0;
  (axisContainer.selectAll('text') as any)._groups[0].forEach(element => {
    const w = element.getBBox().width;
    maxLabelWidth = w > maxLabelWidth ? w : maxLabelWidth;
  });
  if (type === DIRECTION.HORIZONTAL) {
    axisSize = height;
  } else {
    axisSize = width;
  }
  if (isJustMeasure) {
    axisContainer.remove();
  }
  return axisSize;
}
