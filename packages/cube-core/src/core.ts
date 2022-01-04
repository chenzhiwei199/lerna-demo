import { Decimal } from 'decimal.js/decimal.min.js';
import createCube, { MomentCube } from './cube-core';
import { transformNode, calcRowData } from './tableCore';
export function encode(names) {
  return [...names].map(item => encodeURIComponent(item)).join('$');
}

export function decode(key) {
  return key.split('$').map(item => decodeURIComponent(item));
}

const aggrFunction = {
  sum(subset, mea) {
    let sum = 0;
    for (let i = 0, len = subset.length; i < len; i++) {
      sum = Decimal.add(sum, subset[i][mea] || 0).toNumber();
    }
    return sum;
  },
  max(subset, mea) {
    let max = 0;
    for (let i = 0, len = subset.length; i < len; i++) {
      let current = subset[i][mea];
      if (current > max) {
        max = current;
      }
      return max;
    }
  },
  avg(subset, mea) {
    let sum = 0;
    for (let i = 0, len = subset.length; i < len; i++) {
      sum = Decimal.add(sum, subset[i][mea] || 0).toNumber();
    }
    return sum / subset.length;
  },
};

/**
 * 获取聚合方法
 * @param {*} aggrType 聚合类型
 */
function getAggrFunction(aggrType = 'sum') {
  return aggrFunction[aggrType];
}

/**
 * 获取关键字段
 * @param {*} data
 * @param {*} key
 */
function getValues(data, key) {
  return data.map(item => {
    return item[key];
  });
}

/**
 * 根据指标创建计算map
 * @param {*} indicators
 */
function createCalcMapByIndicator(indicators) {
  return indicators.reduce((root, indicator) => {
    const key = indicator.value;
    root[key] = getAggrFunction(indicator.aggrType);
    return root;
  }, {});
}

/**
 * 创建聚合方法
 * @param {} indicators
 */
function createAggrFunction(indicators) {
  const indicatorAggrFuncMap = createCalcMapByIndicator(indicators);
  return (subset, measures) => {
    return measures.reduce((root, measure) => {
      const curAggrFunc =
        indicatorAggrFuncMap[measure] ||
        (() => {
          return 0;
        });
      root[measure] = curAggrFunc(subset, measure);
      return root;
    }, {});
  };
}

interface Column {
  label: string;
  value: string;
}
export default class Cube {
  cube: MomentCube<Column, Column>[];
  dataSource: any;
  dimensions: Column[];
  rowDimensions: Column[];
  colDimensions: Column[];
  indicators: Column[];
  needSumTree: boolean;
  exprIndicators: Column[];
  constructor(
    dataSource,
    rowDimensions,
    colDimensions,
    indicators,
    exprIndicators,
    needSumTree = false
  ) {
    this.cube = [];
    this.dataSource = dataSource;
    this.dimensions = rowDimensions.concat(colDimensions);
    this.rowDimensions = rowDimensions;
    this.colDimensions = colDimensions;
    this.indicators = indicators;
    this.needSumTree = needSumTree;
    this.exprIndicators = exprIndicators;
    this.init();
  }

  getDimension() {
    return this.dimensions;
  }

  init() {
    const colDimensions = this.colDimensions;
    // 兼容没有列维度的情况
    const length = colDimensions.length || 1;
    // cube 树
    for (let index = 0; index < length; index++) {
      const cube = createCube<Column, Column>({
        aggFunc: createAggrFunction(this.indicators),
        factTable: this.dataSource,
        dimensions: getValues(
          this.colDimensions
            .slice(0, length - index)
            .concat(this.rowDimensions),
          'value'
        ),
        measures: getValues(this.indicators, 'value'),
      });
      this.cube.push(cube);
      this.decorateExprIndicators(cube.tree, this.exprIndicators);
    }
  }

  get() {}

  updateData() {
    const colDimension = this.colDimensions;
    const length = colDimension.length;
    this.cube.forEach((cube, index) => {
      cube.setData({
        factTable: this.dataSource,
        dimensions: getValues(
          this.colDimensions
            .slice(0, length - index)
            .concat(this.rowDimensions),
          'value'
        ),
        measures: getValues(this.indicators, 'value'),
      });
      // 使用数据的地方会处理，不需要重复计算
      // this.decorateExprIndicators(cube.tree, this.exprIndicators);
    });
  }

  update({
    dataSource,
    rowDimensions,
    colDimensions,
    indicators,
    exprIndicators = [],
  }) {
    this.dataSource = dataSource;
    this.dimensions = rowDimensions.concat(colDimensions);
    this.rowDimensions = rowDimensions;
    this.colDimensions = colDimensions;
    this.indicators = indicators;
    this.exprIndicators = exprIndicators;
    this.updateData();
  }

  decorateExprIndicators(cube, exprIndicators) {
    cube._aggData = calcRowData(cube._aggData, exprIndicators);
    Array.from(cube.children.keys()).forEach(key => {
      this.decorateExprIndicators(cube.children.get(key), exprIndicators);
    });
  }

  getTableData(exprIndicator) {
    const currentCube = this.cube[0];
    if (currentCube.tree) {
      currentCube.tree._aggData = calcRowData(
        currentCube.tree._aggData,
        exprIndicator
      );
    }
    return (
      currentCube && transformNode(currentCube.tree, [], exprIndicator).children
    );
  }

  getDataByPath(path, key) {
    const pathArr = path === '' ? [] : decode(path);
    let current;
    let end = false;
    this.cube.forEach(cube => {
      if (!end) {
        current = cube.tree;
        pathArr.forEach(p => {
          if (!current) {
            return '-';
          }
          current = current.children.get(p);
        });

        if (current) {
          end = true;
        }
      }
    });

    return current ? current._aggData[key] : '-';
  }

  set() {}
}
