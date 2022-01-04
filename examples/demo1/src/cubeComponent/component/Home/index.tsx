import * as React from 'react';
import KylinCore from '../../help/DataSource/kylinCore';
import BaseCore from '../../help/DataSource/BaseCore';
import SchemaDesigner, { Schema } from '../SchemaDesigner';
import { getChartByType } from '../../utils/chartUtils';
import Block from '../Block';
import { MetricsType, Column } from '../../global';

export interface HomeProps {}

export interface BaseData {
  label: string;
  value: string;
  type: MetricsType;
}
export interface HomeState {
  schema: Schema;
  dimensions: BaseData[];
  measures: BaseData[];
}

class Home extends React.Component<HomeProps, HomeState> {
  public core: BaseCore;
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      schema: {},
      dimensions: [],
      measures: [],
    };
    this.core = new KylinCore();
  }

  public onChange = schema => {
    // requestData
    this.setState({
      schema,
    });
  };

  public componentDidMount() {
    this.core.queryCfg().then(res => {
      this.setState({
        dimensions: res.dimensions.map(item => ({
          ...item,
          type: MetricsType.DIMENSION,
        })),
        measures: res.measures.map(item => ({
          ...item,
          type: MetricsType.MEASURE,
        })),
      });
    });
  }

  public render() {
    const { dimensions, measures, schema } = this.state;
    return (
      <SchemaDesigner
        value={this.state.schema}
        dimensions={dimensions}
        measures={measures}
        onChange={this.onChange}
      >
        <Block
          rows={(schema.rows || []).map(
            item => ({ ...item, code: item.value } as Column)
          )}
          cols={(schema.cols || []).map(
            item => ({ ...item, code: item.value } as Column)
          )}
          // onOperationChange={this.onOperationChange.bind(this, chart.id, ids)}
          Cmp={getChartByType('any')}
          id={1111}
        />
      </SchemaDesigner>
    );
  }
}

export default Home;
