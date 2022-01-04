import * as React from 'react';
import * as d3 from 'd3';
import {
  Cell,
  DIRECTION,
  OffsetConfig,
  AXIS_DIRECTION,
} from '../../../global.d';
import Facet from '../../Facet';
import Grid from '../../../components/Grid';
import { checkIsLinear, checkIsCategory } from '../../../utils/chartUtils';
import { ChartConfig } from '../../../components/Chart';

export interface AxisGroupProps {
  xData: Cell[];
  yData: Cell[];
  config: ChartConfig;
}

class GridGroup extends React.PureComponent<AxisGroupProps> {
  public renderFacetCell = (visibleSize, x, y) => {
    const { padding = [0, 0, 0, 0] } = this.props.config;
    const newRealSizeConfig = this.getRealSizeConfig();
    const drawSizeConfig = {
      width: newRealSizeConfig.width - padding[3] - padding[1],
      height: newRealSizeConfig.height - padding[2] - padding[0],
    };
    const verticalGrid = checkIsLinear(x.type) ? (
      <Grid
        gridSize={newRealSizeConfig.height}
        size={drawSizeConfig.width}
        cell={x}
        type={DIRECTION.VERTICAL}
      />
    ) : (
      <g />
    );
    const horizontalGrid = checkIsLinear(y.type) ? (
      <Grid
        gridSize={newRealSizeConfig.width}
        size={drawSizeConfig.height}
        cell={y}
        type={DIRECTION.HORIZONTAL}
      />
    ) : (
      <g />
    );
    return (
      <g>
        <g transform={`translate(${0}, ${padding[0]})`}>{horizontalGrid}</g>
        <g transform={`translate(${padding[3]}, 0)`}>{verticalGrid}</g>
      </g>
    );
  };

  public getRealSizeConfig() {
    const { xData, yData, config } = this.props;
    const { realSizeConfig } = config;
    const width = realSizeConfig.width / xData.length || 0;
    const height = realSizeConfig.height / yData.length || 0;
    const newRealSizeConfig = {
      width,
      height,
    };
    return newRealSizeConfig;
  }

  public renderGridGroup() {
    const { xData, yData, config } = this.props;
    const { scrollOffsetConfig, sizeConfig } = config;
    const newRealSizeConfig = this.getRealSizeConfig();
    const xField = {
      data: xData,
      size: newRealSizeConfig.width,
      containerSize: sizeConfig.width,
    };
    const yField = {
      data: yData,
      size: newRealSizeConfig.height,
      containerSize: sizeConfig.height,
    };
    return (
      <Facet
        xField={xField}
        yField={yField}
        renderFacetCell={this.renderFacetCell}
        scrollOffsetConfig={scrollOffsetConfig}
      />
    );
  }
  public render() {
    return <g>{this.renderGridGroup()}</g>;
  }
}

export default GridGroup;

export enum AxisType {
  x = 'x',
  y = 'y',
}
