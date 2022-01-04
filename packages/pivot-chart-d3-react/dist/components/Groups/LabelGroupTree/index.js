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
const LabelGroup_1 = __importDefault(require("../LabelGroup"));
class LabelGroupTree extends React.PureComponent {
    renderLabelGroupTree() {
        const { data, type, containerSize, scrollOffsetConfig } = this.props;
        const labelSize = 30;
        return data.map((d, index) => {
            const { size, data: treeData } = d;
            let transform;
            if (type === global_d_1.DIRECTION.HORIZONTAL) {
                transform = `translate(${labelSize * index}, 0)`;
            }
            else {
                transform = `translate(0, ${labelSize * index})`;
            }
            return (React.createElement("g", { key: index, transform: transform },
                React.createElement(LabelGroup_1.default, { scrollOffsetConfig: scrollOffsetConfig, containerSize: containerSize, labelHeight: labelSize, size: size, type: type, data: treeData })));
        });
    }
    render() {
        return React.createElement("g", null, this.renderLabelGroupTree());
    }
}
exports.default = LabelGroupTree;
