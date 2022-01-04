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
const d3 = __importStar(require("d3"));
const color_1 = __importDefault(require("../../utils/color"));
const chartUtils_1 = require("../../utils/chartUtils");
const Point_1 = __importDefault(require("../../help/Point"));
const global_d_1 = require("../../global.d");
const Line_1 = __importDefault(require("../Line"));
class Scroller extends React.Component {
    constructor(props) {
        super(props);
        this.scrollGap = 3;
        this.scrollSize = 15;
        this.minSize = 18;
        this.scrollBar = null;
    }
    bindEvents() {
        const { direction, updateScrollPosition } = this.props;
        const { scrollInfo } = this.getScrollConfig();
        const { viewMaxScroll, maxScroll } = scrollInfo;
        // 拖拽事件
        this.dragBehaviour = d3.drag().on('drag', () => {
            const ds = direction === global_d_1.DIRECTION.HORIZONTAL ? d3.event.dx : d3.event.dy;
            if (updateScrollPosition) {
                updateScrollPosition(direction, (ds / maxScroll) * viewMaxScroll);
            }
        });
        d3.select(this.scrollBar).call(this.dragBehaviour);
    }
    componentDidMount() {
        this.bindEvents();
    }
    componentDidUpdate() {
        this.bindEvents();
    }
    getScrollConfig() {
        const { offset, direction, sizeConfig, realSizeConfig } = this.props;
        const size = this.scrollSize;
        let scrollInfo;
        let scrollBarHeight;
        let scrollBarWidth;
        let scrollX;
        let scrollY;
        let scrollContainerWidth;
        let scrollContainerHeight;
        let scrollLinePointLeft;
        let scrollLinePointRight;
        const scrollInnerSize = size - 2 * this.scrollGap;
        let transform = '';
        if (direction === global_d_1.DIRECTION.HORIZONTAL) {
            scrollInfo = chartUtils_1.getScollInfo(sizeConfig.width, realSizeConfig.width);
            scrollBarHeight = scrollInnerSize;
            scrollBarWidth = scrollInfo.scrollBarSize;
            scrollX = 0;
            scrollY = this.scrollGap;
            scrollContainerWidth = sizeConfig.width;
            scrollContainerHeight = size;
            transform = `translate(${offset}, ${0})`;
            scrollLinePointLeft = [new Point_1.default(0, 0), new Point_1.default(sizeConfig.width, 0)];
            scrollLinePointRight = [
                new Point_1.default(0, size),
                new Point_1.default(sizeConfig.width, size),
            ];
        }
        else {
            scrollInfo = chartUtils_1.getScollInfo(sizeConfig.height, realSizeConfig.height);
            scrollBarHeight = scrollInfo.scrollBarSize;
            scrollBarWidth = scrollInnerSize;
            scrollX = this.scrollGap;
            scrollY = 0;
            transform = `translate(${0}, ${offset})`;
            scrollContainerWidth = size;
            scrollContainerHeight = sizeConfig.height;
            scrollLinePointLeft = [new Point_1.default(0, 0), new Point_1.default(0, sizeConfig.height)];
            scrollLinePointRight = [
                new Point_1.default(size, 0),
                new Point_1.default(size, sizeConfig.height),
            ];
        }
        return {
            scrollInfo,
            transform,
            scrollBarHeight,
            scrollBarWidth,
            scrollX,
            scrollY,
            scrollContainerWidth,
            scrollContainerHeight,
            scrollLinePointLeft,
            scrollLinePointRight,
            scrollInnerSize,
        };
    }
    render() {
        const { transform, scrollBarHeight, scrollBarWidth, scrollX, scrollY, scrollContainerWidth, scrollContainerHeight, scrollLinePointLeft, scrollLinePointRight, scrollInnerSize, } = this.getScrollConfig();
        return (React.createElement("g", null,
            React.createElement("rect", { width: scrollContainerWidth, height: scrollContainerHeight, fill: color_1.default.SCROLL_CONTAINER }),
            React.createElement(Line_1.default, { points: scrollLinePointLeft }),
            React.createElement(Line_1.default, { points: scrollLinePointRight }),
            React.createElement("rect", { ref: scrollBar => {
                    this.scrollBar = scrollBar;
                }, fill: color_1.default.SCROLL_BAR, height: scrollBarHeight, width: scrollBarWidth, transform: transform, rx: scrollInnerSize / 2, ry: scrollInnerSize / 2, x: scrollX, y: scrollY })));
    }
}
Scroller.defaultProps = {
    direction: global_d_1.DIRECTION.HORIZONTAL,
};
exports.default = Scroller;
