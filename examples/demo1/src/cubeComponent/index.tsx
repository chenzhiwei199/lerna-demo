import * as React from 'react';
// import produce from 'immer';
import { getChartByType } from './utils/chartUtils';
import Block from './component/Block';
import '@alife/hippo/index.scss';

import { getDataSets } from './dataService';
import { Operation, Column } from './global';

const charts = [
  {
    id: 1,
    type: 'interval',
    schema: {
      dimensions: [{ code: 'Vgsales.platform', type: 'dimension' } as Column],
      measures: [{ code: 'Vgsales.naSales', type: 'measure' } as Column],
    },
  },
  {
    id: 2,
    type: 'pie',
    schema: {
      dimensions: [{ code: 'Vgsales.platform', type: 'dimension' } as Column],
      measures: [{ code: 'Vgsales.jpSales', type: 'measure' } as Column],
    },
  },
  {
    id: 3,
    type: 'scatter',
    schema: {
      dimensions: [{ code: 'Vgsales.genre', type: 'dimension' } as Column],
      measures: [
        { code: 'Vgsales.naSales', type: 'measure' } as Column,
        { code: 'Vgsales.euSales', type: 'measure' } as Column,
      ],
    },
  },
];

class CubeComp extends React.Component {
  state = {
    schemaData: {},
    dimensions: [],
    measures: [],
    operationMap: {} as Operation,
  };

  constructor(props: object) {
    super(props);
  }
  componentDidMount() {
    getDataSets().then(data => {
      this.setState({
        schemaData: data || {},
      });
    });
  }

  getMetaByKey(key: string) {
    return (this.state.schemaData[key] || []).map(item => {
      return {
        label: item.title,
        value: item.name,
      };
    });
  }

  onChange(key: string, value: Array<string>) {
    this.setState({
      [key]: value,
    });
  }
  onOperationChange(id: string, ids: Array<string>, operation?: Operation) {
    let operationMap = this.state.operationMap;
    ids.forEach(currentId => {
      if (!operation) {
        return;
      }
      // 临时操作不对自己生效
      if (
        operation.type === 'filter' &&
        operation.isTemporary &&
        currentId === id
      ) {
        return;
      }
      if (operation.type === 'drill-down' && currentId !== id) {
        return;
      }

      // 下钻操作只对自己生效
      if (operationMap[currentId]) {
        // 清空临时操作
        operationMap[currentId] = operationMap[currentId].filter(item => {
          return !item.isTemporary;
        });
        // 如果是相同操作，则替换当前操作
        if (operation) {
          operationMap[currentId].push(operation);
        }
      } else {
        operationMap[currentId] = [operation];
      }
    });

    this.setState({
      operationMap: operationMap,
    });
  }

  getOperations(chart) {
    return this.state.operationMap[chart.id] || [];
  }

  render() {
    const ids = charts.map(chart => {
      return chart.id;
    });
    return (
      <div className="component" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {charts.map(chart => {
          const Cmp = getChartByType(chart.type);
          return (
            <div key={chart.id} style={{ flex: '1 0 50%' }}>
              <Block
                operations={this.getOperations(chart)}
                cols={chart.schema.dimensions}
                rows={chart.schema.measures}
                onOperationChange={this.onOperationChange.bind(
                  this,
                  `${chart.id}`,
                  ids.map(id => `${id}`)
                )}
                Cmp={Cmp}
                id={chart.id}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default CubeComp;
