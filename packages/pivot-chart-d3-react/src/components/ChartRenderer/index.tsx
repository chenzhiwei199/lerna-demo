import * as React from 'react';
import {
  OffsetConfig,
  SizeConfig,
  AxisConfig,
  Cell,
  PositionsConfig,
  Config,
  DataSource,
  DimensionConfig,
  DimensionValueConfig,
  TreeDataSource,
  DIRECTION,
  AXIS_DIRECTION,
} from '../../global.d';
import SizeOptions, {
  ELEMENT_TYPE,
  SizeInterface,
} from '../../help/SizeOptions';
import {
  getScollInfo,
  getXFacetOffset,
  getYFacetOffset,
  getYMeasureNameOffset,
  getGraphOffset,
  getXAxisOffset,
  getYAxisOffset,
  getXMeasureNameOffset,
  checkIsLinear,
  isRotate,
} from '../../utils/chartUtils';
import { ElementOptions } from '../../help/ElementOptions';
import uuid from 'uuid/v1';
import Scroller from '../Scroller';
import { DoubleElementOptions } from '../../help/DoubleElementOptions';
import { ChartConfig } from '../Chart';
import Offset from '../../help/Offset';
import AxisGroup from '../Groups/AxisGroup';
import LabelGroup from '../Groups/LabelGroup';
import LabelGroupTree from '../Groups/LabelGroupTree';
import Mask from '../Mask';
import DoubleDataRenderer from '../Groups/GraphGroup';
import ScrollWrapper, { SCROLL_TYPE } from '../ScrollWrapper';
import MaskAndScrollWrapper from '../MaskAndScrollWrapper';
import GridGroup from '../Groups/GridGroup';

export interface ChartProps {
  width: number;
  height: number;
  config: ChartConfig;
}
export interface ChartState {}

class Chart extends React.Component<ChartProps, ChartState> {
  public dom: SVGSVGElement | null;
  public wheelEventListener: () => void;
  public creatId: string;
  constructor(props: ChartProps) {
    super(props);
    this.state = {};
    this.creatId = '';
    this.dom = null;
    this.wheelEventListener = () => {};
  }

  public bindEvent() {
    const { sizeConfig, realSizeConfig, sizeOptions } = this.props.config;
    const graphSize = sizeOptions.get().get(ELEMENT_TYPE.GEOM) as SizeInterface;
    const scrollSize = {
      width: graphSize.getWidth(),
      height: graphSize.getHeight(),
    };
    const xScrollInfo = getScollInfo(scrollSize.width, realSizeConfig.width);
    const yScrollInfo = getScollInfo(scrollSize.height, realSizeConfig.height);
    // 滑轮滚动事件
    if (this.dom) {
      this.dom.removeEventListener('wheel', this.wheelEventListener);
    }
    this.wheelEventListener = (
      e: {
        deltaY: number;
        deltaX: number;
        preventDefault: () => void;
      } = {} as { deltaY: number; deltaX: number; preventDefault: () => void }
    ) => {
      const { deltaY, deltaX } = e;
      this.onScrollPositionChange(xScrollInfo, DIRECTION.HORIZONTAL, deltaX);
      this.onScrollPositionChange(yScrollInfo, DIRECTION.VERTICAL, deltaY);
      e.preventDefault();
    };
    if (this.dom) {
      this.dom.addEventListener('wheel', this.wheelEventListener);
    }
  }
  public componentDidMount() {
    this.creatId = uuid();
    this.bindEvent();
  }
  public componentDidUpdate() {
    this.bindEvent();
  }

  public getScrollConfig(sizeConfig: SizeConfig, sizeOptions: SizeOptions) {
    const { width, height } = sizeConfig;
    const sizeMap = sizeOptions.get();
    const scrollSizeOptions = sizeMap.get(
      ELEMENT_TYPE.SCROLLER
    ) as DoubleElementOptions;
    const graphSizeOptions = sizeMap.get(ELEMENT_TYPE.GEOM) as ElementOptions;
    const measureSizeOptions = sizeMap.get(
      ELEMENT_TYPE.MEASURE_LABEL
    ) as DoubleElementOptions;
    const facetSizeOptions = sizeMap.get(
      ELEMENT_TYPE.FACET_LABEL
    ) as DoubleElementOptions;
    const xScrollOffset = new Offset(
      width -
        graphSizeOptions.getSize('width') -
        scrollSizeOptions.getY().getSize('width'),
      height - scrollSizeOptions.getX().getSize('height')
    );
    const yScrollOffset = new Offset(
      width - scrollSizeOptions.getY().getSize('width'),
      facetSizeOptions.getHeight()
    );
    return {
      xScrollOffset,
      yScrollOffset,
    };
  }

  public getScrollType(direction: DIRECTION) {
    return this.state[`scrollDistance_${direction}`] || 0;
  }

  public setScrollSize(direction: DIRECTION, size: number) {
    this.setState({
      [`scrollDistance_${direction}`]: size,
    });
  }

  public onScrollPositionChange = (
    scrollInfo,
    direction: DIRECTION,
    diff: number
  ) => {
    const beforeScrollDistance = this.getScrollType(direction);
    let scrollDistance = diff + beforeScrollDistance;

    // 防止滚动出去
    scrollDistance = Math.max(0, scrollDistance);
    scrollDistance = Math.min(scrollInfo.viewMaxScroll, scrollDistance);
    if (scrollDistance !== beforeScrollDistance) {
      this.setScrollSize(direction, scrollDistance);
    }
  };

  public render() {
    const { config } = this.props;
    const {
      data,
      axisConfig,
      geomInstance,
      graphDataConfig,
      realSizeConfig,
      sizeConfig,
      sizeOptions,
      positionsConfig,
      axisDataConfig,
      facetDataConfig,
      cellSizeConfig,
    } = config;
    const { x, y } = positionsConfig;
    const { x: xAxisData, y: yAxisData } = axisDataConfig;
    const { x: xGraphData, y: yGraphData } = graphDataConfig;
    const { x: xFacetData, y: yFacetData } = facetDataConfig;
    const { width: cellWidth, height: cellHeight } = cellSizeConfig;
    const graphSize = sizeOptions.get().get(ELEMENT_TYPE.GEOM) as SizeInterface;
    const axisSize = sizeOptions.get().get(ELEMENT_TYPE.AXIS) as SizeInterface;
    const measureSize = sizeOptions
      .get()
      .get(ELEMENT_TYPE.MEASURE_LABEL) as SizeInterface;
    const facetSize = sizeOptions
      .get()
      .get(ELEMENT_TYPE.FACET_LABEL) as SizeInterface;
    const creatId = this.creatId;
    const scrollSize = {
      width: graphSize.getWidth(),
      height: graphSize.getHeight(),
    };
    const padding = geomInstance.getPadding(x, y);
    const isXShowMeasureName = checkIsLinear(x.map(item => item.type));
    const isYShowMeasureName = checkIsLinear(y.map(item => item.type));
    const { isXShowScroll, isYShowScroll } = axisConfig;
    const { xScrollOffset, yScrollOffset } = this.getScrollConfig(
      config.sizeConfig,
      config.sizeOptions
    );
    const xScrollInfo = getScollInfo(scrollSize.width, realSizeConfig.width);
    const yScrollInfo = getScollInfo(scrollSize.height, realSizeConfig.height);
    const scrollOffsetX = this.getScrollType(DIRECTION.HORIZONTAL);
    const scrollOffsetY = this.getScrollType(DIRECTION.VERTICAL);
    const scrollBarOffsetX =
      (scrollOffsetX / xScrollInfo.viewMaxScroll) * xScrollInfo.maxScroll || 0;
    const scrollBarOffsetY =
      (scrollOffsetY / yScrollInfo.viewMaxScroll) * yScrollInfo.maxScroll || 0;
    // const { xMeasureOffset, yMeasureOffset } = this.getMeasureLabelConfig(config.sizeConfig, config.sizeOptions);
    const scrollOffsetConfig = {
      offsetX: scrollOffsetX,
      offsetY: scrollOffsetY,
    };
    const newConfig = {
      ...config,
      scrollOffsetConfig,
      graphMaskId: creatId,
      padding,
    };
    let xScroller;
    let yScroller;
    if (isXShowScroll) {
      xScroller = (
        <g transform={xScrollOffset.toTransform()}>
          <Scroller
            sizeConfig={scrollSize}
            updateScrollPosition={this.onScrollPositionChange.bind(
              this,
              xScrollInfo
            )}
            realSizeConfig={config.realSizeConfig}
            offset={scrollBarOffsetX}
            direction={DIRECTION.HORIZONTAL}
          />
        </g>
      );
    }

    if (isYShowScroll) {
      yScroller = (
        <g transform={yScrollOffset.toTransform()}>
          <Scroller
            updateScrollPosition={this.onScrollPositionChange.bind(
              this,
              yScrollInfo
            )}
            sizeConfig={scrollSize}
            realSizeConfig={config.realSizeConfig}
            direction={DIRECTION.VERTICAL}
            offset={scrollBarOffsetY}
          />
        </g>
      );
    }

    const graphOffset = getGraphOffset(sizeOptions);
    const xFacetOffset = getXFacetOffset(sizeOptions);
    const yFacetOffset = getYFacetOffset(sizeOptions);
    const xMeasureNameOffset = getXMeasureNameOffset(sizeOptions);
    const yMeasureNameOffset = getYMeasureNameOffset(sizeOptions);
    const xAxisOffset = getXAxisOffset(sizeOptions);
    const yAxisOffset = getYAxisOffset(sizeOptions);
    const yAxisMaskSize = {
      ...graphSize.transform2Size(),
      width: axisSize.getWidth(),
    };
    const xAxisMaskSize = {
      ...graphSize.transform2Size(),
      height: axisSize.getHeight(),
    };

    const xMeasureMaskSize = {
      ...graphSize.transform2Size(),
      height: measureSize.getHeight(),
    };
    const yMeasureMaskSize = {
      ...graphSize.transform2Size(),
      width: measureSize.getWidth(),
    };
    const xFacetMaskSize = {
      ...graphSize.transform2Size(),
      height: facetSize.getHeight(),
    };
    const yFacetMaskSize = {
      ...graphSize.transform2Size(),
      width: facetSize.getWidth(),
    };
    console.log('scrollOffsetConfig', scrollOffsetConfig);
    return (
      <svg
        width={this.props.width}
        height={this.props.height}
        ref={dom => {
          this.dom = dom;
        }}
      >
        {/* <MaskAndScrollWrapper
          id={`x-axis-${creatId}`}
          transform={xAxisOffset.toTransform()}
          maskSizeConfig={xAxisMaskSize}
          scrollType={SCROLL_TYPE.X}
          // scrollOffsetConfig={scrollOffsetConfig}
        >
          <AxisGroup
            scrollOffsetConfig={scrollOffsetConfig}
            data={xAxisData}
            isLabelRotate={isRotate(xGraphData)}
            containerSize={graphSize.getWidth()}
            size={cellWidth}
            gapStart={padding[3]}
            gapEnd={padding[1]}
            axisHeight={axisSize.getHeight()}
            type={DIRECTION.HORIZONTAL}
          />
        </MaskAndScrollWrapper>
        <MaskAndScrollWrapper
          id={`x-measure-name-${creatId}`}
          transform={xMeasureNameOffset.toTransform()}
          maskSizeConfig={xMeasureMaskSize}
          scrollType={SCROLL_TYPE.X}
          scrollOffsetConfig={scrollOffsetConfig}
        >
          {isXShowMeasureName && (<LabelGroup labelHeight={30} data={xAxisData} size={cellWidth} containerSize={sizeConfig.width} scrollOffsetConfig={scrollOffsetConfig} type={DIRECTION.HORIZONTAL}/>)}
        </MaskAndScrollWrapper>

        <MaskAndScrollWrapper
          id={`x-facet-${creatId}`}
          transform={xFacetOffset.toTransform()}
          maskSizeConfig={xFacetMaskSize}
          scrollType={SCROLL_TYPE.X}
          scrollOffsetConfig={scrollOffsetConfig}
        >
          <LabelGroupTree  containerSize={sizeConfig.width} scrollOffsetConfig={scrollOffsetConfig} data={xFacetData} type={DIRECTION.HORIZONTAL}/>
        </MaskAndScrollWrapper> */}

        <MaskAndScrollWrapper
          id={`y-axis-${creatId}`}
          transform={yAxisOffset.toTransform()}
          maskSizeConfig={yAxisMaskSize}
          scrollType={SCROLL_TYPE.Y}
          // scrollOffsetConfig={scrollOffsetConfig}
        >
          <g transform={`translate(${axisSize.getWidth()}, 0)`}>
            <AxisGroup
              scrollOffsetConfig={scrollOffsetConfig}
              containerSize={graphSize.getHeight()}
              data={yAxisData}
              size={cellHeight}
              gapStart={padding[0]}
              gapEnd={padding[2]}
              axisHeight={axisSize.getWidth()}
              type={DIRECTION.VERTICAL}
            />
          </g>
        </MaskAndScrollWrapper>

        {/* <MaskAndScrollWrapper
          id={`y-measure-name-${creatId}`}
          transform={yMeasureNameOffset.toTransform()}
          maskSizeConfig={yMeasureMaskSize}
          scrollType={SCROLL_TYPE.Y}
          scrollOffsetConfig={scrollOffsetConfig}
        >
          {isYShowMeasureName && (<LabelGroup labelHeight={30} scrollOffsetConfig={scrollOffsetConfig}data={yAxisData} containerSize={graphSize.getWidth()}size={cellHeight} type={DIRECTION.VERTICAL} />)}
        </MaskAndScrollWrapper>

        <MaskAndScrollWrapper
          id={`y-facet-${creatId}`}
          transform={yFacetOffset.toTransform()}
          maskSizeConfig={yFacetMaskSize}
          scrollType={SCROLL_TYPE.Y}
          scrollOffsetConfig={scrollOffsetConfig}
        >
          <LabelGroupTree  containerSize={graphSize.getHeight()} scrollOffsetConfig={scrollOffsetConfig} data={yFacetData} type={DIRECTION.VERTICAL}/>
        </MaskAndScrollWrapper>

        <MaskAndScrollWrapper
          id={`graph-${creatId}`}
          transform={graphOffset.toTransform()}
          maskSizeConfig={graphSize.transform2Size()}
          scrollType={SCROLL_TYPE.ALL}
          scrollOffsetConfig={scrollOffsetConfig}
        >

          <GridGroup xData={xGraphData} yData={yGraphData} config={newConfig}/>
          <DoubleDataRenderer xData={xGraphData} yData={yGraphData} config={newConfig}/>
        </MaskAndScrollWrapper> */}

        {yScroller}
        {xScroller}
      </svg>
    );
  }
}

export default Chart;
