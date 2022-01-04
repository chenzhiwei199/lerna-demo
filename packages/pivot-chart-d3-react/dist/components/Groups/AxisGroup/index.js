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
// import Axis from '../../Axis';
const ReAxis_1 = __importDefault(require("../../ReAxis"));
const global_d_1 = require("../../../global.d");
const Facet_1 = __importDefault(require("../../Facet"));
class AxisGroup extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.renderFacetCell = (visibleSize, cell) => {
            const { startOffset, endOffset } = visibleSize;
            const { type, containerSize, isLabelRotate, axisHeight, size, gapStart = 0, gapEnd = 0 } = this.props;
            return React.createElement(ReAxis_1.default, { virtualConfig: {
                    startOffset: startOffset,
                    endOffset: endOffset,
                    containerSize: containerSize
                }, range: cell.range, domainType: cell.type, isLabelRotate: isLabelRotate, axisHeight: axisHeight, size: size - gapStart - gapEnd, direction: type });
        };
    }
    renderAxisGroup() {
        const { data, type, size, gapStart = 0, containerSize, scrollOffsetConfig } = this.props;
        let xField;
        let yField;
        if (type === global_d_1.DIRECTION.HORIZONTAL) {
            xField = {
                data,
                size,
                gapStart,
                containerSize,
            };
        }
        else {
            yField = {
                data,
                size,
                gapStart,
                containerSize,
            };
        }
        return React.createElement(Facet_1.default, { xField: xField, yField: yField, isTransform: true, renderFacetCell: this.renderFacetCell, scrollOffsetConfig: scrollOffsetConfig });
    }
    render() {
        return React.createElement("g", null, this.renderAxisGroup());
    }
}
exports.default = AxisGroup;
var AxisType;
(function (AxisType) {
    AxisType["x"] = "x";
    AxisType["y"] = "y";
})(AxisType = exports.AxisType || (exports.AxisType = {}));
