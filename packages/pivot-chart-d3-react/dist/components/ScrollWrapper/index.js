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
const Offset_1 = __importDefault(require("../../help/Offset"));
class ScrollWrapper extends React.Component {
    constructor(props) {
        super(props);
    }
    getTransform() {
        const { scrollOffset, type } = this.props;
        let transform;
        switch (type) {
            case SCROLL_TYPE.ALL:
                transform = new Offset_1.default(-scrollOffset.offsetX, -scrollOffset.offsetY);
                break;
            case SCROLL_TYPE.X:
                transform = new Offset_1.default(-scrollOffset.offsetX, 0);
                break;
            case SCROLL_TYPE.Y:
                transform = new Offset_1.default(0, -scrollOffset.offsetY);
                break;
            default:
                transform = new Offset_1.default(-scrollOffset.offsetX, -scrollOffset.offsetY);
                break;
        }
        return transform.toTransform();
    }
    render() {
        return (React.createElement("g", { className: "scroll_wrapper", transform: this.getTransform() }, this.props.children));
    }
}
exports.default = ScrollWrapper;
var SCROLL_TYPE;
(function (SCROLL_TYPE) {
    SCROLL_TYPE["X"] = "x";
    SCROLL_TYPE["Y"] = "y";
    SCROLL_TYPE["ALL"] = "all";
})(SCROLL_TYPE = exports.SCROLL_TYPE || (exports.SCROLL_TYPE = {}));
