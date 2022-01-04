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
const Graph_1 = __importDefault(require("../../Graph"));
const get = __importStar(require("lodash/get"));
const chartUtils_1 = require("../../../utils/chartUtils");
const Facet_1 = __importDefault(require("../../../components/Facet"));
const Line_1 = __importDefault(require("../../../components/Line"));
const Point_1 = __importDefault(require("../../../help/Point"));
const SizeOptions_1 = require("../../../help/SizeOptions");
function filterDatas(data, categorys, dimensionKeys) {
    return dimensionKeys.reduce((filterData, currentKey, currentIndex) => {
        return filterData.filter(item => item[categorys[currentIndex].code] === currentKey);
    }, data);
}
class DoubleDataRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.renderFacetCell = (visibleSize, x, y) => {
            const { data, sizeOptions, geomInstance, sizeConfig, dimensionConfig, padding, } = this.props.config;
            const geom = sizeOptions.get().get(SizeOptions_1.ELEMENT_TYPE.GEOM);
            const newRealSizeConfig = this.getRealSizeConfig();
            const dimensionKeys = [
                ...get(x, 'dimensionKeys', []),
                ...get(y, 'dimensionKeys', []),
            ];
            let filterData = [];
            if (dimensionKeys.length !== 0) {
                // filterData = dimensionKeys.reduce((root, key) => {
                //   return root[key];
                // }, dataMap) || [];
                filterData = filterDatas(data, [...dimensionConfig.x, ...dimensionConfig.y], dimensionKeys);
            }
            else {
                filterData = data;
            }
            if (!x || !x.code) {
                x = undefined;
            }
            if (!y || !y.code) {
                y = undefined;
            }
            let tranpose;
            // 1. x 是维度的情况
            // 2. x, y 都是维度的想看
            // 3. y轴是度量，且x轴不存在
            if (chartUtils_1.checkIsCategory(x) ||
                (chartUtils_1.checkIsLinear(x.type) && chartUtils_1.checkIsLinear(y.type)) ||
                (chartUtils_1.checkIsLinear(y.type) && !x)) {
                tranpose = global_d_1.AXIS_DIRECTION.BL;
            }
            else {
                tranpose = global_d_1.AXIS_DIRECTION.LB;
            }
            const drawSizeConfig = {
                width: newRealSizeConfig.width - padding[3] - padding[1],
                height: newRealSizeConfig.height - padding[2] - padding[0],
            };
            const containerSizeConfig = {
                width: geom.getWidth(),
                height: geom.getHeight(),
            };
            return (React.createElement("g", null,
                React.createElement("g", { transform: `translate(${padding[3]}, ${padding[0]})` },
                    React.createElement(Graph_1.default, { containerSizeConfig: containerSizeConfig, visibleSize: visibleSize, transpose: tranpose, data: filterData, geomInstance: geomInstance, positionConfig: { x, y }, realSizeConfig: drawSizeConfig })),
                React.createElement(Line_1.default, { points: [
                        new Point_1.default(0, newRealSizeConfig.height),
                        new Point_1.default(newRealSizeConfig.width, newRealSizeConfig.height),
                    ] }),
                React.createElement(Line_1.default, { points: [
                        new Point_1.default(newRealSizeConfig.width, 0),
                        new Point_1.default(newRealSizeConfig.width, newRealSizeConfig.height),
                    ] })));
        };
    }
    getRealSizeConfig() {
        const { xData, yData, config } = this.props;
        const { realSizeConfig, padding } = config;
        const width = realSizeConfig.width / xData.length || 0;
        const height = realSizeConfig.height / yData.length || 0;
        const newRealSizeConfig = {
            width,
            height,
        };
        return newRealSizeConfig;
    }
    renderGraph() {
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
        return React.createElement("g", null, this.renderGraph());
    }
}
exports.default = DoubleDataRenderer;
