import { Parser } from 'expr-eval';
import get from 'lodash/get';

export function calcRowData(data = {} as any, exprIndicators) {
  const parser = new Parser();
  data = exprIndicators.reduce((root, indicator) => {
    let value = 0 as number | null;
    let vaild = true;
    const currentExpression = indicator.expression;
    // parent 函数，严重耗时
    // const currentExpression = indicator.expression.replace(new RegExp(/parent\(\s*([a-zA-Z0-9_]*)\s*\)/), (word, $1) => {
    //   const value = get(node, `parent._aggData.${$1}`);
    //   if (value === undefined) {
    //     vaild = false;
    //   }
    //   return value;
    // });

    // 校验计算的参数
    const variables = Parser.parse(currentExpression).variables();
    variables.forEach(v => {
      if (!data[v] && data[v] !== 0) {
        vaild = false;
      }
    });

    if (vaild) {
      const parse = parser.parse(currentExpression);
      value = parse.evaluate(data);
      if (
        (!value && value !== 0) ||
        !Number.isFinite(value) ||
        Number.isNaN(value)
      ) {
        value = null;
      }
    } else {
      value = null;
    }
    root[indicator.value] = value;
    return root;
  }, data);
  return data;
}

enum SortType {
  ASC = 'asc',
  DESC = 'desc',
}
type DimSortConfig = { [key: string]: SortType };
/**
 * 将map转化为数组
 * @param {*} children
 * @param {*} names
 */
function transformMap2Array(
  childKey,
  children,
  names,
  exprIndicator = [],
  config: { dimSortConfig: DimSortConfig } = { dimSortConfig: {} }
) {
  // 维度排序预留的口子
  const { dimSortConfig } = config;
  const data = Array.from(children.keys()).map(key => {
    const item = children.get(key);
    item._aggData.name = key;
    // 构造唯一
    item._aggData.pivot_id_xxx = [...names, key].join('.');
    item._aggData = calcRowData(item._aggData, exprIndicator);
    return item;
  });
  const currentSortDim = dimSortConfig[childKey];
  if (!currentSortDim) {
    return data;
  }
  // 把数据按照维度进行排序
  data.sort((a, b) => {
    let sort = a > b ? 1 : -1;
    if (currentSortDim === 'asc') {
      sort = sort * -1;
    }
    return sort;
  });
  return data;
}

export function transformNode(
  node,
  names = [] as string[],
  exprIndicator,
  isTransform2Array = true,
) {
  // 取出节点数据
  let data = node._aggData || {};

  // 将子节点转化为数组
  const children = transformMap2Array(
    node.childKey,
    node.children,
    names,
    exprIndicator
  );
  if (children && children.length > 0) {
    // 如果有子点，将子节点重复按照节点转化规则进行转化, 并且凭借唯一id
    data.children = children.map(item => {
      return transformNode(
        item,
        [...names, get(item, ['_aggData', 'name'], '')] as string[],
        exprIndicator,
        isTransform2Array,
      );
    });
  }
  return data;
}

export function createDataSourceWithExprInd(dataSource = [], exprIndicator) {
  return dataSource.map(item => {
    return calcRowData(item, exprIndicator);
  });
}
