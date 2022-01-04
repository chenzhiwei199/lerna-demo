export interface Cell {
  label: string;
  value: string;
  type?: MetricsType;
}
declare global {
  interface Window {
    _APIMAP_ENV: any;
  }
}

export type OperationMap<T> = {
  key: Operation;
};
export interface Operation {
  type: 'drill-down' | 'filter';
  drillDimension?: string;
  isTemporary?: boolean;
  filterData?: {
    key?: string;
    value?: Array<string>;
    op: 'equals' | 'notEquals' | 'contains' | 'notContains';
  };
}

export interface ChartProps {
  onOperationChange: (operation?: Operation) => void;
  operations: Operation[];
  filters: Filter[];
  rows: Column[];
  cols: Column[];
  dimensionAll: Array<{ label: string; value: string }>;
}

export interface BlockProps {
  id: number;
  operations?: Operation[];
  onOperationChange?: (operation?: Operation) => void;
  cols: Column[];
  rows: Column[];
  Cmp: React.ComponentClass<ChartProps>;
}

export enum MetricsType {
  DIMENSION = 'dimension',
  MEASURE = 'measure',
}
export interface Column {
  code: string;
  type: MetricsType.DIMENSION | MetricsType.MEASURE;
}
export interface Measure {
  code: string;
  type: 'base' | 'x' | 'y';
}

export interface Dimension {
  code: string;
  type?: 'base' | 'x' | 'y';
}

export interface Filter {
  member: string;
  operator: string;
  values: any;
}
