import * as React from 'react';
import data from './data';
import vegaEmbed from 'vega-embed';
import { Column, MetricsType } from '../../global';
const wrapSpec = {
  description: 'A simple bar chart with embedded data.',
  data: {
    values: data,
  } as any,
};

export interface ChartProps {
  rows: Column[];
  cols: Column[];
}

export interface VegaLiteProps {
  dataSource?: any[];
  config: ChartProps;
}

export interface VegaLiteState {}

export function check(
  cell: Column | Column[],
  checkFunc: (cell: Column) => boolean
) {
  if (Array.isArray(cell)) {
    cell = cell as Column[];
    return cell.some((currentCell: Column) => check(currentCell, checkFunc));
  } else {
    cell = (cell || {}) as Column;
    if (checkFunc(cell)) {
      return true;
    }
  }

  return false;
}

export function checkIsCategory(cells: Column | Column[]) {
  return check(cells, (cell: Column) => cell.type === MetricsType.DIMENSION);
}

export function checkIsLinear(cells: Column | Column[]) {
  return check(cells, (cell: Column) => cell.type === MetricsType.MEASURE);
}

export function produceCategoryInfo(x: Column[]) {
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

function getTypeByMetricsType(type) {
  switch (type) {
    case MetricsType.DIMENSION:
      return 'ordinal';
    case MetricsType.MEASURE:
      return 'quantitative';
    default:
      return 'ordinal';
  }
}

function generateSpec(rows, cols) {
  const { cell: rowCell, categorys: rowCategorys } = produceCategoryInfo(rows);
  const { cell: colCell, categorys: colCategorys } = produceCategoryInfo(cols);
  const repeats = {} as any;
  const x = {} as any;
  const y = {} as any;
  const facet = {} as any;
  // "facet": {"row": {"field": "Origin", "type": "nominal"}},
  const spec = {
    mark: 'bar',
  } as any;
  if (colCell.length > 1) {
    repeats.column = colCell.map((item: Column) => item.code);
    x.field = {
      repeat: 'column',
    };
    x.type = 'quantitative';
  } else {
    if (colCell.length === 1) {
      const currentCell = colCell[0];
      x.field = currentCell.code;
      x.type = getTypeByMetricsType(currentCell.type);
    }
  }
  if (rowCell.length > 1) {
    repeats.row = rowCell.map((item: Column) => item.code);
    y.field = {
      repeat: 'row',
    };
    y.type = 'quantitative';
  } else {
    if (rowCell.length === 1) {
      const currentCell = rowCell[0];
      y.field = currentCell.code;
      y.type = getTypeByMetricsType(currentCell.type);
    }
  }
  spec.encoding = {
    x,
    y,
    row:
      rowCategorys.length > 0
        ? {
            field: rowCategorys[0].code,
            type: 'nominal',
          }
        : undefined,
    col:
      colCategorys.length > 0
        ? {
            field: colCategorys[0].code,
            type: 'nominal',
          }
        : undefined,
  };
  if (Object.keys(repeats).length === 0) {
    return {
      ...wrapSpec,
      ...spec,
    };
  } else {
    return {
      ...wrapSpec,
      repeat: repeats,
      spec,
    };
  }
}

class VegaLite extends React.Component<VegaLiteProps, VegaLiteState> {
  constructor(props: VegaLiteProps) {
    super(props);
  }
  public componentDidMount() {
    this.update();
  }
  public componentDidUpdate() {
    this.update();
  }

  public update() {
    const { rows, cols } = this.props.config;
    const newSpec = generateSpec(rows, cols);
    console.log('newSpec', newSpec);
    vegaEmbed('#vis', newSpec);
  }
  public render() {
    return <div id={'vis'} />;
  }
}

export default VegaLite;
