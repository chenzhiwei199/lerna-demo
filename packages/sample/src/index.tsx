import * as React from 'react';
import classNames from 'classnames';
import { ChartConfig, GEOM_TYPE } from './Chart';
import * as d3 from 'd3';
import Block from './Block';
import { CellTypeEnum, Cell, BaseCell } from './Geom/BaseGeom';

const dataConfig = {
  rollUpSelection: [],
  value: 'Name',
  metric: 'Count',
};
const commConfig = {
  geom: 'interval',
  width: 500,
  height: 500,
  margin: { top: 80, right: 80, bottom: 80, left: 80 },
};

const metrcis = [{ code: 'Name', type: 'Count' }];
const dataEnums = [
  [],
  [{ code: 'name', type: CellTypeEnum.LINEAR, metrics: 'Count' }],
  [{ code: 'TicketTicket', type: CellTypeEnum.LINEAR, metrics: 'Count' }],
  [{ code: 'Age', type: CellTypeEnum.CATEGORY }],
  [
    { code: 'name', type: CellTypeEnum.LINEAR, metrics: 'Count' },
    { code: 'TicketTicket', type: CellTypeEnum.LINEAR, metrics: 'Count' },
  ],
  [
    { code: 'Age', type: CellTypeEnum.CATEGORY },
    { code: 'Sex', type: CellTypeEnum.CATEGORY },
  ],
  [
    { code: 'Age', type: CellTypeEnum.CATEGORY },
    { code: 'name', type: CellTypeEnum.LINEAR, metrics: 'Count' },
  ],
];

let chartConfigs = [] as { rows: BaseCell[]; cols: BaseCell[] }[];

dataEnums.forEach((t1: BaseCell[], rowIndex) => {
  dataEnums.forEach((t2: BaseCell[], colIndex) => {
    if (rowIndex !== colIndex) {
      const config = { rows: [], cols: [] } as {
        rows: BaseCell[];
        cols: BaseCell[];
      };
      config.rows = t1;
      config.cols = t2;
      chartConfigs.push(config);
    }
  });
});

chartConfigs = chartConfigs.sort((pre, next) => {
  return pre.rows.length + pre.cols.length > next.rows.length + next.cols.length
    ? -1
    : 1;
});

var metrics = {
  Mean: d3.mean,
  Median: d3.median,
  Count: (d, getValue) => {
    return d.length;
  },
  Max: d3.max,
  Min: d3.min,
  Sum: d3.sum,
};

export interface Datum {
  value?: string;
  values?: Array<any>;
  key?: string;
}
function rollUpData(
  data: Array<any>,
  by: Array<string>,
  metrcis: Array<Metrics>
) {
  // filter before you do this
  let rolledUpData = d3.nest<any, Datum>();

  by.forEach(group => {
    rolledUpData = rolledUpData.key((d: any) => {
      return d[group];
    });
  });
  const newData = rolledUpData
    .rollup((values: Array<any>) => {
      let newValue = {};
      metrcis.forEach(metric => {
        newValue[metric.code] = metrics[metric.type](values, (d: any) => {
          return d[metric.code];
        });
      });
      return newValue;
    })
    .entries(
      data.filter(d => {
        return metrcis.every(metric => {
          return d[metric.code] !== null;
        });
      })
    );

  return newData;
}

function flattenData(
  data: Array<Datum> | Array<any> | string,
  rollUpSelection: Array<string>,
  level: number = 0
) {
  if (level === rollUpSelection.length) {
    return [data];
  }
  let flattenedData = [] as Array<any>;
  for (let i = 0; i < data.length; ++i) {
    let newData = flattenData(
      data[i].values || data[i].value,
      rollUpSelection,
      level + 1
    ) as Array<any>;
    newData.forEach(d => {
      d[rollUpSelection[level]] = data[i].key;
    });
    flattenedData = flattenedData.concat(newData);
  }
  return flattenedData;
}

function processData(
  data: Array<any>,
  rollUpSelection: Array<string>,
  metrcis: Array<Metrics>
) {
  const rolledUpData = rollUpData(data, rollUpSelection, metrcis);
  const flattenedData = flattenData(rolledUpData, rollUpSelection);
  return flattenedData;
}
class PivotChartD3 extends React.Component {
  state = {
    data: [],
  };
  componentDidMount() {
    /**
     *PassengerIdUnique ID of the passenger
      SurvivedSurvived (1) or died (0)
      PclassPassenger's class (1st, 2nd, or 3rd)
      NamePassenger's name
      SexPassenger's sex
      AgePassenger's age
      SibSpNumber of siblings/spouses aboard the Titanic
      ParchNumber of parents/children aboard the Titanic
      TicketTicket number
      FareFare paid for ticket
      CabinCabin number
      EmbarkedWhere the passenger got on the ship (C - Cherbourg, S - Southampton, Q = Queenstown)
    *
    * @memberof PivotChartD3
    */
    d3.json(
      'https://gw.alipayobjects.com/os/basement_prod/edf51c6c-81c7-4789-8ff9-9ad8e47ce356.json'
    ).then((data: Array<any>) => {
      this.setState({
        data: data,
      });
    });
  }

  render() {
    const cls = classNames({
      'pivot-chart-d3': true,
    });

    // 声明一个叫做name的state
    const id = new URL(location.href).searchParams.get('id');
    const defaultValue = id ? Number(id) : 1;
    return (
      <div
        id="container"
        className={cls}
        style={{ display: 'flex', flexWrap: 'wrap' }}
      >
        {chartConfigs
          .slice(
            defaultValue ? defaultValue : 0,
            defaultValue ? defaultValue + 1 : dataEnums.length * 5
          )
          .map(item => {
            const dimensions = [...item.rows, ...item.cols]
              .filter(cell => cell.type === CellTypeEnum.CATEGORY)
              .map(cell => cell.code);
            const measures = [...item.rows, ...item.cols]
              .filter(cell => cell.type === CellTypeEnum.LINEAR)
              .map(cell => ({
                code: cell.code,
                type: cell.metrics || 'Count',
              }));
            return {
              geom: 'interval' as GEOM_TYPE,
              width: window.innerWidth - 100,
              height: 300,
              data: processData(this.state.data, dimensions, measures),
              ...item,
            };
          })
          .map((config, index) => {
            const { data, ...rest } = config;
            return (
              <div>
                <Block
                  key={index}
                  index={index}
                  data={data.filter(item => Object.keys(item).length !== 0)}
                  config={rest}
                />
                {/* <Block 
                  key={index} 
                  index={index} 
                  data={data.filter(item => (Object.keys(item).length !== 0))} 
                  config={{
                    ...rest,
                    geom: 'line'
                  }} 
                />
                <Block 
                  key={index} 
                  index={index} 
                  data={data.filter(item => (Object.keys(item).length !== 0))} 
                  config={{
                    ...rest,
                    geom: 'point'
                  }}  */}
                />
              </div>
            );
          })}
        {/* <Block data={configOneMeasureOnRow.dataFormat(this.state.data)} config={configOneMeasureOnRow}/>
        <Block data={configOneDimensionOnRow.dataFormat(this.state.data)} config={configOneDimensionOnRow}/>
        <Block data={configOneMeasureOnCol.dataFormat(this.state.data)} config={configOneMeasureOnCol}/>
        <Block data={configOneDimensionOnCol.dataFormat(this.state.data)} config={configOneDimensionOnCol}/>
        <Block data={configTwoMeasures.dataFormat(this.state.data)} config={configTwoMeasures}/>
        <Block data={configTwoRowDimAndColMeasure.dataFormat(this.state.data)} config={configTwoRowDimAndColMeasure}/>
        <Block data={configRowMeasureAndColDim.dataFormat(this.state.data)} config={configRowMeasureAndColDim}/>
        <Block data={configRowDimAndColDim.dataFormat(this.state.data)} config={configRowDimAndColDim}/> */}
        {/* <Block data={this.state.data} config={{
          ...config,
          positionConfig: config.positionConfig.slice(0, 2)
        }}/>
        <Block data={this.state.data} config={{
          ...config,
          positionConfig: [config.positionConfig[0], config.positionConfig[2]]
        }}/>
        <Block data={this.state.data} config={{
          ...config,
          geom: 'pie'
        }}/>
        <Block data={this.state.data} config={{
          ...config,
          geom: 'line'
        }}/>
         <Block data={this.state.data} config={{
          ...config,
          geom: 'scatter'
        }}/> */}
      </div>
    );
  }
}

export default PivotChartD3;

interface Metrics {
  code: string;
  type: string;
}
