import * as React from 'react';
import {
  TreeDataSource,
  DIRECTION,
  OffsetConfig,
  Cell,
  AXIS_DIRECTION,
  DataSource,
} from '../../../global.d';
import { ChartConfig } from '../../Chart';
import Graph from '../../Graph';
import * as get from 'lodash/get';
import { checkIsCategory, checkIsLinear } from '../../../utils/chartUtils';
import Facet from '../../../components/Facet';
import Line from '../../../components/Line';
import Point from '../../../help/Point';
import { ELEMENT_TYPE, SizeInterface } from '../../../help/SizeOptions';
export interface TreeProps {
  xData: Cell[];
  yData: Cell[];
  config: ChartConfig;
}

export interface TreeState {}

function filterDatas(
  data: DataSource,
  categorys: Cell[],
  dimensionKeys: string[]
) {
  return dimensionKeys.reduce((filterData, currentKey, currentIndex) => {
    return filterData.filter(
      item => item[categorys[currentIndex].code] === currentKey
    );
  }, data);
}
class DoubleDataRenderer extends React.Component<TreeProps, TreeState> {
  constructor(props: TreeProps) {
    super(props);
  }

  public getRealSizeConfig() {
    const { xData, yData, config } = this.props;
    const { realSizeConfig, padding } = config;
    const width = realSizeConfig.width / xData.length || 0;
    const height = realSizeConfig.height / yData.length || 0;
    const newRealSizeConfig = {
      width,
      height,
    };
    return newRealSizeConfig;
  }
  public renderFacetCell = (visibleSize, x, y) => {
    const {
      data,
      sizeOptions,
      geomInstance,
      sizeConfig,
      dimensionConfig,
      padding,
    } = this.props.config;
    const geom = sizeOptions.get().get(ELEMENT_TYPE.GEOM) as SizeInterface;
    const newRealSizeConfig = this.getRealSizeConfig();
    const dimensionKeys = [
      ...get(x, 'dimensionKeys', []),
      ...get(y, 'dimensionKeys', []),
    ];
    let filterData = [] as any;
    if (dimensionKeys.length !== 0) {
      // filterData = dimensionKeys.reduce((root, key) => {
      //   return root[key];
      // }, dataMap) || [];
      filterData = filterDatas(
        data,
        [...dimensionConfig.x, ...dimensionConfig.y],
        dimensionKeys
      );
    } else {
      filterData = data;
    }
    if (!x || !x.code) {
      x = undefined;
    }
    if (!y || !y.code) {
      y = undefined;
    }
    let tranpose;
    // 1. x 是维度的情况
    // 2. x, y 都是维度的想看
    // 3. y轴是度量，且x轴不存在
    if (
      checkIsCategory(x) ||
      (checkIsLinear(x.type) && checkIsLinear(y.type)) ||
      (checkIsLinear(y.type) && !x)
    ) {
      tranpose = AXIS_DIRECTION.BL;
    } else {
      tranpose = AXIS_DIRECTION.LB;
    }
    const drawSizeConfig = {
      width: newRealSizeConfig.width - padding[3] - padding[1],
      height: newRealSizeConfig.height - padding[2] - padding[0],
    };
    const containerSizeConfig = {
      width: geom.getWidth(),
      height: geom.getHeight(),
    };
    return (
      <g>
        <g transform={`translate(${padding[3]}, ${padding[0]})`}>
          <Graph
            containerSizeConfig={containerSizeConfig}
            visibleSize={visibleSize}
            transpose={tranpose}
            data={filterData}
            geomInstance={geomInstance}
            positionConfig={{ x, y }}
            realSizeConfig={drawSizeConfig}
          />
        </g>
        <Line
          points={[
            new Point(0, newRealSizeConfig.height),
            new Point(newRealSizeConfig.width, newRealSizeConfig.height),
          ]}
        />
        <Line
          points={[
            new Point(newRealSizeConfig.width, 0),
            new Point(newRealSizeConfig.width, newRealSizeConfig.height),
          ]}
        />
      </g>
    );
  };
  public renderGraph() {
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
    return <g>{this.renderGraph()}</g>;
  }
}

export default DoubleDataRenderer;
