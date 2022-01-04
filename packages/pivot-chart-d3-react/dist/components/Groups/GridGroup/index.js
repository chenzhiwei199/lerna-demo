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
const global_d_1 = require("../../../global.d");
const Facet_1 = __importDefault(require("../../Facet"));
const Grid_1 = __importDefault(require("../../../components/Grid"));
const chartUtils_1 = require("../../../utils/chartUtils");
class GridGroup extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.renderFacetCell = (visibleSize, x, y) => {
            const { padding = [0, 0, 0, 0] } = this.props.config;
            const newRealSizeConfig = this.getRealSizeConfig();
            const drawSizeConfig = {
                width: newRealSizeConfig.width - padding[3] - padding[1],
                height: newRealSizeConfig.height - padding[2] - padding[0],
            };
            const verticalGrid = chartUtils_1.checkIsLinear(x.type) ? (React.createElement(Grid_1.default, { gridSize: newRealSizeConfig.height, size: drawSizeConfig.width, cell: x, type: global_d_1.DIRECTION.VERTICAL })) : (React.createElement("g", null));
            const horizontalGrid = chartUtils_1.checkIsLinear(y.type) ? (React.createElement(Grid_1.default, { gridSize: newRealSizeConfig.width, size: drawSizeConfig.height, cell: y, type: global_d_1.DIRECTION.HORIZONTAL })) : (React.createElement("g", null));
            return (React.createElement("g", null,
                React.createElement("g", { transform: `translate(${0}, ${padding[0]})` }, horizontalGrid),
                React.createElement("g", { transform: `translate(${padding[3]}, 0)` }, verticalGrid)));
        };
    }
    getRealSizeConfig() {
        const { xData, yData, config } = this.props;
        const { realSizeConfig } = config;
        const width = realSizeConfig.width / xData.length || 0;
        const height = realSizeConfig.height / yData.length || 0;
        const newRealSizeConfig = {
            width,
            height,
        };
        return newRealSizeConfig;
    }
    renderGridGroup() {
        const { xData, yData, config } = this.props;
        const { scrollOffsetConfig, sizeConfig } = config;
        const newRealSizeConfig = this.getRealSizeConfig();
        const xField = {
            data: xData,
            size: newRealSizeConfig.width,
            containerSize: sizeConfig.width,
        };
        const yField = {
            data: yData,
            size: newRealSizeConfig.height,
            containerSize: sizeConfig.height,
        };
        return (React.createElement(Facet_1.default, { xField: xField, yField: yField, renderFacetCell: this.renderFacetCell, scrollOffsetConfig: scrollOffsetConfig }));
    }
    render() {
        return React.createElement("g", null, this.renderGridGroup());
    }
}
exports.default = GridGroup;
var AxisType;
(function (AxisType) {
    AxisType["x"] = "x";
    AxisType["y"] = "y";
})(AxisType = exports.AxisType || (exports.AxisType = {}));
