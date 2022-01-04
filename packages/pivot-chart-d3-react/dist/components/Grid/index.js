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
const global_d_1 = require("../../global.d");
const Line_1 = __importDefault(require("../Line"));
const Point_1 = __importDefault(require("../../help/Point"));
const matrix_1 = require("../../utils/matrix");
const core_1 = require("../ReAxis/core");
class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.axis = null;
    }
    renderGrid() {
        const { type, cell, size, gridSize } = this.props;
        // martrix = b2lMatrix;
        const scale = core_1.getScale(cell.type, cell.range, size);
        const matrix = chartUtils_1.getMatrix(type, size);
        const ticks = chartUtils_1.checkIsCategory(cell.type) ? cell.range : scale.ticks([3]);
        return ticks.map((tick, index) => {
            let points;
            let currentPosition = scale(tick);
            if (type === global_d_1.DIRECTION.HORIZONTAL) {
                // 需要矩阵进行转换
                const [currentX, currentY] = matrix_1.matrixMultiplication([[0, currentPosition, 1]], matrix)[0];
                currentPosition = currentY;
                points = [
                    new Point_1.default(0, currentPosition),
                    new Point_1.default(gridSize, currentPosition),
                ];
            }
            else {
                points = [
                    new Point_1.default(currentPosition, 0),
                    new Point_1.default(currentPosition, gridSize),
                ];
            }
            return React.createElement(Line_1.default, { key: index, points: points, size: 1 });
        });
    }
    render() {
        return React.createElement("g", { className: "grid" }, this.renderGrid());
    }
}
exports.default = Grid;
