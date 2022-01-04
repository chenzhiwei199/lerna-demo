import * as React from 'react';
import { Block } from '@alife/pivot-chart-d3-react';

import PureWrappr from '../HOC/PureWrappr';
import { ChartProps, MetricsType } from '../global';

export interface AnyChartState {}

export interface AnyChartProps extends ChartProps {
  dataSource: any;
}
class AnyChart extends React.Component<AnyChartProps, AnyChartState> {
  constructor(props: AnyChartProps) {
    super(props);
  }
  public render() {
    const { dataSource, rows, cols } = this.props;
    return (
      <Block
        index={1}
        data={dataSource}
        config={{
          width: 1000,
          height: 400,
          rows: rows.map(item => ({
            code: item.code,
            type: item.type === MetricsType.DIMENSION ? 'category' : 'linear',
            position: 'row',
            dimensionKeys: [] as any,
          })),
          cols: cols.map(item => ({
            code: item.code,
            type: item.type === MetricsType.DIMENSION ? 'category' : 'linear',
          })),
        } as any}
      />
    );
  }
}

export default PureWrappr(AnyChart);
