import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ChartRender, { ChartConfig, BlockChartConfig } from '../Chart';
import { CellTypeEnum } from '../Geom/BaseGeom';
import { Balloon } from '@alife/hippo';
import '@alife/hippo/index.scss';

export interface BlockProps {
  config: BlockChartConfig;
  data: Array<any>;
  index: number;
}

export interface BlockState {}

class Block extends React.Component<BlockProps> {
  ref: HTMLDivElement | null;
  chartRender: ChartRender | null;

  constructor(props) {
    super(props);
    this.ref = null;
    this.chartRender = null;
  }
  componentDidMount() {
    const { config } = this.props;
    const htmlElement = ReactDOM.findDOMNode(this.ref);
    this.chartRender = new ChartRender(htmlElement, config);
  }

  componentDidUpdate() {
    if (this.chartRender) {
      this.chartRender.render(this.props.data);
    }
  }

  renderMetrics(data) {
    let dim = [] as any;
    let measures = [] as any;
    data.forEach(item => {
      if (item.type === CellTypeEnum.CATEGORY) {
        dim.push(item);
      } else {
        measures.push(item);
      }
    });
    return `${dim.length}个维度，${measures.length}个度量`;
  }
  render() {
    const {
      data,
      index,
      config: { width, rows, cols },
    } = this.props;
    console.log('=================');
    console.log('data', data);
    console.log('r', this.renderMetrics(rows));
    console.log('c', this.renderMetrics(cols));
    return (
      <div style={{ width }}>
        <div>
          <Balloon trigger={<div>Title--{index}</div>}>
            <div>行</div>
            {JSON.stringify(rows, null, 2)}
            <div>列</div>
            {JSON.stringify(cols, null, 2)}
          </Balloon>
        </div>
        <div>Rows: {this.renderMetrics(rows)}</div>
        <div>Cols: {this.renderMetrics(cols)}</div>
        <div
          style={{ margin: '50px' }}
          ref={ref => {
            this.ref = ref;
          }}
        />
      </div>
    );
  }
}

export default Block;
