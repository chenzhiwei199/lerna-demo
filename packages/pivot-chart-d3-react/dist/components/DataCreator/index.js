"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const d3 = __importStar(require("d3"));
const Block_1 = __importDefault(require("../Block"));
const global_d_1 = require("../../global.d");
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
    [{ code: 'name', type: global_d_1.ScaleType.LINEAR, metrics: 'Count' }],
    [{ code: 'TicketTicket', type: global_d_1.ScaleType.LINEAR, metrics: 'Count' }],
    [{ code: 'Age', type: global_d_1.ScaleType.CATEGORY }],
    [
        { code: 'name', type: global_d_1.ScaleType.LINEAR, metrics: 'Count' },
        { code: 'TicketTicket', type: global_d_1.ScaleType.LINEAR, metrics: 'Count' },
    ],
    [
        { code: 'Age', type: global_d_1.ScaleType.CATEGORY },
        { code: 'Sex', type: global_d_1.ScaleType.CATEGORY },
    ],
    [
        { code: 'Age', type: global_d_1.ScaleType.CATEGORY },
        { code: 'name', type: global_d_1.ScaleType.LINEAR, metrics: 'Count' },
    ],
];
let chartConfigs = [];
dataEnums.forEach((t1, rowIndex) => {
    dataEnums.forEach((t2, colIndex) => {
        if (rowIndex !== colIndex) {
            const config = { rows: {}, cols: {} };
            config.rows = t1;
            config.cols = t2;
            chartConfigs.push(config);
        }
    });
});
chartConfigs = chartConfigs.sort((pre, next) => {
    return pre.rows.length + pre.cols.length > next.rows.length + next.cols.legnth
        ? -1
        : 1;
});
const metrics = {
    Mean: d3.mean,
    Median: d3.median,
    Count: (d, getValue) => {
        return d.length;
    },
    Max: d3.max,
    Min: d3.min,
    Sum: d3.sum,
};
function rollUpData(data, by, metrcis) {
    // filter before you do this
    let rolledUpData = d3.nest();
    by.forEach(group => {
        rolledUpData = rolledUpData.key((d) => d[group]);
    });
    const newData = rolledUpData
        .rollup((values) => {
        const newValue = {};
        metrcis.forEach(metric => {
            newValue[metric.code] = metrics[metric.type](values, (d) => d[metric.code]);
        });
        return newValue;
    })
        .entries(data.filter(d => {
        return metrcis.every(metric => {
            return d[metric.code] !== null;
        });
    }));
    return newData;
}
function flattenData(data, rollUpSelection, level) {
    level = level || 0;
    if (level === rollUpSelection.length) {
        return [data];
    }
    let flattenedData = [];
    for (let i = 0; i < data.length; ++i) {
        const newData = flattenData(data[i].values || data[i].value, rollUpSelection, level + 1);
        newData.forEach((d) => {
            d[rollUpSelection[level || 0]] = data[i].key;
        });
        flattenedData = flattenedData.concat(newData);
    }
    return flattenedData;
}
function processData(data, rollUpSelection, metrcis) {
    const rolledUpData = rollUpData(data, rollUpSelection, metrcis);
    const flattenedData = flattenData(rolledUpData, rollUpSelection);
    return flattenedData;
}
class PivotChartD3 extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: [],
        };
    }
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
        d3.json('https://gw.alipayobjects.com/os/basement_prod/edf51c6c-81c7-4789-8ff9-9ad8e47ce356.json').then((data) => {
            this.setState({
                data,
            });
        });
    }
    render() {
        const cls = 'pivot-chart-d3';
        // 声明一个叫做name的state
        const id = new URL(location.href).searchParams.get('id');
        const defaultValue = id ? Number(id) : 1;
        return (React.createElement("div", { id: "container", className: cls, style: { display: 'flex', flexWrap: 'wrap' } }, chartConfigs
            .slice(defaultValue ? defaultValue : 0, defaultValue ? defaultValue + 1 : dataEnums.length * 7)
            .map(item => {
            const dimensions = [...item.rows, ...item.cols]
                .filter(cell => cell.type === global_d_1.ScaleType.CATEGORY)
                .map(cell => cell.code);
            const measures = [...item.rows, ...item.cols]
                .filter(cell => cell.type === global_d_1.ScaleType.LINEAR)
                .map(cell => ({ code: cell.code, type: cell.metrics }));
            return {
                geom: 'interval',
                width: window.innerWidth - 100,
                height: 300,
                data: processData(this.state.data, dimensions, measures),
                ...item,
            };
        })
            .map((config, index) => {
            const { data, ...rest } = config;
            return (React.createElement("div", null,
                React.createElement(Block_1.default, { key: index, index: index, data: data
                        .filter(item => Object.keys(item).length !== 0)
                        .map(item => ({ ...item, Sex: item.Sex + 'test' })), config: rest }),
                "/>"));
        })));
    }
}
exports.default = PivotChartD3;
