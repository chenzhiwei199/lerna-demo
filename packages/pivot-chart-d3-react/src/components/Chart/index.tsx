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
} from '../../global.d';
import SizeOptions, { ELEMENT_TYPE } from '../../help/SizeOptions';
import {
  produceScale,
  createAxisData,
  produceConfig,
  checkIsCategory,
  getCategoryValues,
  countTreeData,
} from '../../utils/chartUtils';
import { ElementOptions } from '../../help/ElementOptions';
import IntervalGeom from '../Geom/IntervalGeom';
import LineGeom from '../Geom/LineGeom';
import PointGeom from '../Geom/PointGeom';
import BaseGeom, { Padding } from '../Geom/BaseGeom';
import ChartRender from '../ChartRenderer';

export type FacetData = Array<{
  size: number;
  data: Array<{
    label: string;
  }>;
}>;
export interface ChartConfig {
  data: any[];
  // dataMap: any;
  padding: Padding;
  graphMaskId?: string;
  geomInstance: BaseGeom;
  sizeOptions: SizeOptions;
  positionsConfig: PositionsConfig;
  /**
   * 树的深度
   *
   * @type {number}
   */
  offsetConfig: OffsetConfig;
  realSizeConfig: SizeConfig;
  sizeConfig: SizeConfig;
  cellSizeConfig: SizeConfig;
  facetDataConfig: {
    x: FacetData;
    y: FacetData;
  };
  axisDataConfig: PositionsConfig;
  graphDataConfig: PositionsConfig;
  axisConfig: AxisConfig;
  dimensionValuesConfig: DimensionValueConfig;
  dimensionConfig: DimensionConfig;
  scrollOffsetConfig: OffsetConfig;
}

export interface ChartProps {
  data: any[];
  width: number;
  height: number;
  geom: 'interval' | 'scatter' | 'line' | 'pie' | 'point';
  rows: Cell[];
  cols: Cell[];
}
export interface ChartState {}

class Chart extends React.Component<ChartProps, ChartState> {
  constructor(props: ChartProps) {
    super(props);
    this.state = {};
  }
  public createTreeKeys(categorys: Cell[], categoryValues: string[][]) {
    const treeData = [] as string[][];
    function createData(dimensionKeys: string[] = [], level = 0) {
      if (level === categorys.length) {
        treeData.push(dimensionKeys);
      } else {
        const currentCategoryValue = categoryValues[level];
        const currentCategory = categorys[level];
        currentCategoryValue.forEach(categoryValue => {
          createData(
            [...dimensionKeys, categoryValue[currentCategory.code]],
            level + 1
          );
        });
      }
    }
    createData();
    return treeData;
  }

  public createTreeData(
    data: DataSource,
    keys: string[],
    categoryValues: string[][]
  ) {
    const dataMap = {};
    function createData(data, dimKeys = [] as any[], level = 0) {
      if (level === keys.length) {
        dimKeys.reduce((root, dimKey, dimLevel) => {
          const currentDataMap = root[dimKey];
          // 塞入数据
          if (dimLevel === dimKeys.length - 1) {
            root[dimKey] = data;
            // 最后一行，无意义
            return dataMap;
          } else {
            // 如果当前数据对象已经存在，则把当前对象传递下去
            if (currentDataMap) {
              return currentDataMap;
            } else {
              // 当前对象不存在，则创建对象并传递下去
              root[dimKey] = {};
              return root[dimKey];
            }
          }
        }, dataMap);
      } else {
        const currentCategoryValue = categoryValues[level];
        const currentKey = keys[level];
        currentCategoryValue.forEach(categoryValue => {
          const currentCategoryValue = categoryValue[currentKey];
          createData(
            data.filter(t => t[currentKey] === currentCategoryValue),
            [...dimKeys, currentCategoryValue],
            level + 1
          );
        });
      }
    }
    createData(data);
    return dataMap;
  }

  /**
   * createGroupData
   */
  public createGroupData(treeData: string[][], cells: Cell[]): any {
    const groupData = [] as { dimensionKeys: string[] }[];
    treeData.forEach(d => {
      if (cells.length === 0) {
        groupData.push({
          dimensionKeys: d,
        });
      } else {
        cells.forEach(cell => {
          groupData.push({
            ...cell,
            dimensionKeys: d,
          });
        });
      }
    });
    // 兼容，仅有单个行度量，或者列度量的情况
    return groupData.length === 0 ? [undefined] : groupData;
  }

  public creatSize(config: ChartConfig) {
    const { dimensionValuesConfig } = config;
  }
  public createConfig() {
    const { data, width, height, cols, rows } = this.props;
    const scales = produceScale(data, cols, rows);

    // 生成基础配置
    const { categorys: yCategorys, cells: yCells } = produceConfig(scales.y);

    let { categorys: xCategorys, cells: xCells } = produceConfig(scales.x);

    // 调整展示规则, 最小cell的x,y都为维度时，调整展示规则
    if (
      checkIsCategory(yCells.map(item => item.type)) &&
      checkIsCategory(xCells.map(item => item.type))
    ) {
      xCategorys = xCategorys.concat(xCells);
      xCells = [];
    }

    const yCategoryValues = getCategoryValues(
      data,
      yCategorys.map(item => item.code)
    );
    const xCategoryValues = getCategoryValues(
      data,
      xCategorys.map(item => item.code)
    );
    const positionConfig = { x: xCells, y: yCells };
    const dimensionsConfig = { x: xCategorys, y: yCategorys };
    const sizeConfig = { width, height };

    const geomInstance = this.getGeomInstance();

    const xGraphData = this.createGroupData(
      this.createTreeKeys(xCategorys, xCategoryValues),
      xCells
    );
    const yGraphData = this.createGroupData(
      this.createTreeKeys(yCategorys, yCategoryValues),
      yCells
    );
    // const mapData = this.createTreeData(data, [...xCategorys, ...yCategorys].map((item: Cell) => item.code), [...xCategoryValues, ...yCategoryValues]);
    const config = {
      data,
      positionConfig,
      axisConfig: {},
      sizeConfig,
      dimensionsConfig,
      graphDataConfig: {
        x: xGraphData,
        y: yGraphData,
      },
    } as Config;

    // 初始化各个区块大小
    const sizeOptions = new SizeOptions(config);
    const geom = sizeOptions.get().get(ELEMENT_TYPE.GEOM) as ElementOptions;

    const {
      size: xRealSize,
      isShowScroll: isXShowScroll,
    } = this.produceSizeConfig(
      data,
      geomInstance,
      xCells,
      xCategorys,
      geom.getWidth()
    );
    const {
      size: yRealSize,
      isShowScroll: isYShowScroll,
    } = this.produceSizeConfig(
      data,
      geomInstance,
      yCells,
      yCategorys,
      geom.getHeight()
    );

    const {
      size: cellWidth,
      data: xAxisData,
      facetData: xFacetData,
    } = createAxisData(xCategorys, xCategoryValues, xCells, xRealSize);
    const {
      size: cellHeight,
      data: yAxisData,
      facetData: yFacetData,
    } = createAxisData(yCategorys, yCategoryValues, yCells, yRealSize);
    return {
      data,
      geomInstance,
      sizeOptions,
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
      axisDataConfig: {
        x: xAxisData,
        y: yAxisData,
      },
      graphDataConfig: {
        x: xGraphData,
        y: yGraphData,
      },
      facetDataConfig: {
        x: xFacetData,
        y: yFacetData,
      },
      realSizeConfig: {
        width: xRealSize,
        height: yRealSize,
      },
      cellSizeConfig: {
        width: cellWidth,
        height: cellHeight,
      },
      sizeConfig: {
        width: Number(width),
        height: Number(height),
      },
    };
  }

  public getAxisData() {}
  public getGeom(type) {
    switch (type) {
      case 'interval':
        return IntervalGeom;
      case 'line':
        return LineGeom;
      case 'point':
        return PointGeom;
      default:
        return IntervalGeom;
    }
  }

  public getGeomInstance() {
    const { geom } = this.props;
    const GeomClass = this.getGeom(geom);
    const geomInstance = new GeomClass(this.props);
    return geomInstance;
  }
  public produceSizeConfig(
    data: DataSource,
    geomInstance: BaseGeom,
    cells: Cell[],
    categorys: Cell[],
    size: number
  ) {
    // 没有描述维度或者指标的时候
    const minWidth = geomInstance.getMinSize(cells);
    const xNums = countTreeData(
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
      isShowScroll,
      size: realSize,
    };
  }

  public render() {
    const { data, width, height } = this.props;
    const config = this.createConfig();
    const { dimensionConfig, positionsConfig } = config;
    const newConfig = {
      ...this.createConfig(),
    };
    const { x, y } = positionsConfig;
    if (x.length === 0 && y.length === 0) {
      return <svg />;
    }
    return (
      <ChartRender
        width={width}
        height={height}
        config={{
          ...newConfig,
          padding: [0, 0, 0, 0] as Padding,
          scrollOffsetConfig: {
            offsetX: 0,
            offsetY: 0,
          },
        }}
      />
    );
  }
}

export default Chart;
