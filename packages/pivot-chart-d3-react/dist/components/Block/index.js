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
const Chart_1 = __importDefault(require("../Chart"));
const global_d_1 = require("../../global.d");
class Block extends React.Component {
    renderMetrics(data) {
        const dim = [];
        const measures = [];
        data.forEach(item => {
            if (item.type === global_d_1.ScaleType.CATEGORY) {
                dim.push(item);
            }
            else {
                measures.push(item);
            }
        });
        return `${dim.length}个维度，${measures.length}个度量`;
    }
    render() {
        const { data, index, config: { width, rows, cols }, } = this.props;
        return (React.createElement("div", { style: { width } },
            React.createElement("div", null,
                React.createElement("div", null,
                    "Title--",
                    index),
                React.createElement("div", null, "\u884C"),
                JSON.stringify(rows, null, 2),
                React.createElement("div", null, "\u5217"),
                JSON.stringify(cols, null, 2)),
            React.createElement("div", null,
                "Rows: ",
                this.renderMetrics(rows)),
            React.createElement("div", null,
                "Cols: ",
                this.renderMetrics(cols)),
            React.createElement(Chart_1.default, Object.assign({ data: data }, this.props.config))));
    }
}
exports.default = Block;
