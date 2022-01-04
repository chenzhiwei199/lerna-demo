import * as React from 'react';
import ChartRender, { ChartProps } from '../Chart';
import { Cell, ScaleType } from '../../global.d';

export interface BlockProps {
  config: ChartProps;
  data: any[];
  index: number;
}

export interface BlockState {}

class Block extends React.Component<BlockProps> {
  public renderMetrics(data) {
    const dim = [] as any;
    const measures = [] as any;
    data.forEach(item => {
      if (item.type === ScaleType.CATEGORY) {
        dim.push(item);
      } else {
        measures.push(item);
      }
    });
    return `${dim.length}个维度，${measures.length}个度量`;
  }

  public render() {
    const {
      data,
      index,
      config: { width, rows, cols },
    } = this.props;

    return (
      <div style={{ width }}>
        <div>
          <div>Title--{index}</div>
          <div>行</div>
          {JSON.stringify(rows, null, 2)}
          <div>列</div>
          {JSON.stringify(cols, null, 2)}
          {/* <Balloon trigger={<div>Title--{index}</div>}>
         
          </Balloon> */}
        </div>
        <div>Rows: {this.renderMetrics(rows)}</div>
        <div>Cols: {this.renderMetrics(cols)}</div>
        <ChartRender data={data} {...this.props.config} />
      </div>
    );
  }
}
export default Block;
