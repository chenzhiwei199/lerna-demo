import * as d3 from 'd3';
import { CellTypeEnum, PositionEnum, Cell } from '../Geom/BaseGeom';
import { ScaleBand, ScaleLinear, Axis } from 'd3';
import { PositionsConfig, AxisType } from '../Geom/BaseGeom2';
import { b2LAxisMatrix, getTransformMatrix } from './matrix';
import { Domain } from 'domain';

export function checkIsCategory(cells: Cell | Cell[]) {
  return check(
    cells,
    (cell: Cell) =>
      cell.type === CellTypeEnum.CATEGORY ||
      cell.type === CellTypeEnum.TIME_CATEGORY
  );
}

export function checkIsLinear(cells: Cell | Cell[]) {
  return check(cells, (cell: Cell) => cell.type === CellTypeEnum.LINEAR);
}

export function check(
  cell: Cell | Cell[],
  checkFunc: (cell: Cell) => boolean
): boolean {
  if (Array.isArray(cell)) {
    cell = cell as Cell[];
    return cell.some((currentCell: Cell) => check(currentCell, checkFunc));
  } else {
    cell = (cell || {}) as Cell;
    if (checkFunc(cell)) {
      return true;
    }
  }

  return false;
}

function createAxis(name: string) {
  switch (name) {
    case PositionEnum.ROW:
      return 'Left';
    case PositionEnum.COL:
      return 'Bottom';
    default:
      return 'Left';
  }
}

export function getScaleByType(type: string, min: number = 0, max: number) {
  switch (type) {
    case CellTypeEnum.LINEAR:
      return d3
        .scaleLinear()
        .range([min, max])
        .nice();
    case CellTypeEnum.CATEGORY:
      return d3.scaleBand().range([min, max]);
    default:
      return d3.scaleBand().range([min, max]);
  }
}

export enum AXIS_TYPE {
  LEFT = 'axisLeft',
  RIGHT = 'axisRight',
}

// export function getAxis(
//   scale: ScaleBand<string> | ScaleLinear<number, number>,
//   position: string
// ) {
//   const axisType = `axis${createAxis(position)}` as AXIS_TYPE;
//   return d3[axisType](scale);
// }

export function getScale(cell: Cell, max: number) {
  let scale;
  // WARN: 去掉了cell为空的校验，上面就不应该传入为空的cell
  if (checkIsLinear(cell)) {
    // 双轴线性
    scale = getScaleByType(cell.type, 0, max) as ScaleLinear<number, number>;
    scale = scale.domain(cell.range as number[]);
  } else if (checkIsCategory(cell)) {
    // x轴离散，y轴线性
    scale = getScaleByType(cell.type, 0, max) as ScaleBand<string>;
    scale = scale.domain(cell.range as string[]).padding(0.2);
  }
  return scale;
}

function createSets(data: Array<any>, key: string) {
  let sets = new Set();
  let arr = [] as any[];
  data.forEach(d => {
    if (!sets.has(d[key])) {
      arr.push(d[key]);
      sets.add(d[key]);
    }
  });
  return arr;
}

const produceRange = (data: Array<any>) => (cell: Cell) => {
  let range;
  const isCategory = checkIsCategory(cell);
  if (isCategory) {
    range = createSets(data, cell.code);
  } else {
    const min = d3.min(data, d => {
      return d[cell.code];
    });
    range = [
      min < 0 ? min : 0,
      d3.max(data, d => {
        return d[cell.code];
      }),
    ];
  }
  return {
    ...cell,
    range: range,
  };
};
export function produceScale(data: Array<any>, x: Array<Cell>, y: Array<Cell>) {
  return {
    x: x.map(produceRange(data)),
    y: y.map(produceRange(data)),
  } as PositionsConfig;
}

export function produceCategoryInfo(x: Array<Cell>) {
  let categorys = x.filter(checkIsCategory);
  const linears = x.filter(checkIsLinear);
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
export function produceConfig(x: Array<Cell>) {
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

// export function flattenCategoryValues(
//   root: string[] = [],
//   data: string[][],
//   categorys: Cell[],
//   level: number = 0
// ) : string[]{
//   let newRoot = [] as string[];
//   const currentCategory = categorys[level];
//   if (level >= data.length) {
//     return root;
//   }
//   if (level === 0) {
//     newRoot = data[level].map(item => item[currentCategory.code]);
//   }
//   if (level < data.length) {
//     root.forEach(t1 => {
//       data[level].forEach(t2 => {
//         newRoot.push(`${t1}-${t2[currentCategory.code]}`);
//       });
//     });
//   }
//   return flattenCategoryValues(newRoot, data, categorys, level + 1);
// }

export function getScollInfo(containerSize: number, realSize: number) {
  // 滚动条宽度 (容器宽度 / 实际宽度)  = 滚动条宽度 / 容器宽度
  const scrollBarSize = (containerSize / realSize) * containerSize;
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
) => (scrollDistance: number) => {
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
  let transform;
  let labelTransform;
  // WARN: 这里4种组合条件是少不了的
  if (checkIsCategory(cell)) {
    scale = getScale(cell, size) as ScaleBand<string>;
    if (type === AxisType.x) {
      axis = d3.axisBottom(scale);
    } else {
      axis = d3.axisLeft(scale);
    }
  } else {
    scale = getScale(cell, size) as ScaleLinear<number, number>;
    if (type === AxisType.x) {
      axis = d3.axisBottom(scale);
    } else {
      axis = d3.axisLeft(scale);
    }
  }

  if (type === AxisType.y) {
    const { axis: b2lMatrix, label: b2lLabelMaxtrix } = b2LAxisMatrix(size);
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

export function getCategoryValues(data: Array<any>, categorys: Array<string>) {
  let categoryValues = [] as any[][];
  categorys.forEach((category, index) => {
    let currentCategoryValues = [] as any[];
    let currentCategoryValuesSet = new Set();
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

export function countTreeData(data: Array<any>, keyArray: Array<string>) {
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
