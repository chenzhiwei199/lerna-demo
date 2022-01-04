import * as React from 'react';
import { Cell, MetricsType } from '../../global';
import DragList from '../DragList';
import CustomDragContainer from '../DragContainer';
import { CELL_TYPE } from '../ChartDesigner';
import { DragWrapper } from '@alife/hippo-shuhe-drag';
import produce from 'immer';
import { get } from 'lodash';

export interface SchemaDesignProps {
  value: Schema;
  dimensions: Cell[];
  measures: Cell[];
  children: JSX.Element;
  onChange: (schema: Schema) => void;
}

const containers = [
  {
    label: '行',
    value: CELL_TYPE.ROWS,
  },
  {
    label: '列',
    value: CELL_TYPE.COLS,
  },
];
export interface SchemaDesignState {
  schema: Schema;
}

class SchemaDesign extends React.Component<
  SchemaDesignProps,
  SchemaDesignState
> {
  public static defaultProps = {
    onChange: () => {},
    value: {},
  };
  constructor(props: SchemaDesignProps) {
    super(props);
  }

  public getDataByValue(value: string) {
    const { dimensions, measures } = this.props;
    return [...dimensions, ...measures].find(item => item.value === value);
  }

  public onDrop(type: CELL_TYPE, value: string) {
    const newSchema = produce(this.props.value, schema => {
      const d = this.getDataByValue(value);
      if (d) {
        if (schema[type]) {
          schema[type].push();
        } else {
          schema[type] = [d];
        }
      }
    });
    this.props.onChange(newSchema);
  }
  public onDragged(type: CELL_TYPE, value: string) {
    const newSchema = produce(this.props.value, schema => {
      if (type && schema[type]) {
        schema[type] = schema[type].filter(item => item.value !== value);
      }
    });

    this.props.onChange(newSchema);
  }

  public renderContaienr(label, type) {
    return (
      <CustomDragContainer
        label={label}
        type={type}
        dataSource={get(this.props, ['value', type], [])}
        onDrop={this.onDrop.bind(this, type)}
        onDragged={this.onDragged.bind(this, type)}
      />
    );
  }
  public render() {
    const { dimensions, measures, children } = this.props;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 300, height: '100vh', overflow: 'auto' }}>
          <DragList
            label="维度"
            data={dimensions}
            iconType={MetricsType.DIMENSION}
          />
        </div>
        <div style={{ width: 300, height: '100vh', overflow: 'auto' }}>
          <DragList
            label="度量"
            data={measures}
            iconType={MetricsType.MEASURE}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 'calc(100% - 320px)',
            padding: '12px',
          }}
        >
          <div style={{ flex: '0' }}>
            {containers.map(item => {
              return this.renderContaienr(item.label, item.value);
            })}
          </div>
          <div style={{ flex: '2', marginTop: '10px' }}>{children}</div>
        </div>
      </div>
    );
  }
}

export default DragWrapper(SchemaDesign);

export interface Schema {
  [propName: string]: Cell[];
}
