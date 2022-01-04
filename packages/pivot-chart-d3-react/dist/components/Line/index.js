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
const color_1 = __importDefault(require("../../utils/color"));
class Line extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { size = 2, points } = this.props;
        const [p1, p2] = points;
        return (React.createElement("line", { strokeWidth: size, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: color_1.default.GRID }));
    }
}
exports.default = Line;
