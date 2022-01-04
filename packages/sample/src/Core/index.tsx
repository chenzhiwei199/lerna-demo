import { getAxisInfo, checkIsLinear } from '../utils/chart';
import color from '../utils/color';
import { Cell, Container, GContainer } from '../Geom/BaseGeom';
import { AxisType } from '../Geom/BaseGeom2';
export function drawAxis(
  container: GContainer,
  size: number,
  type: AxisType,
  cell: Cell,
  isJustMeasure: boolean = false
) {
  // container.append('rect').attr('fill', 'blue').attr('width', size).attr('height', 10);
  // 坐标轴容器
  let axisContainer = container.append('g').attr('class', `${type} axis`);
  const { scale, axis, transform, labelTransform } = getAxisInfo(
    type,
    cell,
    size
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
  if (labelTransform) {
    axisContainer.selectAll('text').attr('transform', labelTransform);
  }
  // 展示优化，y轴文字展示在坐标轴之上
  if (checkIsLinear(cell)) {
    // 坐标轴标签可能超出视图，y周通过文字的位置优化，x轴通过调整位置来优化,这里进行视图优化.
    if (type === AxisType.y) {
      axisContainer
        .selectAll('text')
        .attr('style', 'dominant-baseline: ideographic');
    } else {
      axisContainer.select('text').attr('style', 'text-anchor: start');
    }
  }
  let axisSize = 0;
  const { width, height } = (axisContainer as any)._groups[0][0].getBBox();
  if (type === AxisType.x) {
    axisSize = height;
  } else {
    axisSize = width;
  }
  if (isJustMeasure) {
    axisContainer.remove();
  }
  return axisSize;
}
