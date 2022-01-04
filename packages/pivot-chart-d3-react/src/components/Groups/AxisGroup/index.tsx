import * as React from 'react';
import * as d3 from 'd3';
// import Axis from '../../Axis';
import Axis from '../../ReAxis';
import { Cell, DIRECTION, OffsetConfig } from '../../../global.d';
import Facet from '../../Facet';

export interface AxisGroupProps {
 data: Cell[];
 type: DIRECTION;
 /**
  * 整体坐标轴的大小
  */
 size: number;
 containerSize: number;
 axisHeight: number;
 scrollOffsetConfig: OffsetConfig;
 gapStart?: number;
 gapEnd?: number;
 // 文本是否旋转
 isLabelRotate?: boolean;
}

class AxisGroup extends React.PureComponent<AxisGroupProps> {
  public renderFacetCell = (visibleSize, cell) => {
    const {startOffset, endOffset} = visibleSize;
    const { type, containerSize, isLabelRotate, axisHeight, size, gapStart = 0, gapEnd = 0} = this.props;
    return  <Axis  virtualConfig={{
      startOffset: startOffset,
      endOffset: endOffset,
      containerSize: containerSize
    }} range={cell.range} domainType={cell.type} isLabelRotate={isLabelRotate} axisHeight={axisHeight} size={size - gapStart - gapEnd}  direction={type} />;
  }
  public renderAxisGroup() {
    const { data, type, size, gapStart = 0, containerSize, scrollOffsetConfig } = this.props;
    let xField;
    let yField;
    if (type === DIRECTION.HORIZONTAL) {
      xField = {
        data,
        size,
        gapStart,
        containerSize,
      };
    } else {
      yField = {
        data,
        size,
        gapStart,
        containerSize,
      };
    }
    return <Facet xField={xField} yField={yField} isTransform={true} renderFacetCell={this.renderFacetCell} scrollOffsetConfig={scrollOffsetConfig} />;
  }
  public render() {
    return <g>{this.renderAxisGroup()}</g>;
  }
}

export default AxisGroup;

export enum AxisType {
  x = 'x',
  y = 'y',
}
