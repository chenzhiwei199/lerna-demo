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
const global_d_1 = require("../../global.d");
const SizeOptions_1 = require("../../help/SizeOptions");
const chartUtils_1 = require("../../utils/chartUtils");
const v1_1 = __importDefault(require("uuid/v1"));
const Scroller_1 = __importDefault(require("../Scroller"));
const Offset_1 = __importDefault(require("../../help/Offset"));
const AxisGroup_1 = __importDefault(require("../Groups/AxisGroup"));
const ScrollWrapper_1 = require("../ScrollWrapper");
const MaskAndScrollWrapper_1 = __importDefault(require("../MaskAndScrollWrapper"));
class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.onScrollPositionChange = (scrollInfo, direction, diff) => {
            const beforeScrollDistance = this.getScrollType(direction);
            let scrollDistance = diff + beforeScrollDistance;
            // 防止滚动出去
            scrollDistance = Math.max(0, scrollDistance);
            scrollDistance = Math.min(scrollInfo.viewMaxScroll, scrollDistance);
            if (scrollDistance !== beforeScrollDistance) {
                this.setScrollSize(direction, scrollDistance);
            }
        };
        this.state = {};
        this.creatId = '';
        this.dom = null;
        this.wheelEventListener = () => { };
    }
    bindEvent() {
        const { sizeConfig, realSizeConfig, sizeOptions } = this.props.config;
        const graphSize = sizeOptions.get().get(SizeOptions_1.ELEMENT_TYPE.GEOM);
        const scrollSize = {
            width: graphSize.getWidth(),
            height: graphSize.getHeight(),
        };
        const xScrollInfo = chartUtils_1.getScollInfo(scrollSize.width, realSizeConfig.width);
        const yScrollInfo = chartUtils_1.getScollInfo(scrollSize.height, realSizeConfig.height);
        // 滑轮滚动事件
        if (this.dom) {
            this.dom.removeEventListener('wheel', this.wheelEventListener);
        }
        this.wheelEventListener = (e = {}) => {
            const { deltaY, deltaX } = e;
            this.onScrollPositionChange(xScrollInfo, global_d_1.DIRECTION.HORIZONTAL, deltaX);
            this.onScrollPositionChange(yScrollInfo, global_d_1.DIRECTION.VERTICAL, deltaY);
            e.preventDefault();
        };
        if (this.dom) {
            this.dom.addEventListener('wheel', this.wheelEventListener);
        }
    }
    componentDidMount() {
        this.creatId = v1_1.default();
        this.bindEvent();
    }
    componentDidUpdate() {
        this.bindEvent();
    }
    getScrollConfig(sizeConfig, sizeOptions) {
        const { width, height } = sizeConfig;
        const sizeMap = sizeOptions.get();
        const scrollSizeOptions = sizeMap.get(SizeOptions_1.ELEMENT_TYPE.SCROLLER);
        const graphSizeOptions = sizeMap.get(SizeOptions_1.ELEMENT_TYPE.GEOM);
        const measureSizeOptions = sizeMap.get(SizeOptions_1.ELEMENT_TYPE.MEASURE_LABEL);
        const facetSizeOptions = sizeMap.get(SizeOptions_1.ELEMENT_TYPE.FACET_LABEL);
        const xScrollOffset = new Offset_1.default(width -
            graphSizeOptions.getSize('width') -
            scrollSizeOptions.getY().getSize('width'), height - scrollSizeOptions.getX().getSize('height'));
        const yScrollOffset = new Offset_1.default(width - scrollSizeOptions.getY().getSize('width'), facetSizeOptions.getHeight());
        return {
            xScrollOffset,
            yScrollOffset,
        };
    }
    getScrollType(direction) {
        return this.state[`scrollDistance_${direction}`] || 0;
    }
    setScrollSize(direction, size) {
        this.setState({
            [`scrollDistance_${direction}`]: size,
        });
    }
    render() {
        const { config } = this.props;
        const { data, axisConfig, geomInstance, graphDataConfig, realSizeConfig, sizeConfig, sizeOptions, positionsConfig, axisDataConfig, facetDataConfig, cellSizeConfig, } = config;
        const { x, y } = positionsConfig;
        const { x: xAxisData, y: yAxisData } = axisDataConfig;
        const { x: xGraphData, y: yGraphData } = graphDataConfig;
        const { x: xFacetData, y: yFacetData } = facetDataConfig;
        const { width: cellWidth, height: cellHeight } = cellSizeConfig;
        const graphSize = sizeOptions.get().get(SizeOptions_1.ELEMENT_TYPE.GEOM);
        const axisSize = sizeOptions.get().get(SizeOptions_1.ELEMENT_TYPE.AXIS);
        const measureSize = sizeOptions
            .get()
            .get(SizeOptions_1.ELEMENT_TYPE.MEASURE_LABEL);
        const facetSize = sizeOptions
            .get()
            .get(SizeOptions_1.ELEMENT_TYPE.FACET_LABEL);
        const creatId = this.creatId;
        const scrollSize = {
            width: graphSize.getWidth(),
            height: graphSize.getHeight(),
        };
        const padding = geomInstance.getPadding(x, y);
        const isXShowMeasureName = chartUtils_1.checkIsLinear(x.map(item => item.type));
        const isYShowMeasureName = chartUtils_1.checkIsLinear(y.map(item => item.type));
        const { isXShowScroll, isYShowScroll } = axisConfig;
        const { xScrollOffset, yScrollOffset } = this.getScrollConfig(config.sizeConfig, config.sizeOptions);
        const xScrollInfo = chartUtils_1.getScollInfo(scrollSize.width, realSizeConfig.width);
        const yScrollInfo = chartUtils_1.getScollInfo(scrollSize.height, realSizeConfig.height);
        const scrollOffsetX = this.getScrollType(global_d_1.DIRECTION.HORIZONTAL);
        const scrollOffsetY = this.getScrollType(global_d_1.DIRECTION.VERTICAL);
        const scrollBarOffsetX = (scrollOffsetX / xScrollInfo.viewMaxScroll) * xScrollInfo.maxScroll || 0;
        const scrollBarOffsetY = (scrollOffsetY / yScrollInfo.viewMaxScroll) * yScrollInfo.maxScroll || 0;
        // const { xMeasureOffset, yMeasureOffset } = this.getMeasureLabelConfig(config.sizeConfig, config.sizeOptions);
        const scrollOffsetConfig = {
            offsetX: scrollOffsetX,
            offsetY: scrollOffsetY,
        };
        const newConfig = {
            ...config,
            scrollOffsetConfig,
            graphMaskId: creatId,
            padding,
        };
        let xScroller;
        let yScroller;
        if (isXShowScroll) {
            xScroller = (React.createElement("g", { transform: xScrollOffset.toTransform() },
                React.createElement(Scroller_1.default, { sizeConfig: scrollSize, updateScrollPosition: this.onScrollPositionChange.bind(this, xScrollInfo), realSizeConfig: config.realSizeConfig, offset: scrollBarOffsetX, direction: global_d_1.DIRECTION.HORIZONTAL })));
        }
        if (isYShowScroll) {
            yScroller = (React.createElement("g", { transform: yScrollOffset.toTransform() },
                React.createElement(Scroller_1.default, { updateScrollPosition: this.onScrollPositionChange.bind(this, yScrollInfo), sizeConfig: scrollSize, realSizeConfig: config.realSizeConfig, direction: global_d_1.DIRECTION.VERTICAL, offset: scrollBarOffsetY })));
        }
        const graphOffset = chartUtils_1.getGraphOffset(sizeOptions);
        const xFacetOffset = chartUtils_1.getXFacetOffset(sizeOptions);
        const yFacetOffset = chartUtils_1.getYFacetOffset(sizeOptions);
        const xMeasureNameOffset = chartUtils_1.getXMeasureNameOffset(sizeOptions);
        const yMeasureNameOffset = chartUtils_1.getYMeasureNameOffset(sizeOptions);
        const xAxisOffset = chartUtils_1.getXAxisOffset(sizeOptions);
        const yAxisOffset = chartUtils_1.getYAxisOffset(sizeOptions);
        const yAxisMaskSize = {
            ...graphSize.transform2Size(),
            width: axisSize.getWidth(),
        };
        const xAxisMaskSize = {
            ...graphSize.transform2Size(),
            height: axisSize.getHeight(),
        };
        const xMeasureMaskSize = {
            ...graphSize.transform2Size(),
            height: measureSize.getHeight(),
        };
        const yMeasureMaskSize = {
            ...graphSize.transform2Size(),
            width: measureSize.getWidth(),
        };
        const xFacetMaskSize = {
            ...graphSize.transform2Size(),
            height: facetSize.getHeight(),
        };
        const yFacetMaskSize = {
            ...graphSize.transform2Size(),
            width: facetSize.getWidth(),
        };
        console.log('scrollOffsetConfig', scrollOffsetConfig);
        return (React.createElement("svg", { width: this.props.width, height: this.props.height, ref: dom => {
                this.dom = dom;
            } },
            React.createElement(MaskAndScrollWrapper_1.default, { id: `y-axis-${creatId}`, transform: yAxisOffset.toTransform(), maskSizeConfig: yAxisMaskSize, scrollType: ScrollWrapper_1.SCROLL_TYPE.Y },
                React.createElement("g", { transform: `translate(${axisSize.getWidth()}, 0)` },
                    React.createElement(AxisGroup_1.default, { scrollOffsetConfig: scrollOffsetConfig, containerSize: graphSize.getHeight(), data: yAxisData, size: cellHeight, gapStart: padding[0], gapEnd: padding[2], axisHeight: axisSize.getWidth(), type: global_d_1.DIRECTION.VERTICAL }))),
            yScroller,
            xScroller));
    }
}
exports.default = Chart;
