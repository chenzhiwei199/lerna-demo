"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
class Graph extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { data, visibleSize, geomInstance, containerSizeConfig, transpose, realSizeConfig, positionConfig } = this.props;
        // 数据转化
        const newData = geomInstance.transformData(data, transpose, positionConfig, realSizeConfig, containerSizeConfig, visibleSize);
        const { width, height } = realSizeConfig;
        // 图形绘制
        return (React.createElement("g", null, geomInstance.drawGraph(newData, realSizeConfig, visibleSize)));
    }
}
exports.default = Graph;
