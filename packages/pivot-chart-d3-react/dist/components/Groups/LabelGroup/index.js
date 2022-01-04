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
const Label_1 = __importDefault(require("../../Label"));
const Facet_1 = __importDefault(require("../../Facet"));
const Offset_1 = __importDefault(require("../../../help/Offset"));
class LabelGroup extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.renderFacetCell = (visibleSize, cell) => {
            const { type, size, labelHeight, gapStart = 0, gapEnd = 0 } = this.props;
            let offset;
            if (type === global_d_1.DIRECTION.HORIZONTAL) {
                offset = new Offset_1.default(size / 2, labelHeight / 2);
            }
            else {
                offset = new Offset_1.default(labelHeight / 2, size / 2);
            }
            return (React.createElement("g", null,
                React.createElement(Label_1.default, { isTranspose: type === global_d_1.DIRECTION.VERTICAL, label: cell ? cell.label : '', offset: offset })));
        };
    }
    renderAxisGroup() {
        const { data, type, size, containerSize, scrollOffsetConfig } = this.props;
        let xField;
        let yField;
        if (type === global_d_1.DIRECTION.HORIZONTAL) {
            xField = {
                data,
                size,
                containerSize,
            };
        }
        else {
            yField = {
                data,
                size,
                containerSize,
            };
        }
        return React.createElement(Facet_1.default, { xField: xField, yField: yField, renderFacetCell: this.renderFacetCell, scrollOffsetConfig: scrollOffsetConfig });
    }
    render() {
        return React.createElement("g", null, this.renderAxisGroup());
    }
}
exports.default = LabelGroup;
