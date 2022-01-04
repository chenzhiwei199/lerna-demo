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
const chartUtils_1 = require("../../utils/chartUtils");
const victory_axis_1 = require("victory-axis");
const global_d_1 = require("../../global.d");
const Point_1 = __importDefault(require("../../help/Point"));
const Line_1 = __importDefault(require("../Line"));
const utils_1 = require("../../utils");
const Label_1 = __importDefault(require("./Label"));
const core_1 = require("./core");
class Axis extends React.Component {
    constructor(props) {
        super(props);
        this.axis = null;
    }
    getOffsetConfig() {
        const { virtualConfig, size, range } = this.props;
        let startOffset = 0;
        let startIndex = 0;
        let endIndex = range.length;
        let rangeUnitSize = 0;
        if (!virtualConfig) {
            return {
                startIndex,
                endIndex,
                startOffset,
                rangeUnitSize: size / range.length,
            };
        }
        else {
            const { startOffset, endOffset, containerSize } = virtualConfig;
            rangeUnitSize = size / range.length;
            const cellConfig = utils_1.getCellConfig(startOffset, endOffset, size, containerSize, rangeUnitSize);
            return {
                startOffset: cellConfig.startOffset,
                startIndex: cellConfig.startIndex,
                endIndex: cellConfig.endIndex,
                rangeUnitSize,
            };
        }
    }
    getAxisConfig() {
        let { direction, domainType, size, isLabelRotate } = this.props;
        const axisInfo = core_1.getAxis(direction, domainType, this.getRange(), size, isLabelRotate);
        return axisInfo;
    }
    getRange() {
        let { range, direction, domainType } = this.props;
        if (direction === global_d_1.DIRECTION.VERTICAL && chartUtils_1.checkIsCategory(domainType)) {
            range = range.slice(0).reverse();
        }
        return range;
    }
    getRangeAndSize() {
        let { domainType, size, direction } = this.props;
        let groupTransform;
        // 离散坐标轴旋转 clone
        let range = this.getRange();
        if (chartUtils_1.checkIsCategory(domainType)) {
            const { startIndex, endIndex, rangeUnitSize, startOffset, } = this.getOffsetConfig();
            // WARN: 正常情况+1， +2为了最后一个离散值x轴展示虚拟变化太明显
            range = range.slice(startIndex, endIndex + 2);
            size = rangeUnitSize * (endIndex - startIndex);
            if (chartUtils_1.checkIsCategory(domainType)) {
                if (direction === global_d_1.DIRECTION.HORIZONTAL) {
                    groupTransform = `translate(${-startOffset}, ${0})`;
                }
                else {
                    groupTransform = `translate(${0}, ${-startOffset})`;
                }
            }
        }
        return {
            range,
            size,
            groupTransform,
        };
    }
    renderLine() {
        const { direction, axisHeight, size } = this.props;
        if (direction === global_d_1.DIRECTION.VERTICAL) {
            return (React.createElement("g", { transform: `translate(-${axisHeight}, 0)` },
                React.createElement(Line_1.default, { points: [new Point_1.default(0, size), new Point_1.default(axisHeight, size)] })));
        }
        else {
            return (React.createElement("g", { transform: `translate(0, -${axisHeight})` },
                React.createElement(Line_1.default, { points: [new Point_1.default(size, 0), new Point_1.default(size, axisHeight)] })));
        }
    }
    render() {
        const { domainType, direction } = this.props;
        const axisConfig = this.getAxisConfig();
        const { range, size, groupTransform } = this.getRangeAndSize();
        const { scale, angle, textAnchor, verticalAnchor, firstTextAnchor, firstVerticalAnchor, } = axisConfig;
        const config = {
            standalone: false,
            // transform,
            padding: 0,
            style: {
                ticks: { stroke: 'grey', size: 5 },
            },
            tickLabelComponent: (React.createElement(Label_1.default, { type: direction, firstVerticalAnchor: firstVerticalAnchor, firstTextAnchor: firstTextAnchor, textAnchor: textAnchor, verticalAnchor: verticalAnchor, angle: angle })),
        };
        let paddingStart = 0;
        let paddingEnd = 0;
        if (chartUtils_1.checkIsCategory(domainType)) {
            config.tickValues = range;
            //展示效果优化，避免柱子超出去，离散数据的起点需要用第一个数据计算得出 加上柱子的宽度的一半
            paddingStart = scale(range[0]) + scale.bandwidth() / 2;
            paddingEnd = scale(range[0]) + scale.bandwidth() / 2;
        }
        else if (chartUtils_1.checkIsLinear(domainType)) {
            config.domain = range;
            config.tickCount = 3;
        }
        if (direction === global_d_1.DIRECTION.VERTICAL) {
            config.height = size;
            config.width = 0;
            config.offsetX = -1;
            config.orientation = 'left';
            config.padding = {
                top: paddingStart,
                bottom: paddingEnd,
                left: 0,
                right: 0,
            };
        }
        else {
            config.width = size;
            config.height = 0;
            config.offsetY = -1;
            config.orientation = 'bottom';
            config.padding = {
                left: paddingStart,
                right: paddingEnd,
                top: 0,
                bottom: 0,
            };
        }
        console.log("333", JSON.stringify(config.tickValues));
        console.log("444", JSON.stringify(config.domain));
        const cmp = Number.isFinite(size) ? React.createElement(victory_axis_1.VictoryAxis, Object.assign({}, config)) : React.createElement("g", null);
        return (React.createElement("g", null,
            React.createElement("g", { className: "axis-scroll-transform", transform: groupTransform },
                cmp,
                this.renderLine())));
    }
}
Axis.defaultProps = {
    type: global_d_1.DIRECTION.HORIZONTAL,
    axisHeight: 30,
    size: 200,
    containerSize: 500,
    isLabelRotate: false,
};
exports.default = Axis;
var AxisType;
(function (AxisType) {
    AxisType["x"] = "x";
    AxisType["y"] = "y";
})(AxisType = exports.AxisType || (exports.AxisType = {}));
