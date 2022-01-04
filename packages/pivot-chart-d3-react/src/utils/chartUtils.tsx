import { ScaleLinear, ScaleBand } from 'd3';
import * as d3 from 'd3';
import { b2LAxisMatrix, getTransformMatrix, getNoneMatrix, MatrixType } from './matrix';
import {
  Cell,
  ScaleType,
  AxisType,
  PositionEnum,
  PositionsConfig,
  DIRECTION,
  DataSource,
  CellScaleType,
} from '../global.d';
import SizeOptions, { ELEMENT_TYPE, SizeInterface } from '../help/SizeOptions';
import Offset from '../help/Offset';

export function checkIsCategory(types: CellScaleType | CellScaleType[]) {
  return check(
    types,
    (type: CellScaleType) =>
      type === ScaleType.CATEGORY || type === ScaleType.TIME_CATEGORY
  );
}

export function checkIsLinear(types: CellScaleType | CellScaleType[]) {
  return check(types, (type: CellScaleType) => type === ScaleType.LINEAR);
}

export function check(
  types: CellScaleType | CellScaleType[],
  checkFunc: (type: CellScaleType) => boolean
): boolean {
  if (Array.isArray(types)) {
    return types.some((currentCell: CellScaleType) =>
      check(currentCell, checkFunc)
    );
  } else {
    types = (types || {}) as CellScaleType;
    if (checkFunc(types)) {
      return true;
    }
  }

  return false;
}

export function getScale(cell: Cell, max: number) {
  let scale;
  if (!cell || !cell.code) {
    return null;
  }
  if (checkIsLinear(cell.type)) {
    // 双轴线性
    scale = getScaleByType(cell.type, 0, max) as ScaleLinear<number, number>;
    scale = scale.domain(cell.range);
  } else if (checkIsCategory(cell.type)) {
    // x轴离散，y轴线性
    scale = getScaleByType(cell.type, 0, max) as ScaleBand<string>;
    scale = scale.domain(cell.range).padding(0.2);
  }
  return scale;
}

export function getScaleByType(type: string, min: number = 0, max: number) {
  switch (type) {
    case ScaleType.LINEAR:
      return d3
        .scaleLinear()
        .range([min, max])
        .nice(3);
    case ScaleType.CATEGORY:
      return d3.scaleBand().range([min, max]);
    default:
      return d3.scaleBand().range([min, max]);
  }
}

export function getAxis(
  type: DIRECTION,
  cell: Cell,
  size: number,
  isLabelRotate: boolean = false
) {
  const scale = getScale(cell, size);
  let axis;
  // 坐标轴举证变换
  let transform;
  // 调度
  let angle;
  let firstTextAnchor;
  let firstVerticalAnchor;
  let textAnchor;
  let verticalAnchor;
  const { axis: b2lMatrix } = b2LAxisMatrix(size);

  if (checkIsLinear(cell.type)) {
    if (type === DIRECTION.VERTICAL) {
      // 线性 & 垂直 = 首个坐标轴标签样式优化，画到x轴线之上
      firstVerticalAnchor = 'end';
    } else {
      // 线性 & 水平 = 首个坐标轴标签样式优化，画到y轴线之右
      firstTextAnchor = 'start';
    }
  } else {
    // 离散，标签旋转
    if (type === DIRECTION.HORIZONTAL && isLabelRotate) {
      (textAnchor = 'start'), (verticalAnchor = 'middle'), (angle = 90);
    }
  }

  // 根据方向不同，画不同的坐标轴
  if (type === DIRECTION.HORIZONTAL) {
    axis = d3.axisBottom(scale);
  } else {
    axis = d3.axisLeft(scale);
    transform = `matrix(${getTransformMatrix(b2lMatrix)})`;
  }
  return {
    // scale
    scale,
    // 标签
    axis,
    // 坐标轴变换
    transform,
    // 旋转角度
    angle,
    // 文本变化
    textAnchor,
    verticalAnchor,
    firstTextAnchor,
    firstVerticalAnchor,
  };
}

function createAxis(name: string) {
  switch (name) {
    case PositionEnum.ROW:
      return 'Left';
    case PositionEnum.COL:
      return 'Bottom';
    default:
      break;
  }
}
function createSets(data: any[], key: string) {
  const sets = new Set();
  const arr = [] as string[];
  data.forEach(d => {
    if (!sets.has(d[key])) {
      arr.push(d[key]);
      sets.add(d[key]);
    }
  });
  return arr;
}

const produceRange = (data: any[]) => (cell: Cell) => {
  let range;
  const isCategory = checkIsCategory(cell.type);
  if (isCategory) {
    range = createSets(data, cell.code);
  } else {
    const min = d3.min(data, d => d[cell.code]);
    range = [min < 0 ? min : 0, d3.max(data, d => d[cell.code])];
  }
  return {
    ...cell,
    range,
  };
};
export function produceScale(data: any[], x: Cell[], y: Cell[]) {
  return {
    x: x.map(produceRange(data)),
    y: y.map(produceRange(data)),
  } as PositionsConfig;
}

/**
 *
 * @param x
 */
export function produceCategoryInfo(x: Cell[]) {
  let categorys = x.filter(t => checkIsCategory(t.type));
  const linears = x.filter(t => checkIsLinear(t.type));
  // 为了展示， 没有线性值的情况， 如果线性值不存在，则双坐标轴都是离散值
  if (linears.length !== 0) {
    x = linears;
  } else if (categorys.length > 0) {
    x = categorys.slice(categorys.length - 1);
    categorys = categorys.slice(0, categorys.length - 1);
  }
  return { cell: x, categorys };
}
/**
 * 1.获取分面的维度 2.获取分面的深度 3. 获取一个方向分面的数量 4.获取当前最小cell的字段类型
 *
 * @export
 * @param {Array<any>} data
 * @param {Array<Cell>} x
 * @returns
 */
export function produceConfig(x: Cell[]) {
  const categoryInfo = produceCategoryInfo(x);
  const categorys = categoryInfo.categorys;
  return {
    categorys,
    cells: categoryInfo.cell,
  };
}

export function produceSizeConfig(size: number, nums: number, minSize: number) {
  let treeContainerWidth = size / nums;
  if (nums * minSize > size) {
    // 间距
    treeContainerWidth = minSize * nums;
  }
  const isXWidthControl = treeContainerWidth !== size;
  return {
    isControl: isXWidthControl,
    size: treeContainerWidth,
  };
}

export function flattenCategoryValues(
  root: string[] = [],
  data: string[][],
  categorys: Cell[],
  level: number = 0
) {
  let newRoot = [] as string[];
  const currentCategory = categorys[level];
  if (level >= data.length) {
    return root;
  }
  if (level === 0) {
    newRoot = data[level].map(item => item[currentCategory.code]);
  }
  if (level < data.length) {
    root.forEach(t1 => {
      data[level].forEach(t2 => {
        newRoot.push(`${t1}-${t2[currentCategory.code]}`);
      });
    });
  }
  return flattenCategoryValues(newRoot, data, categorys, level + 1);
}

export function getScollInfo(
  containerSize: number,
  realSize: number,
  minSize: number = 15
) {
  // 滚动条宽度 (容器宽度 / 实际宽度)  = 滚动条宽度 / 容器宽度
  let scrollBarSize = (containerSize / realSize) * containerSize;
  if (minSize > scrollBarSize) {
    scrollBarSize = minSize;
  }

  // 最大的滚动距离,
  const maxScroll = Math.max(containerSize - scrollBarSize, 0);
  // 视图最大的滚动距离
  const viewMaxScroll = realSize - containerSize;
  return {
    scrollBarSize,
    maxScroll,
    viewMaxScroll,
  };
}

export const getViewScrollDistance = (
  containerSize: number,
  realSize: number
) => scrollDistance => {
  const { scrollBarSize, maxScroll, viewMaxScroll } = getScollInfo(
    containerSize,
    realSize
  );
  // 视图滚动距离 (当前滚动距离 / 最大可滚距离) = 滚动比例    滚动比例 * 实际宽度 = 实际视图滚动距离
  const viewPosition = (scrollDistance / maxScroll) * viewMaxScroll || 0;
  // 视图滚动距离 (当前滚动距离 / 最大可滚距离) = 滚动比例    滚动比例 * 滚动条滚动区间范围 = 实际滚动条滚动距离
  const scrollBarPosition = (scrollDistance / maxScroll) * maxScroll || 0;
  return {
    viewPosition,
    scrollBarPosition,
  };
};

export const getAxisInfo = (type: AxisType, cell: Cell, size: number) => {
  let scale;
  let axis;
  // 坐标轴举证变换
  let transform;
  // 坐标轴标签举证变换
  let labelTransform;
  if (type === AxisType.x) {
    scale = getScale(cell, size);
    axis = d3.axisBottom(scale);
  } else {
    const { axis: b2lMatrix, label: b2lLabelMaxtrix } = b2LAxisMatrix(size);
    scale = getScale(cell, size);
    axis = d3.axisLeft(scale);
    transform = `matrix(${getTransformMatrix(b2lMatrix)})`;
    labelTransform = `matrix(${getTransformMatrix(b2lLabelMaxtrix)})`;
  }
  return {
    scale,
    axis,
    transform,
    labelTransform,
  };
};

export function getCategoryValues(data: any[], categorys: string[]) {
  const categoryValues = [] as any;
  categorys.forEach((category, index) => {
    const currentCategoryValues = [] as any;
    const currentCategoryValuesSet = new Set();
    data.forEach(currentData => {
      if (!currentCategoryValuesSet.has(currentData[category])) {
        currentCategoryValues.push(currentData);
        currentCategoryValuesSet.add(currentData[category]);
      }
    });
    categoryValues.push(currentCategoryValues);
  });
  return categoryValues;
}

export function countTreeData(data: any[], keyArray: string[]) {
  // 如果没有维度分隔，则高度为1
  if (keyArray.length === 0) {
    return 1;
  }
  const categoryValues = getCategoryValues(data, keyArray);
  let count = 1;
  categoryValues.forEach(values => {
    count = count * (values.length > 0 ? values.length : 1);
  });
  return count;
}

export function getGraphOffset(sizeOptions: SizeOptions) {
  const size = sizeOptions.get();
  const facetSize = size.get(ELEMENT_TYPE.FACET_LABEL) as SizeInterface;
  const measureSize = size.get(ELEMENT_TYPE.MEASURE_LABEL) as SizeInterface;
  const axisSize = size.get(ELEMENT_TYPE.AXIS) as SizeInterface;
  return new Offset(
    facetSize.getWidth() + measureSize.getWidth() + axisSize.getWidth(),
    facetSize.getHeight()
  );
}

export function getXAxisOffset(sizeOptions: SizeOptions) {
  const size = sizeOptions.get();
  const facetSize = size.get(ELEMENT_TYPE.FACET_LABEL) as SizeInterface;
  const measureSize = size.get(ELEMENT_TYPE.MEASURE_LABEL) as SizeInterface;
  const axisSize = size.get(ELEMENT_TYPE.AXIS) as SizeInterface;
  const graphSize = size.get(ELEMENT_TYPE.GEOM) as SizeInterface;
  return new Offset(
    facetSize.getWidth() + measureSize.getWidth() + axisSize.getWidth(),
    facetSize.getHeight() + graphSize.getHeight()
  );
}

export function getXFacetOffset(sizeOptions: SizeOptions) {
  const size = sizeOptions.get();
  const facetSize = size.get(ELEMENT_TYPE.FACET_LABEL) as SizeInterface;
  const measureSize = size.get(ELEMENT_TYPE.MEASURE_LABEL) as SizeInterface;
  const axisSize = size.get(ELEMENT_TYPE.AXIS) as SizeInterface;
  return new Offset(
    facetSize.getWidth() + measureSize.getWidth() + axisSize.getWidth(),
    0
  );
}

export function getYFacetOffset(sizeOptions: SizeOptions) {
  const size = sizeOptions.get();
  const facetSize = size.get(ELEMENT_TYPE.FACET_LABEL) as SizeInterface;
  return new Offset(0, facetSize.getHeight());
}

export function getXMeasureNameOffset(sizeOptions: SizeOptions) {
  const size = sizeOptions.get();
  const facetSize = size.get(ELEMENT_TYPE.FACET_LABEL) as SizeInterface;
  const measureSize = size.get(ELEMENT_TYPE.MEASURE_LABEL) as SizeInterface;
  const axisSize = size.get(ELEMENT_TYPE.AXIS) as SizeInterface;
  const graphSize = size.get(ELEMENT_TYPE.GEOM) as SizeInterface;
  return new Offset(
    facetSize.getWidth() + measureSize.getWidth() + axisSize.getWidth(),
    facetSize.getHeight() + graphSize.getHeight() + axisSize.getHeight()
  );
}

export function getYMeasureNameOffset(sizeOptions: SizeOptions) {
  const size = sizeOptions.get();
  const facetSize = size.get(ELEMENT_TYPE.FACET_LABEL) as SizeInterface;
  return new Offset(facetSize.getWidth(), facetSize.getHeight());
}

export function getYAxisOffset(sizeOptions: SizeOptions) {
  const size = sizeOptions.get();
  const facetSize = size.get(ELEMENT_TYPE.FACET_LABEL) as SizeInterface;
  const measureSize = size.get(ELEMENT_TYPE.MEASURE_LABEL) as SizeInterface;
  return new Offset(
    facetSize.getWidth() + measureSize.getWidth(),
    facetSize.getHeight()
  );
}

export interface AxisRowData {
  label: string;
}

/**
 * 获取坐标轴的数据
 * @param categorys
 * @param values
 * @param cells
 * @param size
 */
export function createAxisData(
  categorys: Cell[],
  values: string[][],
  cells: Cell[],
  size: number
) {
  const data = [] as (Cell & { label: string })[];
  const facetData = [] as { data: AxisRowData[]; size: number }[];
  let sum = 1;
  if (values.length === 0) {
    cells.forEach(cell => {
      data.push({
        ...cell,
        label: cell.code,
      });
    });
  } else {
    values.forEach((value, index) => {
      sum = sum * value.length;
      const facetCellData = [] as AxisRowData[];
      value.forEach(cur => {
        cells.forEach(cell => {
          data.push({
            ...cell,
            label: cell.code,
          });
        });
        facetCellData.push({
          label: cur[categorys[index].code],
        });
      });
      facetData.push({
        size: size / sum,
        data: facetCellData,
      });
    });
  }

  sum = sum * cells.length;
  return {
    size: size / sum,
    facetData,
    data,
  };
}

export function isRotate(xData: Cell[]) {
  let labelRotate = false;
  const xLength = xData.reduce((l, item) => {
    return l + (item && item.range ? item.range.length : 0);
  }, 0);
  if (xLength > 15) {
    labelRotate = true;
  }
  return labelRotate && checkIsCategory(xData[0].type);
}

const mathSign = value => {
  if (value === 0) {
    return 0;
  }
  if (value > 0) {
    return 1;
  }

  return -1;
};

/**
 * Get the ticks of an axis
 * @param  {Object}  axis The configuration of an axis
 * @param {Boolean} isGrid Whether or not are the ticks in grid
 * @param {Boolean} isAll Return the ticks of all the points or not
 * @return {Array}  Ticks
 */
export const getTicksOfAxis = (axis, isGrid, isAll) => {
  if (!axis) {
    return null;
  }
  const { scale } = axis;
  const { duplicateDomain, type, range } = axis;
  let offset =
    (isGrid || isAll) && type === 'category' && scale.bandwidth
      ? scale.bandwidth() / 2
      : 0;
  offset =
    axis.axisType === 'angleAxis'
      ? mathSign(range[0] - range[1]) * 2 * offset
      : offset;

  // The ticks setted by user should only affect the ticks adjacent to axis line
  if (isGrid && (axis.ticks || axis.niceTicks)) {
    return (axis.ticks || axis.niceTicks).map(entry => {
      const scaleContent = duplicateDomain
        ? duplicateDomain.indexOf(entry)
        : entry;

      return {
        coordinate: scale(scaleContent) + offset,
        value: entry,
        offset,
      };
    });
  }

  if (axis.isCategorial && axis.categoricalDomain) {
    return axis.categoricalDomain.map((entry, index) => ({
      coordinate: scale(entry),
      value: entry,
      index,
      offset,
    }));
  }

  if (scale.ticks && !isAll) {
    return scale.ticks(axis.tickCount).map(entry => ({
      coordinate: scale(entry) + offset,
      value: entry,
      offset,
    }));
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => ({
    coordinate: scale(entry) + offset,
    value: duplicateDomain ? duplicateDomain[entry] : entry,
    index,
    offset,
  }));
};


export function getMatrix(direction: DIRECTION, size: number) {
  const { axis: b2lMatrix } = b2LAxisMatrix(size);
  if(direction === DIRECTION.VERTICAL) {
    return b2lMatrix
  } else {
    return getNoneMatrix() as MatrixType[]
  }
}