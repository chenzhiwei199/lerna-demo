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
const ScrollWrapper_1 = __importDefault(require("../ScrollWrapper"));
const Mask_1 = __importDefault(require("../Mask"));
class MaskAndScrollWrapper extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { id, transform, maskSizeConfig, scrollType, scrollOffsetConfig, } = this.props;
        return (React.createElement(Mask_1.default, { id: id, className: id, transform: transform, sizeConfig: maskSizeConfig },
            React.createElement(ScrollWrapper_1.default, { type: scrollType, scrollOffset: scrollOffsetConfig }, this.props.children)));
    }
}
MaskAndScrollWrapper.defaultProps = {
    scrollOffsetConfig: {
        offsetX: 0,
        offsetY: 0,
    },
};
exports.default = MaskAndScrollWrapper;
