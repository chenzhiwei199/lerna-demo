import {
  Config,
  AxisConfig,
  SizeConfig,
  OffsetConfig,
} from '../Geom/BaseGeom2';
import flow from 'lodash.flow';
import { Offset } from './Offset';
import { Container, RootContainer, GContainer } from '../Geom/BaseGeom';
import {
  ELEMENT_TYPE,
  DoubleElementOptions,
  ElementOptions,
} from './SizeOptions';
import {
  ContainerElement,
  DoubleContainerOptions,
  ContaienrOptions,
} from './ContainerOptions';
import uuid from 'uuid/v1';

function createMask(
  container: GContainer,
  clipContainer: GContainer,
  sizeConfig: SizeConfig,
  offsetConfig?: OffsetConfig
) {
  // 创建遮罩
  const clipUUID = uuid();
  container
    .append('clipPath')
    .attr('id', `scrollbox-clip-path-${clipUUID}`)
    .attr('class', 'mask')
    .append('rect')
    .attr('width', sizeConfig.width)
    .attr('height', sizeConfig.height)
    .attr('x', offsetConfig ? offsetConfig.offsetX : 0)
    .attr('y', offsetConfig ? offsetConfig.offsetY : 0);
  clipContainer.attr('clip-path', `url(#scrollbox-clip-path-${clipUUID})`);
}
function creatContainer(
  container: GContainer,
  className: string,
  sizeConfig: SizeConfig,
  offset?: Offset,
  maskOffset?: Offset
) {
  const content = container.append('g').attr('class', `${className}_content`);
  // 遮罩
  createMask(
    container,
    content,
    sizeConfig,
    maskOffset ? maskOffset.toOffset() : offset ? offset.toOffset() : undefined
  );
  return content
    .append('g')
    .attr('class', className)
    .attr('transform', offset ? offset.toTransform() : `translate(0,0)`)
    .append('g');
}

export enum CONTAINER_TYPE {
  SCROLLER = 'scroll',
  AXIS = 'axis',
}

export default class Layout {
  container: RootContainer;
  config: Config;
  containerMap: Map<string, ContainerElement> = new Map();
  constructor(container: RootContainer, config: Config) {
    this.container = container;
    this.config = config;
    this.initContaienrs();
  }

  initContaienrs() {
    const createContainer = flow([
      this.creatFacet,
      this.createScroller,
      this.createMeasureLabel,
      this.createAxis,
      this.createGeom,
    ]);
    createContainer({
      ...this.config,
      container: this.container,
    });
  }

  get() {
    return this.containerMap;
  }
  creatFacet = (config: Config) => {
    const { sizeOptions, sizeConfig, container } = config;
    const { width, height } = sizeConfig;
    const scrollSizeOptions = sizeOptions.get(
      ELEMENT_TYPE.SCROLLER
    ) as DoubleElementOptions;
    const facetSizeOptions = sizeOptions.get(
      ELEMENT_TYPE.FACET_LABEL
    ) as DoubleElementOptions;
    const graphSizeOptions = sizeOptions.get(
      ELEMENT_TYPE.GEOM
    ) as ElementOptions;

    // 分面标签的位置
    const xColLabelContainerOffset = new Offset(
      width -
        scrollSizeOptions.getY().getSize('width') -
        graphSizeOptions.getWidth(),
      0
    );
    const yColLabelContainerOffset = new Offset(
      0,
      facetSizeOptions.getX().getHeight()
    );

    // 分面标签容器
    const xColLabelContainer = creatContainer(
      container,
      'x col label',
      {
        width: graphSizeOptions.getWidth(),
        height: facetSizeOptions.getX().getHeight(),
      },
      xColLabelContainerOffset
    );
    const yColLabelContainer = creatContainer(
      container,
      'y col label',
      {
        width: facetSizeOptions.getY().getWidth(),
        height: graphSizeOptions.getHeight(),
      },
      yColLabelContainerOffset
    );
    this.containerMap.set(
      ELEMENT_TYPE.FACET_LABEL,
      new DoubleContainerOptions(xColLabelContainer, yColLabelContainer)
    );

    return {
      ...config,
      container: container
        .append('g')
        .attr(
          'transform',
          `translate(${facetSizeOptions
            .getY()
            .getWidth()}, ${facetSizeOptions.getX().getHeight()})`
        ),
      sizeConfig: {
        width: width - facetSizeOptions.getSize('width'),
        height: height - facetSizeOptions.getSize('height'),
      },
    };
  };

  createMeasureLabel = (config: Config) => {
    const { sizeOptions, sizeConfig, container } = config;
    const { width, height } = sizeConfig;
    const measureLabelSizeOptions = sizeOptions.get(
      ELEMENT_TYPE.MEASURE_LABEL
    ) as DoubleElementOptions;
    const graphSizeOptions = sizeOptions.get(
      ELEMENT_TYPE.GEOM
    ) as ElementOptions;
    // 滚动条的位置
    const xMeasureOffset = new Offset(
      width - graphSizeOptions.getWidth(),
      height - measureLabelSizeOptions.getX().getHeight()
    );
    const yMeasureOffset = new Offset(0, 0);
    // 滚动条容器

    const xMeasureLabelContainer = creatContainer(
      container,
      'measure_label x',
      {
        width: graphSizeOptions.getWidth(),
        height: measureLabelSizeOptions.getX().getHeight(),
      },
      xMeasureOffset
    );

    const yMeasureLabelContainer = creatContainer(
      container,
      'measure_label y',
      {
        width: measureLabelSizeOptions.getY().getWidth(),
        height: graphSizeOptions.getHeight(),
      },
      yMeasureOffset
    );
    // xMeasureLabelContainer.append('rect').attr('width',graphSizeOptions.getWidth())
    // .attr('height',   measureLabelSizeOptions.getX().getHeight()).attr('fill', 'yellow');
    this.containerMap.set(
      ELEMENT_TYPE.MEASURE_LABEL,
      new DoubleContainerOptions(xMeasureLabelContainer, yMeasureLabelContainer)
    );
    return {
      ...config,
      container: container
        .append('g')
        .attr(
          'transform',
          `translate(${measureLabelSizeOptions.getY().getWidth()}, ${0})`
        ),
      sizeConfig: {
        width: width - measureLabelSizeOptions.getSize('width'),
        height: height - measureLabelSizeOptions.getSize('height'),
      },
    };
  };

  createGeom = (config: Config) => {
    const { container, sizeConfig } = config;
    const { width, height } = sizeConfig;
    // 初始化坐标轴容器
    const content = container.append('g').attr('class', 'content');
    const gridContainer = content
      .append('g')
      .attr('class', 'grid axis_container');
    const geomContainer = content.append('g').attr('class', 'x axis_container');
    // 创建遮罩
    this.containerMap.set(
      ELEMENT_TYPE.GRID,
      new ContaienrOptions(gridContainer)
    );
    this.containerMap.set(
      ELEMENT_TYPE.GEOM,
      new ContaienrOptions(geomContainer)
    );
    createMask(container, content, sizeConfig);
  };
  createAxis = (config: Config) => {
    const { sizeOptions, sizeConfig, container } = config;
    const { width, height } = sizeConfig;
    const axisSizeOptions = sizeOptions.get(
      ELEMENT_TYPE.AXIS
    ) as DoubleElementOptions;
    const graphSizeOptions = sizeOptions.get(
      ELEMENT_TYPE.GEOM
    ) as ElementOptions;

    // offsetX  = y方向分面标签宽度 + y坐标轴宽度  offsetY  = 组件高度 - x轴坐标轴高度 - 滚动条高度
    const xAxisOffset = new Offset(
      axisSizeOptions.getY().getWidth(),
      height - axisSizeOptions.getX().getHeight()
    );
    // offsetX = y轴坐标轴宽度 + 分面文本宽度 offsetY  = x方向分面标签高度
    // 坐标轴绘制后，会向左偏移坐标轴的宽度，适应图表的展示
    const yAxisOffset = new Offset(axisSizeOptions.getY().getWidth(), 0);

    // 初始化坐标轴容器
    const xAxisContainer = creatContainer(
      container,
      'x axis_container',
      {
        width: graphSizeOptions.getWidth(),
        height: axisSizeOptions.getX().getHeight(),
      },
      xAxisOffset
    );
    const yAxisContainer = creatContainer(
      container,
      'y axis_container',
      {
        width: axisSizeOptions.getY().getWidth(),
        height: graphSizeOptions.getHeight() + 10,
      },
      yAxisOffset,
      new Offset(0, -10)
    );

    this.containerMap.set(
      ELEMENT_TYPE.AXIS,
      new DoubleContainerOptions(xAxisContainer, yAxisContainer)
    );
    // yAxisContainer.append('rect').attr('width', width).attr('height', height).attr('fill', 'green');
    // container.append('rect').attr('width', width).attr('height', height).attr('fill', 'yellow');
    return {
      ...config,
      container: container
        .append('g')
        .attr(
          'transform',
          `translate(${axisSizeOptions.getY().getWidth()}, 0)`
        ),
      sizeConfig: {
        width: width - axisSizeOptions.getSize('width'),
        height: height - axisSizeOptions.getSize('height'),
      },
    };
  };

  createScroller = (config: Config) => {
    const { container, sizeOptions, sizeConfig } = config;
    const { width, height } = sizeConfig;
    const scrollSizeOptions = sizeOptions.get(
      ELEMENT_TYPE.SCROLLER
    ) as DoubleElementOptions;
    const graphSizeOptions = sizeOptions.get(
      ELEMENT_TYPE.GEOM
    ) as ElementOptions;
    const measureSizeOptions = sizeOptions.get(
      ELEMENT_TYPE.MEASURE_LABEL
    ) as DoubleElementOptions;
    // 滚动条的位置
    const xScrollOffset = new Offset(
      width -
        graphSizeOptions.getSize('width') -
        scrollSizeOptions.getY().getSize('width'),
      height - scrollSizeOptions.getX().getSize('height')
    );
    const yScrollOffset = new Offset(
      width - scrollSizeOptions.getY().getSize('width'),
      measureSizeOptions.getX().getSize('height')
    );

    // 滚动条容器
    const xScrollBarContainer = creatContainer(
      container,
      'scroll_container x',
      {
        width: graphSizeOptions.getWidth(),
        height: scrollSizeOptions.getX().getHeight(),
      },
      xScrollOffset
    );

    const yScrollBarContainer = creatContainer(
      container,
      'scroll_container y',
      {
        width: scrollSizeOptions.getY().getWidth(),
        height: graphSizeOptions.getHeight(),
      },
      yScrollOffset
    );

    this.containerMap.set(
      ELEMENT_TYPE.SCROLLER,
      new DoubleContainerOptions(xScrollBarContainer, yScrollBarContainer)
    );
    return {
      ...config,
      container: container
        .append('g')
        .attr('transform', `translate(${0}, ${0})`),
      sizeConfig: {
        width: width - scrollSizeOptions.getSize('width'),
        height: height - scrollSizeOptions.getSize('height'),
      },
    };
  };
}
