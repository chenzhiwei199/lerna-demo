import BaseGeom, {
  BaseGeomProps,
  Cell,
  CellTypeEnum,
  GContainer,
} from './BaseGeom';
import {
  checkIsCategory,
  getScale,
  checkIsLinear,
  produceScale,
  produceConfig,
  countTreeData,
  getScollInfo,
  produceSizeConfig,
  getViewScrollDistance,
  getAxisInfo,
  getCategoryValues,
} from '../utils/chart';
import { isNumber } from '../utils';
import * as d3 from 'd3';
import { AxisScale, AxisDomain, ValueFn } from 'd3';
import color from '../utils/color';
import SizeOptions, {
  SizeInterface,
  ELEMENT_TYPE,
  DoubleElementOptions,
  ElementOptions,
} from '../help/SizeOptions';
import Layout from '../help/Layout';
import {
  ContainerElement,
  ContaienrOptions,
  DoubleContainerOptions,
} from '../help/ContainerOptions';

/**
 * 点构造函数
 *
 * @param {number} x
 * @param {number} y
 * @returns
 */

class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
const getValue = (d: any, func: any) => {
  if (isNumber(func)) {
    return func;
  }
  return func(d) as number;
};

export default abstract class BaseGeom2 extends BaseGeom {
  count: number = 0;
  scrollXDistance: number = 0;
  constructor(props: BaseGeomProps) {
    super(props);
  }

  getCellValues(data: DataSource, cells: Cell[]) {
    const currentValues =
      cells && cells[0] ? getCategoryValues(data, [cells[0].code]) : [];
    return currentValues;
  }

  renderGroup(config: GroupCellProps) {
    let {
      maxAxisSize,
      positionsConfig,
      containers,
      sizeConfig,
      gridConfig,
      offsetConfig,
      axisConfig,
      ...rest
    } = config;
    const {
      xMeasureNameContainer,
      yMeasureNameContainer,
      treeContainer,
      xAxisContainer,
      yAxisContainer,
    } = containers;
    const { offsetX, offsetY } = offsetConfig;
    const { isXGridShow, isYGridShow } = gridConfig;
    let { x, y } = positionsConfig;
    const { width, height } = sizeConfig;
    // 兼容单个图表的情况
    let { isXAxisShow = true, isYAxisShow = true } = axisConfig;
    let newX;
    const currentWidth = width / x.length;
    const currentHeight = height / y.length;
    x.forEach((xCurrent, xCursor) => {
      y.forEach((yCurrent, yCursor) => {
        const isCurrentYAxisShow = xCursor === 0 && isYAxisShow;
        const isCurrentXAxisShow = yCursor === y.length - 1 && isXAxisShow;
        const newOffsetConfig = {
          offsetX: offsetX + currentWidth * xCursor || 0,
          offsetY: offsetY + currentHeight * yCursor || 0,
        };

        this.renderIntervalCell({
          ...rest,
          positionConfig: { y: yCurrent, x: xCurrent },
          xMeasureNameContainer: xMeasureNameContainer
            .append('g')
            .attr('transform', `translate(${newOffsetConfig.offsetX},${0})`),
          yMeasureNameContainer: yMeasureNameContainer
            .append('g')
            .attr('transform', `translate(${0},${newOffsetConfig.offsetY})`),
          // 创建指标容器
          container: treeContainer
            .append('g')
            .attr('class', 'interval_cell')
            .attr(
              'transform',
              `translate(${newOffsetConfig.offsetX},${newOffsetConfig.offsetY})`
            ),
          gridContainer: treeContainer
            .append('g')
            .attr('class', 'interval_cell')
            // 相对于容器位置
            .attr(
              'transform',
              `translate(${newOffsetConfig.offsetX},${newOffsetConfig.offsetY})`
            ),
          xAxisContainer: xAxisContainer
            .append('g')
            .attr('class', 'x axis cell')
            .attr('transform', `translate(${newOffsetConfig.offsetX},${0})`),
          yAxisContainer: yAxisContainer
            .append('g')
            .attr('class', 'y axis cell')
            .attr('transform', `translate(${0},${newOffsetConfig.offsetY})`),
          sizeConfig: {
            width: currentWidth,
            height: currentHeight,
          },
          graphSizeConfig: {
            // 减去图表两侧的间距
            width: currentWidth,
            height: currentHeight,
          },
          gridConfig: {
            isXGridShow: y.length > 1 || isXGridShow,
            isYGridShow: x.length > 1 || isYGridShow,
          },
          axisConfig: {
            ...axisConfig,
            isXAxisShow: isCurrentXAxisShow,
            isYAxisShow: isCurrentYAxisShow,
          },
          offsetConfig: {
            offsetX: 0,
            offsetY: 0,
          },
        });
      });
    });
  }

  renderTreeLabel(
    container: GContainer,
    label: string,
    offsetConfig: OffsetConfig,
    isTranspose: boolean = false
  ) {
    const translate = `translate(${offsetConfig.offsetX}, ${offsetConfig.offsetY})`;
    const textContainer = container
      .append('text')
      .attr('fill', 'black')
      // .attr('x', offsetConfig.offsetX)
      // .attr('y', offsetConfig.offsetY)
      .attr('transform', translate)
      .text(label);
    if (isTranspose) {
      textContainer.attr('transform', `${translate}rotate(270)`);
    }
  }
  renderTreeCell(config: TreeCellProps, level: number = 0) {
    const {
      containers,
      sizeConfig,
      xCategoryValues,
      xCategorys,
      yCategorys,
      offsetConfig,
      yCategoryValues,
      data,
      ...rest
    } = config;
    const { offsetX, offsetY } = offsetConfig;
    const { width, height } = sizeConfig;
    const {
      xColLabelContainer,
      yColLabelContainer,
      treeContainer,
    } = containers;
    if (
      level === xCategoryValues.length + yCategoryValues.length ||
      (xCategoryValues.length === 0 && yCategoryValues.length === 0)
    ) {
      //  已经到了最底层， 渲染图表
      this.renderGroup({
        ...rest,
        containers: {
          ...containers,
          treeContainer: treeContainer
            .append('g')
            .attr('class', 'col_tree_cell'),
        },
        data: data,
        offsetConfig,
        sizeConfig,
        gridConfig: {
          isXGridShow: yCategoryValues.length > 0,
          isYGridShow: xCategoryValues.length > 0,
        },
        maxAxisSize: {
          maxAxisWidth: 0,
          maxAxisHeight: 0,
        },
      });
    } else {
      // 渲染树结构框架
      let currentValue = [] as string[];
      let currentCategory;
      let offest;
      let drawDirection =
        level < xCategoryValues.length
          ? ScrollDirection.HORIZONTAL
          : ScrollDirection.VERTICAL;
      if (drawDirection === ScrollDirection.HORIZONTAL) {
        currentValue = xCategoryValues[level];
        currentCategory = xCategorys[level];
        offest = width / currentValue.length;
      } else {
        currentValue = yCategoryValues[level - xCategoryValues.length];
        currentCategory = yCategorys[level - xCategoryValues.length];
        offest = height / currentValue.length;
      }

      currentValue.forEach((current, currentIndex) => {
        const currentOffsetX =
          drawDirection === ScrollDirection.HORIZONTAL
            ? currentIndex * offest + offsetX
            : offsetX;
        const currentOffsetY =
          drawDirection === ScrollDirection.VERTICAL
            ? currentIndex * offest + offsetY
            : offsetY;
        const currentHeight =
          drawDirection === ScrollDirection.VERTICAL ? offest : height;
        const currentWidth =
          drawDirection === ScrollDirection.HORIZONTAL ? offest : width;
        const isYAxisShow =
          drawDirection === ScrollDirection.HORIZONTAL
            ? currentIndex === 0
            : true;
        const isXAxisShow =
          drawDirection === ScrollDirection.VERTICAL
            ? currentIndex === currentValue.length - 1
            : true;

        let contentContaienr;
        let labelOffset;
        // 渲染标签
        if (drawDirection === ScrollDirection.HORIZONTAL) {
          contentContaienr = xColLabelContainer
            .append('g')
            .attr(
              'transform',
              `translate(${currentOffsetX}, ${level * this.labelSize})`
            );
          labelOffset = {
            offsetX: currentWidth / 2,
            offsetY: this.labelSize / 2,
          };
          this.drawLine(contentContaienr, [
            new Point(currentWidth, 0),
            new Point(currentWidth, this.labelSize),
          ]);
        } else {
          contentContaienr = yColLabelContainer
            .append('g')
            .attr(
              'transform',
              `translate(${level * this.labelSize}, ${currentOffsetY})`
            );
          labelOffset = {
            offsetX: this.labelSize / 2,
            offsetY: currentHeight / 2,
          };
        }
        contentContaienr
          .append('rect')
          .attr('class', 'tree_container_mask')
          .attr('fill', 'transparent')
          .attr('width', currentWidth)
          .attr('height', 30);
        this.renderTreeLabel(
          contentContaienr,
          current[currentCategory.code],
          labelOffset
        );
        this.renderTreeCell(
          {
            ...config,
            data: data.filter(
              item =>
                item[currentCategory.code] === current[currentCategory.code]
            ),
            sizeConfig: {
              width: currentWidth,
              height: currentHeight,
            },
            axisConfig: {
              ...config.axisConfig,
              isYAxisShow,
              isXAxisShow,
            },
            offsetConfig: {
              offsetX: currentOffsetX,
              offsetY: currentOffsetY,
            },
          },
          level + 1
        );
      });
    }
  }

  getScrollType(direction: ScrollDirection) {
    return this[`scrollDistance_${direction}`] || 0;
  }

  setScrollSize(direction: ScrollDirection, size: number) {
    this[`scrollDistance_${direction}`] = size;
  }

  viewScroll(
    target: GContainer,
    direction: ScrollDirection,
    scrollDistance: number
  ) {
    if (direction === ScrollDirection.HORIZONTAL) {
      target.attr('transform', `translate(${-scrollDistance}, ${0})`);
    } else {
      target.attr('transform', `translate(${0}, ${-scrollDistance})`);
    }
  }

  graphScroll(
    target: GContainer,
    xScrollDistance: number,
    yScrollDistance: number
  ) {
    target.attr(
      'transform',
      `translate(${-xScrollDistance}, ${-yScrollDistance})`
    );
  }

  scrollerScroll(
    target: GContainer,
    direction: ScrollDirection,
    scrollDistance: number
  ) {
    if (target) {
      if (direction === ScrollDirection.HORIZONTAL) {
        target.attr('x', scrollDistance);
      } else {
        target.attr('y', scrollDistance);
      }
    }
  }
  renderScroller(config: ScrollerConfig) {
    let {
      containerSizeConfig,
      viewContainer,
      scrollBarContainer,
      colLabelContainer,
      axisContainer,
      gridContainer,
      realSizeConfig,
      direction = ScrollDirection.HORIZONTAL,
    } = config;

    // 如果实际宽度和视窗宽度一致，则不需要渲染
    if (
      direction === ScrollDirection.HORIZONTAL
        ? containerSizeConfig.width === realSizeConfig.width
        : containerSizeConfig.height === realSizeConfig.height
    ) {
      // 第一次，默认滚动到最小滚动距离
      return;
    }
    let size = this.scrollSize;
    // 滚动条
    let scrollBar;
    let scrollInfo;
    let scrollHeight;
    let scrollWidth;
    let scrollX;
    let scrollY;
    let scrollContainerWidth;
    let scrollContainerHeight;
    let scrollLinePointLeft: [Point, Point];
    let scrollLinePointRight: [Point, Point];

    const scrollInnerSize = size - 2 * this.scrollGap;
    if (direction === ScrollDirection.HORIZONTAL) {
      scrollInfo = getScollInfo(
        containerSizeConfig.width,
        realSizeConfig.width
      );
      scrollHeight = scrollInnerSize;
      scrollWidth = scrollInfo.scrollBarSize;
      scrollX = 0;
      scrollY = this.scrollGap;
      scrollContainerWidth = realSizeConfig.height;
      scrollContainerHeight = size;
      scrollLinePointLeft = [
        new Point(0, 0),
        new Point(realSizeConfig.width, 0),
      ];
      scrollLinePointRight = [
        new Point(0, size),
        new Point(realSizeConfig.width, size),
      ];
    } else {
      scrollInfo = getScollInfo(
        containerSizeConfig.height,
        realSizeConfig.height
      );
      scrollHeight = scrollInfo.scrollBarSize;
      scrollWidth = scrollInnerSize;
      scrollX = this.scrollGap;
      scrollY = 0;
      scrollContainerWidth = size;
      scrollContainerHeight = realSizeConfig.width;
      scrollLinePointLeft = [
        new Point(0, 0),
        new Point(0, realSizeConfig.height),
      ];
      scrollLinePointRight = [
        new Point(size, 0),
        new Point(size, realSizeConfig.height),
      ];
    }
    const xPositionFunc = getViewScrollDistance(
      containerSizeConfig.width,
      realSizeConfig.width
    );
    const yPositionFunc = getViewScrollDistance(
      containerSizeConfig.height,
      realSizeConfig.height
    );
    // 创建滚动条

    const updateScrollPosition = (diff: number) => {
      const beforeScrollDistance = this.getScrollType(direction);
      let scrollDistance = diff + beforeScrollDistance;
      // 防止滚动出去
      scrollDistance = Math.max(0, scrollDistance);
      scrollDistance = Math.min(scrollInfo.maxScroll, scrollDistance);
      // 设置当前的偏移距离
      this.setScrollSize(direction, scrollDistance);

      const xPosition = xPositionFunc(
        this.getScrollType(ScrollDirection.HORIZONTAL)
      );
      const yPosition = yPositionFunc(
        this.getScrollType(ScrollDirection.VERTICAL)
      );
      let viewPosition = 0;
      let scrollBarPosition = 0;
      if (direction === ScrollDirection.HORIZONTAL) {
        viewPosition = xPosition.viewPosition;
        scrollBarPosition = xPosition.scrollBarPosition;
      } else {
        viewPosition = yPosition.viewPosition;
        scrollBarPosition = yPosition.scrollBarPosition;
      }
      this.graphScroll(
        viewContainer,
        xPosition.viewPosition,
        yPosition.viewPosition
      );
      this.graphScroll(
        gridContainer,
        xPosition.viewPosition,
        yPosition.viewPosition
      );
      this.viewScroll(colLabelContainer, direction, viewPosition);
      this.viewScroll(axisContainer, direction, viewPosition);
      this.scrollerScroll(scrollBar, direction, scrollBarPosition);
    };

    // 滚动条背景
    scrollBarContainer
      .append('rect')
      .attr('fill', color.SCROLL_CONTAINER)
      .attr('width', scrollContainerWidth)
      .attr('height', scrollContainerHeight);

    // 滚动条的线
    this.drawLine(scrollBarContainer, scrollLinePointLeft, {
      size: 1,
    });
    this.drawLine(scrollBarContainer, scrollLinePointRight, {
      size: 1,
    });

    // 滚动条
    scrollBar = scrollBarContainer
      .append('rect')
      .attr('fill', color.SCROLL_BAR)
      .attr('height', scrollHeight)
      .attr('width', scrollWidth)
      .attr('rx', scrollInnerSize / 2)
      .attr('ry', scrollInnerSize / 2)
      .attr('x', scrollX)
      .attr('y', scrollY);

    // 滑轮滚动事件
    this.dom.addEventListener(
      'wheel',
      (
        e: {
          deltaY: number;
          deltaX: number;
          preventDefault: () => void;
        } = {} as { deltaY: number; deltaX: number; preventDefault: () => void }
      ) => {
        const { deltaY, deltaX } = e;
        updateScrollPosition(
          direction === ScrollDirection.HORIZONTAL ? deltaX : deltaY
        );
        e.preventDefault();
      }
    );
    // 拖拽事件
    const dragBehaviour = d3.drag().on('drag', () => {
      const ds =
        direction === ScrollDirection.HORIZONTAL ? d3.event.dx : d3.event.dy;
      updateScrollPosition(ds);
    });
    scrollBar.call(dragBehaviour);
  }

  renderTree(config: TreeProps) {
    let {
      containers,
      data,
      dimensionValuesConfig,
      dimensionConfig,
      positionsConfig,
      axisConfig,
      sizeConfig,
      ...rest
    } = config;
    const { width, height } = sizeConfig;
    const { x, y } = positionsConfig;
    const { x: xCategorys, y: yCategorys } = dimensionConfig;
    const { isXShowScroll, isYShowScroll } = axisConfig;
    const { x: xCategoryValues, y: yCategoryValues } = dimensionValuesConfig;
    this.renderTreeCell({
      ...rest,
      data: data,
      containers: containers,
      positionsConfig: {
        x: x,
        y: y,
      },
      sizeConfig: {
        width: width,
        height: height,
      },
      xCategorys,
      yCategorys,
      axisConfig: {
        isXShowScroll: isXShowScroll,
        isYShowScroll: isYShowScroll,
      },
      xCategoryValues: xCategoryValues,
      yCategoryValues: yCategoryValues,
    });
  }

  measureAxisSize(
    container: GContainer,
    width: number,
    type: AxisType,
    cells: Cell[]
  ) {
    let size = 0;
    cells.forEach(cell => {
      const currentSize = this.drawAxis(container, width, type, cell, true);
      size = currentSize > size ? currentSize : size;
    });
    return size;
  }

  /**
   * 获取单元图表组件的最小size
   *
   * @abstract
   * @memberof BaseGeom2
   */
  abstract getMinSize(cell: Cell[]);
  produceConfig(cell: Cell[], size: number) {
    let { categorys, cells } = produceConfig(cell);

    return {
      categorys,
      cells,
    };
  }

  produceSizeConfig(
    data: DataSource,
    cells: Cell[],
    categorys: Cell[],
    size: number
  ) {
    // 没有描述维度或者指标的时候
    const minWidth = this.getMinSize(cells);
    let xNums = countTreeData(
      data,
      categorys.map(item => item.code)
    );
    let realSize = minWidth * xNums;
    // 当实际宽度大于图表绘制区域
    const isShowScroll = size < realSize;

    // 如果图表的实际绘制宽度还没有图标展示的宽度大，则自适应
    if (!isShowScroll) {
      realSize = size;
    }
    return {
      isShowScroll: isShowScroll,
      size: realSize,
    };
  }

  beforeRender(x: Cell[], y: Cell[]) {
    console.warn('beforeRender');
  }

  getScrollSize(axisConfig: AxisConfig) {
    const { isXShowScroll, isYShowScroll } = axisConfig;
    // 滚动条大小
    let scrollHeight = 0;
    let scrollWidth = 0;
    // 减去滚动条的宽度和高度
    if (isXShowScroll) {
      scrollHeight = this.scrollSize;
    }
    if (isYShowScroll) {
      scrollWidth = this.scrollSize;
    }
    return {
      scrollWidth,
      scrollHeight,
    };
  }

  getMeasureNameContainerSize(x: Cell[], y: Cell[]) {
    let yMeasureNameWidth = 0;
    let xMeasureNameHeight = 0;
    if (checkIsLinear(x)) {
      xMeasureNameHeight = this.labelSize;
    }
    if (checkIsLinear(y)) {
      xMeasureNameHeight = this.labelSize;
    }
    return {
      xMeasureNameHeight: xMeasureNameHeight,
      yMeasureNameWidth: yMeasureNameWidth,
    };
  }

  render() {
    const scales = produceScale(this.data, this.cols, this.rows);
    // 产生比例尺
    let width = this.width;
    let height = this.height;
    // 生成基础配置
    let { categorys: yCategorys, cells: yCells } = this.produceConfig(
      scales.y,
      height
    );

    let { categorys: xCategorys, cells: xCells } = this.produceConfig(
      scales.x,
      width
    );

    // 调整展示规则, 最小cell的x,y都为维度时，调整展示规则
    if (checkIsCategory(yCells) && checkIsCategory(xCells)) {
      xCategorys = xCategorys.concat(xCells);
      xCells = [];
    }

    const yCategoryValues = getCategoryValues(
      this.data,
      yCategorys.map(item => item.code)
    );
    const xCategoryValues = getCategoryValues(
      this.data,
      xCategorys.map(item => item.code)
    );

    const positionConfig = { x: xCells, y: yCells };
    const dimensionsConfig = { x: xCategorys, y: yCategorys };
    const sizeConfig = { width, height };
    const config = {
      data: this.data,
      positionConfig,
      // realSizeConfig,
      axisConfig: {},
      sizeConfig,
      dimensionsConfig,
    } as Config;
    // before render 生命周期
    this.beforeRender(xCells, yCells);

    // 初始化各个区块大小
    const sizeOptions = new SizeOptions(this.container, config);
    const layout = new Layout(this.container, {
      ...config,
      sizeOptions: sizeOptions.get(),
    });
    const containers = layout.get();
    const treeContainer = (containers.get(
      ELEMENT_TYPE.GEOM
    ) as ContaienrOptions).get();
    const xAxisContainer = (containers.get(
      ELEMENT_TYPE.AXIS
    ) as DoubleContainerOptions)
      .getXOptions()
      .get();
    const yAxisContainer = (containers.get(
      ELEMENT_TYPE.AXIS
    ) as DoubleContainerOptions)
      .getYOptions()
      .get();
    const xColLabelContainer = (containers.get(
      ELEMENT_TYPE.FACET_LABEL
    ) as DoubleContainerOptions)
      .getXOptions()
      .get();
    const yColLabelContainer = (containers.get(
      ELEMENT_TYPE.FACET_LABEL
    ) as DoubleContainerOptions)
      .getYOptions()
      .get();
    const xMeasureNameContainer = (containers.get(
      ELEMENT_TYPE.MEASURE_LABEL
    ) as DoubleContainerOptions)
      .getXOptions()
      .get();
    const yMeasureNameContainer = (containers.get(
      ELEMENT_TYPE.MEASURE_LABEL
    ) as DoubleContainerOptions)
      .getYOptions()
      .get();
    const yScrollBarContainer = (containers.get(
      ELEMENT_TYPE.SCROLLER
    ) as DoubleContainerOptions)
      .getYOptions()
      .get();
    const xScrollBarContainer = (containers.get(
      ELEMENT_TYPE.SCROLLER
    ) as DoubleContainerOptions)
      .getXOptions()
      .get();
    const gridContainer = (containers.get(
      ELEMENT_TYPE.GRID
    ) as ContaienrOptions).get();
    // 遮罩
    const mask = treeContainer
      .append('rect')
      .attr('class', 'tree_container_mask')
      .attr('fill', 'transparent')
      .attr('width', width)
      .attr('height', height);

    const geom = sizeOptions.get().get(ELEMENT_TYPE.GEOM) as ElementOptions;

    const {
      size: xRealSize,
      isShowScroll: isXShowScroll,
    } = this.produceSizeConfig(this.data, xCells, xCategorys, geom.getWidth());
    const {
      size: yRealSize,
      isShowScroll: isYShowScroll,
    } = this.produceSizeConfig(this.data, yCells, yCategorys, geom.getHeight());

    this.renderTree({
      data: this.data,
      sizeOptions: sizeOptions,
      containers: {
        xMeasureNameContainer: xMeasureNameContainer,
        yMeasureNameContainer: yMeasureNameContainer,
        gridContainer: gridContainer,
        treeContainer: treeContainer.append('g').attr('class', 'conetnt'),
        xScrollBarContainer: xScrollBarContainer
          .append('g')
          .attr('class', 'content'),
        yScrollBarContainer: yScrollBarContainer
          .append('g')
          .attr('class', 'content'),
        xColLabelContainer: xColLabelContainer
          .append('g')
          .attr('class', 'content'),
        yColLabelContainer: yColLabelContainer
          .append('g')
          .attr('class', 'content'),
        xAxisContainer: xAxisContainer.append('g').attr('class', 'content'),
        yAxisContainer: yAxisContainer.append('g').attr('class', 'content'),
      },
      offsetConfig: {
        offsetX: 0,
        offsetY: 0,
      },

      axisConfig: {
        isXShowScroll,
        isYShowScroll,
      },
      dimensionValuesConfig: {
        x: xCategoryValues,
        y: yCategoryValues,
      },
      dimensionConfig: {
        x: xCategorys,
        y: yCategorys,
      },
      positionsConfig: {
        x: xCells,
        y: yCells,
      },
      sizeConfig: {
        width: xRealSize,
        height: yRealSize,
      },
    });

    // 创建树容器
    this.renderScroller({
      container: xScrollBarContainer,
      gridContainer,
      colLabelContainer: xColLabelContainer,
      viewContainer: treeContainer,
      axisContainer: xAxisContainer,
      scrollBarContainer: xScrollBarContainer,
      realSizeConfig: {
        width: xRealSize,
        height: yRealSize,
      },
      containerSizeConfig: {
        width: geom.getWidth(),
        height: geom.getHeight(),
      },
    });
    this.renderScroller({
      container: yScrollBarContainer,
      viewContainer: treeContainer,
      gridContainer,
      colLabelContainer: yColLabelContainer,
      scrollBarContainer: yScrollBarContainer,
      axisContainer: yAxisContainer,
      realSizeConfig: {
        width: xRealSize,
        height: yRealSize,
      },
      containerSizeConfig: {
        width: geom.getWidth(),
        height: geom.getHeight(),
      },
      direction: ScrollDirection.VERTICAL,
    });
    const {
      x: treeContainerX,
      y: treeContainerY,
    } = (mask as any)._groups[0][0].getBoundingClientRect();
    // 渲染网格
    if (checkIsLinear(xCells)) {
      (xAxisContainer.selectAll('line') as any)._groups[0].forEach(select => {
        const { x: tickX } = select.getBoundingClientRect();
        const currentX = tickX - treeContainerX;
        this.drawLine(
          gridContainer,
          [new Point(currentX, 0), new Point(currentX, yRealSize)],
          { size: 1 }
        );
      });
    }

    if (checkIsLinear(yCells)) {
      (yAxisContainer.selectAll('line') as any)._groups[0].forEach(select => {
        const { y: tickY } = select.getBoundingClientRect();
        const currentY = tickY - treeContainerY;
        this.drawLine(
          gridContainer,
          [new Point(0, currentY), new Point(xRealSize, currentY)],
          { size: 1 }
        );
      });
    }
  }

  abstract transformData(
    data: DataSource,
    tranpose: DIRECTION,
    positionConfig: PositionConfig,
    sizeConfig: SizeConfig
  );

  getScale(cell: Cell, size: number) {
    return cell ? getScale(cell, size) : false;
  }

  abstract drawGraph(
    container: GContainer,
    data: any[],
    sizeConfig: SizeConfig
  );

  drawAxis(
    container: GContainer,
    size: number,
    type: AxisType,
    cell: Cell,
    isJustMeasure: boolean = false
  ) {
    // container.append('rect').attr('fill', 'blue').attr('width', size).attr('height', 10);
    console.log('drawAxis', size);
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
  renderIntervalByMatrix(config: IntervalGraphConfig, tranpose: DIRECTION) {
    let { container, data, sizeConfig, positionConfig } = config;
    // 创建cell 容器层级
    const cellContent = container.append('g').attr('class', 'cell_content');
    // 数据转化
    const newData = this.transformData(
      data,
      tranpose,
      positionConfig,
      sizeConfig
    );

    // 图形绘制
    this.drawGraph(cellContent, newData, sizeConfig);
  }

  drawLine(
    cotnainer: GContainer,
    points: [Point, Point],
    config?: { size: number }
  ) {
    const [p1, p2] = points;
    const { size = 2 } = config || {};
    cotnainer
      .append('line')
      .style('stroke', color.GRID) // colour the line
      .style('stroke-width', size) // colour the line
      .attr('x1', p1.x) // x position of the first end of the line
      .attr('y1', p1.y) // y position of the first end of the line
      .attr('x2', p2.x) // x position of the second end of the line
      .attr('y2', p2.y);
  }

  abstract getPadding();
  renderIntervalCell(config: CellProps) {
    let {
      data,
      container,
      yAxisContainer,
      xAxisContainer,
      gridContainer,
      sizeOptions,
      gridConfig,
      positionConfig,
      sizeConfig,
      graphSizeConfig,
      axisConfig,
      xMeasureNameContainer,
      yMeasureNameContainer,
    } = config;
    let { width, height } = sizeConfig;
    const { isXGridShow, isYGridShow } = gridConfig;
    let { x, y } = positionConfig;
    let { isXAxisShow, isYAxisShow } = axisConfig;
    // 转置类型
    let tranpose;
    const [
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    ] = this.getPadding();
    let drawWidth = graphSizeConfig.width;
    let drawHeight = graphSizeConfig.height;
    let drawOffsetX = 0;
    let drawOffsetY = 0;
    const yAxisCellContainer = yAxisContainer
      .append('g')
      .attr('class', 'y axis');
    const xAxisCellContainer = xAxisContainer
      .append('g')
      .attr('class', 'x axis');
    // 如果x轴离散，或者x 轴和y轴同时线性，则为水平的图
    if (
      checkIsCategory(x) ||
      (checkIsLinear(x) && checkIsLinear(y)) ||
      (checkIsLinear(y) && !x)
    ) {
      tranpose = DIRECTION.BL;
    } else {
      tranpose = DIRECTION.LB;
    }
    const horizontalPaddingWidth = paddingLeft + paddingRight;
    const horizontalPaddingHeight = paddingTop + paddingBottom;
    // 柱状图 作为横轴，可能会找bandSize / 2, 这里进行视图优化
    if (tranpose === DIRECTION.BL) {
      if (checkIsLinear(x)) {
        drawWidth = width - horizontalPaddingWidth;
        drawOffsetX = paddingLeft;
      }
    } else if (tranpose === DIRECTION.LB) {
      if (checkIsLinear(y)) {
        drawHeight = height - horizontalPaddingHeight;
        drawOffsetY = paddingTop;
      }
    }

    const measureLable = sizeOptions
      .get()
      .get(ELEMENT_TYPE.MEASURE_LABEL) as DoubleElementOptions;
    // 渲染单个图表的时候，制造的undefined
    if (isYAxisShow) {
      yAxisCellContainer
        .attr('transform', `translate(${0}, ${drawOffsetY})`)
        .attr('fill', 'black');
      this.drawAxis(yAxisCellContainer, drawHeight, AxisType.y, y);
      if (y) {
        this.renderTreeLabel(
          yMeasureNameContainer,
          y.code,
          {
            offsetX: measureLable.getY().getWidth() / 2,
            offsetY: height / 2,
          },
          true
        );
      }
    }
    if (isXAxisShow) {
      xAxisCellContainer
        .attr('transform', `translate(${drawOffsetX}, ${0})`)
        .attr('fill', 'black');
      this.drawAxis(xAxisCellContainer, drawWidth, AxisType.x, x);

      if (x) {
        this.renderTreeLabel(xMeasureNameContainer, x.code, {
          offsetX: width / 2,
          offsetY: measureLable.getX().getHeight() / 2,
        });
      }
    }
    // TODO 需要删掉，调试用的 绘图容器mask(含padding)
    // container.append('rect').attr('width', width).attr('height', height).attr('fill', 'green');

    const cellContainer = container
      .append('g')
      .attr('class', 'graph')
      .attr('transform', `translate(${drawOffsetX}, ${drawOffsetY})`);

    // TODO 需要删掉，调试用的 实际绘图容器
    // cellContainer.append('rect').attr('width', drawWidth).attr('height', drawHeight).attr('fill', 'yellow');
    // 坐标轴绘制
    // horizontal
    if (isXGridShow) {
      this.drawLine(gridContainer, [
        new Point(0, height),
        new Point(width, height),
      ]);
    }
    // vertical
    if (isYGridShow) {
      this.drawLine(gridContainer, [
        new Point(width, 0),
        new Point(width, height),
      ]);
    }
    // 单元图表类型 x 轴 离散 2. x轴线性 3. x轴线性，y轴线性 4. x轴离散，y轴线性

    // 5. 进行绘图
    this.renderIntervalByMatrix(
      {
        data: data,
        positionConfig: { x, y },
        container: cellContainer,
        sizeConfig: { width: drawWidth, height: drawHeight },
      },
      tranpose
    );
  }
}

export enum DIRECTION {
  BL = 'bl',
  LB = 'lb',
}

export enum TREE_DIRECTION {
  HORIZONTAL = 'horizontal',
}
type ScaleType = ValueFn<SVGRectElement, any, string | number | boolean>;

export interface Config {
  container: GContainer;
  sizeOptions: Map<string, SizeInterface>;
  data: DataSource;
  sizeConfig: SizeConfig;
  realSizeConfig: SizeConfig;
  axisConfig: AxisConfig;
  positionConfig: PositionsConfig;
  dimensionsConfig: PositionsConfig;
}
export interface IntervalGraphConfig {
  data: Array<any>;
  container: GContainer;
  sizeConfig: SizeConfig;
  positionConfig: PositionConfig;
}

export enum ScrollDirection {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export type TreeCellProps = {
  containers: Containers;
  sizeOptions: SizeOptions;
  positionsConfig: PositionsConfig;
  /**
   * 树的深度
   *
   * @type {number}
   */
  xCategorys: Cell[];
  yCategorys: Cell[];
  xCategoryValues: string[][];
  yCategoryValues: string[][];
} & BaseCell;

export interface TreeData {
  key: string;
  values: Array<TreeData>;
}
export interface Containers {
  gridContainer: GContainer;
  treeContainer: GContainer;
  xMeasureNameContainer: GContainer;
  yMeasureNameContainer: GContainer;
  xColLabelContainer: GContainer;
  yColLabelContainer: GContainer;
  xScrollBarContainer: GContainer;
  yScrollBarContainer: GContainer;
  xAxisContainer: GContainer;
  yAxisContainer: GContainer;
}
export type TreeProps = {
  containers: Containers;
  dimensionConfig: PositionsConfig;
  dimensionValuesConfig: {
    x: string[][];
    y: string[][];
  };
  positionsConfig: PositionsConfig;
} & BaseCell;

export interface MaxAxisSize {
  maxAxisWidth: number;
  maxAxisHeight: number;
}
export type GroupCellProps = {
  positionsConfig: PositionsConfig;
  containers: Containers;
  gridConfig: GridConfig;
  maxAxisSize: MaxAxisSize;
} & BaseCell;
export type CellProps = {
  xMeasureNameContainer: GContainer;
  yMeasureNameContainer: GContainer;
  positionConfig: PositionConfig;
  yAxisContainer: GContainer;
  xAxisContainer: GContainer;
  gridContainer: GContainer;
  gridConfig: GridConfig;
  graphSizeConfig: SizeConfig;
  container: GContainer;
} & BaseCell;

export interface BaseCell {
  data: Array<any>;
  sizeOptions: SizeOptions;
  offsetConfig: OffsetConfig;
  sizeConfig: SizeConfig;
  axisConfig: AxisConfig;
  isShowAxis?: boolean;
}
// export interface;

export interface ScaleConfig {
  xAxisScale: AxisScale<AxisDomain>;
  yAxisScale: AxisScale<AxisDomain>;
}

export interface GridConfig {
  isXGridShow: boolean;
  isYGridShow: boolean;
}
export interface PositionConfig {
  x: Cell;
  y: Cell;
}

export interface DimensionConfig {
  x: Cell[];
  y: Cell[];
}

export interface PositionsConfig {
  x: Cell[];
  y: Cell[];
}
export interface SizeConfig {
  width: number;
  height: number;
}
export interface AxisConfig {
  isXShowScroll?: boolean;
  isYShowScroll?: boolean;
  isYAxisShow?: boolean;
  isXAxisShow?: boolean;
}
export interface OffsetConfig {
  offsetX: number;
  offsetY: number;
}
export interface ScrollerConfig {
  container: GContainer;
  /**
   * 滚动条容器
   *
   * @type {GContainer}
   * @memberof ScrollerConfig
   */
  scrollBarContainer: GContainer;
  /**
   * 视窗容器
   *
   * @type {GContainer}
   * @memberof ScrollerConfig
   */
  viewContainer: GContainer;
  gridContainer: GContainer;
  axisContainer: GContainer;
  colLabelContainer: GContainer;
  /**
   * 当前容器的实际宽度
   *
   * @type {SizeConfig}
   * @memberof ScrollerConfig
   */
  realSizeConfig: SizeConfig;
  /**
   * 当前视窗宽度
   *
   * @type {SizeConfig}
   * @memberof ScrollerConfig
   */
  containerSizeConfig: SizeConfig;
  /**
   * 滚动条方向
   *
   * @type {ScrollDirection}
   * @memberof ScrollerConfig
   */
  direction?: ScrollDirection;
}

export enum AxisType {
  x = 'x',
  y = 'y',
}

export type DataSource = any[];
