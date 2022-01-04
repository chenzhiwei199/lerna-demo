import * as React from 'react';
import '@alife/hippo/index.scss';
import { getDataSets } from '../../dataService';
import { BlockProps, MetricsType, Filter, Operation } from '../../global';

class Block extends React.Component<BlockProps> {
  public static defaultProps = {
    operations: [],
  };

  public state = {
    schemaData: {
      dimensions: [],
    },
    dimensions: [],
    measures: [],
    filters: [],
  };

  constructor(props: BlockProps) {
    super(props);
  }
  public componentDidMount() {
    getDataSets().then(data => {
      this.setState({
        schemaData: data || {},
      });
    });
  }

  public getMetaByKey(key: string) {
    return (this.state.schemaData[key] || []).map(item => {
      return {
        label: item.title,
        value: item.name,
      };
    });
  }

  public getWidgetProps() {
    let { rows, cols, operations = [] } = this.props;

    const filters = [] as Filter[];
    // 判定行和列哪个包含维度，如果行有，则以行为准, 下钻性状表现方式
    operations.forEach((operation: Operation) => {
      if (operation.filterData && operation.filterData.key) {
        if (operation.type === 'filter') {
          filters.push({
            member: operation.filterData.key,
            operator: operation.filterData.op,
            values: operation.filterData.value,
          });
        } else if (operation.type === 'drill-down') {
          filters.push({
            member: operation.filterData.key,
            operator: operation.filterData.op,
            values: operation.filterData.value,
          });
          if (operation.drillDimension) {
            cols = [
              { code: operation.drillDimension, type: MetricsType.DIMENSION },
            ];
          }
        }
      }
    });
    return {
      rows,
      cols,
      filters,
    };
  }
  public onChange(key: string, value: string[]) {
    this.setState({
      [key]: value,
    });
  }

  public render() {
    const { Cmp, onOperationChange = () => {}, operations = [] } = this.props;
    return (
      <div className="component">
        {Cmp ? (
          <Cmp
            operations={operations}
            dimensionAll={this.getMetaByKey('dimensions')}
            {...this.getWidgetProps()}
            onOperationChange={onOperationChange}
          />
        ) : (
          '请传递图表'
        )}
      </div>
    );
  }
}

export default Block;
