import * as React from 'react';
import { ChartProps } from '../global';

export default function(Cmp) {
  return class PureWrappr extends React.Component<
    ChartProps & { dataSource: any },
    ChartState
  > {
    public componentDidUpdate(preProps, preState) {
      return preProps.dataSource !== this.props.dataSource;
    }
    public render() {
      return (
        <div>
          <Cmp {...this.props} />
        </div>
      );
    }
  };
}
export interface ChartState {
  dataSource: any[];
  activeBars: string[];
  dimensions: any[];
  measures: any[];
  filters: any[];
  contextMenuConfig: {
    visible: boolean;
    offset: [number, number];
  };
  sort: {};
}
