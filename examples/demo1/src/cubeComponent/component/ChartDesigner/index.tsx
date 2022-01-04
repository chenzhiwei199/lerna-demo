import * as React from 'react';
import { getKylinDataSets } from '../../dataService';
import Block from '../Block';
import { getChartByType } from '../../utils/chartUtils';
import { DragItem, DragContainer, DragWrapper } from '@alife/hippo-shuhe-drag';
import { Radio } from '@alife/hippo';
import produce from 'immer';
import { HoverTag, ActiveTag } from '../Tag';
import { MetricsType, Column } from '../../global';

const RadioGroup = Radio.Group;

const charts = [
  {
    type: 'interval',
  },
  {
    type: 'pie',
  },
  {
    type: 'scatter',
  },
];

function getColor(type) {
  switch (type) {
    case MetricsType.DIMENSION:
      return 'rgb(73,150,178)';
    case MetricsType.MEASURE:
      return 'rgb(0, 177,128)';
    default:
      return 'rgb(73,150,178)';
  }
}
function getIcon(type) {
  let color = getColor(type);
  let icon = '&#xe629;';
  switch (type) {
    case MetricsType.DIMENSION:
      icon = '&#xe629;';
      break;
    case MetricsType.MEASURE:
      icon = '&#xe62a;';
      break;
    default:
      icon = '&#xe629;';
      break;
  }
  return (
    <i
      style={{ color: color, paddingRight: '12px' }}
      className="iconfont"
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}
function renderBaseContent(type, { dataSource }) {
  let style = {
    padding: '4px',
  };
  return (
    <div style={style}>
      <HoverTag
        color={getColor(type)}
        label={dataSource.label}
        value={dataSource.value}
        icon={getIcon(type)}
      />
    </div>
  );
}

function renderContainerContent(type, { dataSource }) {
  return (
    <ActiveTag
      color={getColor(type)}
      label={dataSource.label}
      value={dataSource.value}
    />
  );
}

function renderContainer(type, config) {
  const { dataSource = [], sourceType, canDrop, isActive } = config;
  let background = isActive ? 'rgb(241,246,240)' : 'white';
  let border = canDrop
    ? '1px solid rgb(235,143,80)'
    : '1px solid rgb(212,212,212)';
  return (
    <div
      className="container"
      style={{
        padding: '12px',
        border: border,
        background: background,
        minHeight: 50,
        width: '100%',
      }}
    >
      <div>
        {dataSource.map((item, index) => {
          return (
            <DragItem
              onDrag={this.onDrag.bind(this, type)}
              onDragged={this.onDragged.bind(this, type)}
              style={{ display: 'inline-block' }}
              key={item.value + index}
              type={type}
              dataSource={item}
              renderContent={renderContainerContent.bind(this, item.type)}
            />
          );
        })}
      </div>
    </div>
  );
}

export interface ChartDesignerProps {
  prefix: string;
}

export interface ChartDesignerState {
  dimensions: Array<RowData>;
  measures: Array<RowData>;
  schema: SHCEMA;
  columnMap: Map<string, Column>;
  columnDescMap: Map<string, RowData>;
}

function transform2DataSource(dMap, dataSource) {
  return dataSource.map(item => {
    return dMap.get(item);
  });
}
class ChartDesigner extends React.Component<
  ChartDesignerProps,
  ChartDesignerState
> {
  static defaultProps = {
    prefix: 'chart-designer',
  };
  dragType: string;
  constructor(props: ChartDesignerProps) {
    super(props);
    this.dragType = '';
    this.state = {
      columnMap: new Map(),
      columnDescMap: new Map(),
      dimensions: [],
      measures: [],
      schema: {
        rows: [],
        cols: [],
        color: [],
        chartType: 'interval',
      },
    };
  }

  componentDidMount() {
    getKylinDataSets().then((data: any) => {
      const dimensions = data.dimensions.map(item => ({
        label: item.name,
        value: item.alias,
      }));
      const measures = data.measures.map(item => ({
        label: item.name,
        value: item.alias,
      }));
      let columnMap = new Map<string, Column>();
      let columnDescMap = new Map<string, RowData>();
      dimensions.forEach(item => {
        columnMap.set(item.value, {
          code: item.value,
          type: MetricsType.DIMENSION,
        } as Column);
        columnDescMap.set(item.value, {
          ...item,
          type: MetricsType.DIMENSION,
        });
      });

      measures.forEach(item => {
        columnMap.set(item.value, {
          code: item.value,
          type: MetricsType.MEASURE,
        } as Column);
        columnDescMap.set(item.value, {
          ...item,
          type: MetricsType.MEASURE,
        });
      });
      this.setState({
        dimensions: dimensions,
        measures: measures,
        columnMap: columnMap,
        columnDescMap: columnDescMap,
      });
    });
  }

  onChange(key: STATE_TYPE, value: Array<string>) {
    this.setState({
      schema: {
        ...this.state.schema,
        [key]: value,
      },
    });
  }

  onDrag(type, dropResult) {
    this.dragType = type;
  }

  onDragged(type, dropResult, item) {
    if (!dropResult) {
      const { dataSource } = item;
      const filterSource = this.state.schema[this.dragType]
        ? this.state.schema[this.dragType].filter(
            current => current !== dataSource.value
          )
        : [];
      this.setState(
        produce(this.state, state => {
          state.schema[this.dragType] = filterSource;
        })
      );
    }
    this.dragType = '';
  }

  onDrop(key, item, result = {}) {
    const { dataSource } = item;
    const filterSource = this.state.schema[this.dragType]
      ? this.state.schema[this.dragType].filter(
          current => current !== dataSource.value
        )
      : [];
    // 拖拽无效
    if (!item) {
      this.setState(
        produce(this.state, state => {
          state.schema[this.dragType] = filterSource;
        })
      );
    }
    this.setState(
      produce(this.state, state => {
        state.schema[this.dragType] = filterSource;
        state.schema[key].push(dataSource.value);
      })
    );
    // 清空拖拽状态
    this.dragType = '';
  }

  renderBlock(label, dataSource, key) {
    const { schema, columnDescMap } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: '100px' }}>{label}</div>
        <DragContainer
          onDrop={this.onDrop.bind(this, key)}
          targetType={key}
          type={Object.values(CELL_TYPE).filter(item => item !== key)}
          dataSource={transform2DataSource(columnDescMap, schema[key])}
          renderContent={renderContainer.bind(this, key)}
        />
      </div>
    );
  }

  renderChart() {
    const { schema } = this.state;
    console.log('state', this.state);
    return (
      <div>
        <Block
          rows={schema.rows.map(code => this.state.columnMap.get(code))}
          cols={schema.cols.map(code => this.state.columnMap.get(code))}
          // onOperationChange={this.onOperationChange.bind(this, chart.id, ids)}
          Cmp={getChartByType(schema.chartType)}
          id={1111}
        />
      </div>
    );
  }

  renderChartTypes(label: string, dataSource: Array<RowData>) {
    return (
      <div>
        <div>{label}</div>
        <RadioGroup
          value={this.state.schema.chartType}
          dataSource={dataSource}
          onChange={this.onChange.bind(this, CELL_TYPE.CHART_TYPE)}
        />
      </div>
    );
  }

  render() {
    return (
      <div
        prefix={this.props.prefix}
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div style={{ width: 300, height: '100vh', overflow: 'auto' }}>
          <div>维度</div>
          {this.state.dimensions.map(item => {
            return (
              <DragItem
                // style={{ display: 'inline-block' }}
                type={CELL_TYPE.BASE}
                key={item.value}
                dataSource={item}
                renderContent={renderBaseContent.bind(
                  this,
                  MetricsType.DIMENSION
                )}
              />
            );
          })}
        </div>

        <div style={{ width: 300, height: '100vh', overflow: 'auto' }}>
          <div>度量</div>
          {this.state.measures.map(item => {
            return (
              <DragItem
                // style={{ display: 'inline-block' }}
                type={CELL_TYPE.BASE}
                key={item.value}
                dataSource={item}
                renderContent={renderBaseContent.bind(
                  this,
                  MetricsType.MEASURE
                )}
              />
            );
          })}
        </div>
        <div style={{ width: 'calc(100% - 320px)', padding: '12px' }}>
          {this.renderBlock(
            '行',
            this.state.dimensions.concat(this.state.measures),
            CELL_TYPE.ROWS
          )}
          {this.renderBlock(
            '列',
            this.state.dimensions.concat(this.state.measures),
            CELL_TYPE.COLS
          )}
          {this.renderBlock(
            '颜色',
            this.state.dimensions.concat(this.state.measures),
            CELL_TYPE.COLOR
          )}
          {this.renderChartTypes(
            '图表类型',
            charts.map(item => ({ label: item.type, value: item.type }))
          )}
          {this.renderChart()}
        </div>
      </div>
    );
  }
}

export default DragWrapper(ChartDesigner);

export enum CELL_TYPE {
  ROWS = 'rows',
  COLS = 'cols',
  COLOR = 'color',
  CHART_TYPE = 'chartType',
  BASE = 'base',
}

export interface SHCEMA {
  [propName: string]: any;
}
type STATE_TYPE =
  | CELL_TYPE.ROWS
  | CELL_TYPE.COLOR
  | CELL_TYPE.COLS
  | CELL_TYPE.CHART_TYPE;
export interface RowData {
  label: string;
  value: string;
  type?: MetricsType;
}
