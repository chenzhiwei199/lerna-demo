import * as React from 'react';
import { checkIsLinear, checkIsCategory } from '../../utils/chartUtils';
import { VictoryAxis } from 'victory-axis';
import { BaseType } from 'd3';
import {
  DIRECTION,
  ScaleType,
  SCALE_RANGE,
} from '../../global.d';
import Point from '../../help/Point';
import Line from '../Line';
import { getCellConfig } from '../../utils';
import Label from './Label';
import { getAxis } from './core';

export interface AxisProps {
  virtualConfig?: {
    /**
     * 坐标轴在展示区域的开始偏移量
     */
    startOffset: number;
    /**
     * 坐标轴在展示区域的结束时的偏移量
     */
    endOffset: number;
    /**
     * 坐标轴容器宽度
     */
    containerSize: number;
  };
  range: SCALE_RANGE;
  /**
   * domain类型
   */
  domainType: ScaleType;
  /**
   * 坐标轴方向
   */
  direction: DIRECTION;
  /**
   * 坐标轴高度
   */
  axisHeight: number;
  /**
   * 坐标轴实际宽度
   */
  size: number;
  /**
   * 坐标轴标签是否旋转
   */
  isLabelRotate: boolean;
}

class Axis extends React.Component<AxisProps> {
  public static defaultProps = {
    type: DIRECTION.HORIZONTAL,
    axisHeight: 30,
    size: 200,
    containerSize: 500,
    isLabelRotate: false,
  };
  public axis: BaseType;
  constructor(props: AxisProps) {
    super(props);
    this.axis = null;
  }

  public getOffsetConfig() {
    const { virtualConfig, size, range } = this.props;
    let startOffset = 0;
    let startIndex = 0;
    let endIndex = range.length;
    let rangeUnitSize = 0;
    if (!virtualConfig) {
      return {
        startIndex,
        endIndex,
        startOffset,
        rangeUnitSize: size / range.length,
      };
    } else {
      const { startOffset, endOffset, containerSize } = virtualConfig;
      rangeUnitSize = size / range.length;
      const cellConfig = getCellConfig(
        startOffset,
        endOffset,
        size,
        containerSize,
        rangeUnitSize
      );
      return {
        startOffset: cellConfig.startOffset,
        startIndex: cellConfig.startIndex,
        endIndex: cellConfig.endIndex,
        rangeUnitSize,
      };
    }
  }

  public getAxisConfig() {
    let { direction, domainType, size, isLabelRotate } = this.props;
    const axisInfo = getAxis(direction, domainType, this.getRange(), size, isLabelRotate);
    return axisInfo;
  }

  getRange() {
    let { range, direction, domainType } = this.props
    if(direction === DIRECTION.VERTICAL && checkIsCategory(domainType)) {
      range = range.slice(0).reverse() as SCALE_RANGE
    }
    return range
  }
  getRangeAndSize() {
    let { domainType, size, direction } = this.props;
    let groupTransform;
     // 离散坐标轴旋转 clone
    let range = this.getRange()
    if (checkIsCategory(domainType)) {
      const {
        startIndex,
        endIndex,
        rangeUnitSize,
        startOffset,
      } = this.getOffsetConfig();
      // WARN: 正常情况+1， +2为了最后一个离散值x轴展示虚拟变化太明显
      range = range.slice(startIndex, endIndex + 2) as string[];
      size = rangeUnitSize * (endIndex - startIndex);
      if (checkIsCategory(domainType)) {
        if (direction === DIRECTION.HORIZONTAL) {
          groupTransform = `translate(${-startOffset}, ${0})`;
        } else {
          groupTransform = `translate(${0}, ${-startOffset})`;
        }
      }
    }
    
    return {
      range,
      size,
      groupTransform,
    };
  }
  renderLine() {
    const { direction, axisHeight, size } = this.props;
    if (direction === DIRECTION.VERTICAL) {
      return (
        <g transform={`translate(-${axisHeight}, 0)`}>
          <Line points={[new Point(0, size), new Point(axisHeight, size)]} />
        </g>
      );
    } else {
      return (
        <g transform={`translate(0, -${axisHeight})`}>
          <Line points={[new Point(size, 0), new Point(size, axisHeight)]} />
        </g>
      );
    }
  }
  public render() {
    const { domainType, direction } = this.props;
    const axisConfig = this.getAxisConfig();
    const { range, size, groupTransform } = this.getRangeAndSize();
    const {
      scale,
      angle,
      textAnchor,
      verticalAnchor,
      firstTextAnchor,
      firstVerticalAnchor,
    } = axisConfig;
    const config = {
      standalone: false,
      // transform,
      padding: 0,
      style: {
        ticks: { stroke: 'grey', size: 5 },
      },
      tickLabelComponent: (
        <Label
          type={direction}
          firstVerticalAnchor={firstVerticalAnchor}
          firstTextAnchor={firstTextAnchor}
          textAnchor={textAnchor}
          verticalAnchor={verticalAnchor}
          angle={angle}
        />
      ),
    } as any;
    let paddingStart = 0;
    let paddingEnd = 0;
    if (checkIsCategory(domainType)) {
      config.tickValues = range
      //展示效果优化，避免柱子超出去，离散数据的起点需要用第一个数据计算得出 加上柱子的宽度的一半
      paddingStart = scale(range[0]) + scale.bandwidth() / 2;
      paddingEnd = scale(range[0]) + scale.bandwidth() / 2;
    } else if (checkIsLinear(domainType)) {
      config.domain = range;
      config.tickCount = 3;
    }

    if (direction === DIRECTION.VERTICAL) {
      config.height = size;
      config.width = 0;
      config.offsetX = -1;
      config.orientation = 'left';
      config.padding = {
        top: paddingStart,
        bottom: paddingEnd,
        left: 0,
        right: 0,
      };
    } else {
      config.width = size;
      config.height = 0;
      config.offsetY = -1;
      config.orientation = 'bottom';
      config.padding = {
        left: paddingStart,
        right: paddingEnd,
        top: 0,
        bottom: 0,
      };
    }
    console.log("333", JSON.stringify(config.tickValues) )
    console.log("444", JSON.stringify(config.domain) )
    const cmp = Number.isFinite(size) ? <VictoryAxis {...config} /> : <g />;
    return (
      <g>
        <g className="axis-scroll-transform" transform={groupTransform}>
          {cmp}
          {this.renderLine()}
        </g>
      </g>
    );
  }
}
export default Axis;

export enum AxisType {
  x = 'x',
  y = 'y',
}
