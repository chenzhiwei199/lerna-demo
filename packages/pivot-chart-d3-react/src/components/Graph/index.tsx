import * as React from 'react';
import BaseGeom from '../Geom/BaseGeom';
import { PositionsConfig, SizeConfig, DataSource, AXIS_DIRECTION, PositionConfig, VisibleConfig } from '../../global.d';
import Line from '../Line';
import Point from '../../help/Point';

export interface GraphProps {
  data: DataSource;
  visibleSize: VisibleConfig;
  geomInstance: BaseGeom;
  positionConfig: PositionConfig;
  realSizeConfig: SizeConfig;
  // 容器大小
  containerSizeConfig: SizeConfig;
  transpose: AXIS_DIRECTION;
}

export interface GraphState {

}

class Graph extends React.Component<GraphProps, GraphState> {
  constructor(props: GraphProps) {
    super(props);
  }
  public render() {
    const { data, visibleSize, geomInstance, containerSizeConfig, transpose,  realSizeConfig, positionConfig } = this.props;
    // 数据转化
    const newData = geomInstance.transformData(data, transpose, positionConfig,  realSizeConfig, containerSizeConfig, visibleSize);
    const { width, height } = realSizeConfig;
    // 图形绘制
    return(
      <g>
        {geomInstance.drawGraph(newData, realSizeConfig, visibleSize)}
      </g>
    );
  }
}

export default Graph;
