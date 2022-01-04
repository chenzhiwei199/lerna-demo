import * as React from 'react';
import { getKylinQueryData } from '../dataService';
import * as DataSet from '@antv/data-set';
import { Button, Balloon, Loading } from '@alife/hippo';
import { Column, MetricsType, ChartProps } from '../global';

export default function(Cmp) {
  return class ChartWrapper extends React.Component<ChartProps, ChartState> {
    constructor(props: ChartProps) {
      super(props);
      this.state = {
        dataSource: [],
        activeBars: [],
        contextMenuConfig: { visible: false, offset: [0, 0] },
        sort: {},
        isLoading: false,
        ...this.getWidgetProps(props),
      };
    }

    public componentDidMount() {
      this.loadData(this.props);
    }

    public getWidgetProps(props: ChartProps) {
      const { rows, cols, filters } = props;
      const dimensions = [] as Column[];
      const measures = [] as Column[];
      rows.forEach(row => {
        if (row.type === MetricsType.DIMENSION) {
          dimensions.push(row);
        } else {
          measures.push(row);
        }
      });

      cols.forEach(row => {
        if (row.type === MetricsType.DIMENSION) {
          dimensions.push(row);
        } else {
          measures.push(row);
        }
      });
      return {
        filters,
        dimensions,
        measures,
      };
    }
    public loadData(props: ChartProps = this.props) {
      const { dimensions, measures, filters } = this.state;
      this.setState({
        isLoading: true,
      });
      getKylinQueryData({
        query: JSON.stringify({
          datasetId: 1,
          measures: measures.map(measure => measure.code),
          filters,
          timeDimensions: [],
          dimensions: dimensions.map(measure => measure.code),
          order: this.state.sort,
        }),
      })
        .then(data => {
          this.setState({
            isLoading: false,
            dataSource: data.filter(item => item),
          });
        })
        .catch(() => {
          this.setState({
            isLoading: false,
          });
        });
    }

    public componentWillReceiveProps(nextProps: ChartProps) {
      this.setState(
        {
          ...this.state,
          ...this.getWidgetProps(nextProps),
        },
        () => {
          this.loadData(nextProps);
        }
      );
    }

    public getDataSource() {
      const { dataSource } = this.state;
      return dataSource;
    }
    public shouldComponentUpdate(preProps, preState) {
      return preState.dataSource !== this.state.dataSource;
    }
    public render() {
      return (
        <div>
          <Loading visible={this.state.isLoading}>
            <Cmp {...this.props} dataSource={this.getDataSource()} />
          </Loading>
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
  isLoading: boolean;
  contextMenuConfig: {
    visible: boolean;
    offset: [number, number];
  };
  sort: {};
}

// export interface ChartProps {
//   onOperationChange: (operation?: Operation) => void;
//   operations: Operation[];
//   filters: Filter[];
//   rows: Column[];
//   cols: Column[];
//   dimensionAll: Array<{ label: string; value: string }>;
// }
