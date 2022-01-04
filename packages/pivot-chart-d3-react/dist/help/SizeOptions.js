"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __importStar(require("d3"));
const DoubleElementOptions_1 = require("./DoubleElementOptions");
const ElementOptions_1 = require("./ElementOptions");
const global_d_1 = require("../global.d");
const chartUtils_1 = require("../utils/chartUtils");
const core_1 = require("../core");
class Size {
    constructor(config) {
        this.sizeMap = new Map();
        // 滚动条容器大小
        this.scrollSize = 15;
        // 滚动条容器与内部scrollBar的间距
        this.scrollGap = 3;
        // 分面标签的大小
        this.labelSize = 30;
        this.config = config;
        this.initSizeOptions();
    }
    measureScrollSize(axisConfig) {
        const { isXShowScroll, isYShowScroll } = axisConfig;
        const scrollSize = 15;
        // 滚动条大小
        const scrollHeight = 0;
        const scrollWidth = 0;
        // 减去滚动条的宽度和高度
        // if (isXShowScroll) {
        //   scrollHeight = scrollSize;
        // }
        // if (isYShowScroll) {
        //   scrollWidth = scrollSize;
        // }
        // TODO 默认留着滚动条宽度，等到后面抄vscode做成绝对定位的
        return {
            scrollWidth: scrollSize,
            scrollHeight: scrollSize,
        };
    }
    getScrollerSize(axisConfig) {
        // 滚动条的大小
        const { scrollHeight, scrollWidth } = this.measureScrollSize(axisConfig);
        return new DoubleElementOptions_1.DoubleElementOptions(0, scrollHeight, scrollWidth, 0);
    }
    getFacetLabelSize(dimensionsConfig) {
        const { x: xCategorys, y: yCategorys } = dimensionsConfig;
        // 滚动条的大小
        // 分面文本标签的高度和宽度
        const xLabelHeight = xCategorys.length * this.labelSize;
        const yLabelWidth = yCategorys.length * this.labelSize;
        return new DoubleElementOptions_1.DoubleElementOptions(0, xLabelHeight, yLabelWidth, 0);
    }
    getMeasureContiner() {
        const contaienr = d3.select('body').append('svg');
        return contaienr;
    }
    measureAxisSize(container, width, type, cells, isLabelRotate = false) {
        let size = 0;
        cells.forEach(cell => {
            if (chartUtils_1.checkIsCategory(cell.type)) {
                cell = { ...cell };
                cell.range = [
                    cell.range.reduce((max, item) => {
                        const currentLength = item ? item.length : 0;
                        return currentLength > max.length ? item : max;
                    }, ''),
                ];
            }
            const currentSize = core_1.drawAxis(container, width, type, cell, true, isLabelRotate);
            size = currentSize > size ? currentSize : size;
        });
        container.remove();
        // 旋转文本需要偏移tickLine的高度
        return size + 30;
    }
    getAxisSize(sizeConfig, positionConfig, graphDataConfig) {
        const { x: xPosition, y: yPositions } = positionConfig;
        const { width, height } = sizeConfig;
        const { x: xData } = graphDataConfig;
        // 滚动条的大小
        // 分面文本标签的高度和宽度
        // 测量坐标轴的宽度和高度
        const labelRotate = chartUtils_1.isRotate(xData);
        const xAxisHeight = this.measureAxisSize(this.getMeasureContiner(), width, global_d_1.DIRECTION.HORIZONTAL, xPosition, labelRotate);
        const yAxisWidth = this.measureAxisSize(this.getMeasureContiner(), height, global_d_1.DIRECTION.VERTICAL, yPositions, labelRotate);
        return new DoubleElementOptions_1.DoubleElementOptions(0, xAxisHeight, yAxisWidth, 0);
    }
    sumSize(sizes, key) {
        let sum = 0;
        sizes.forEach(size => {
            sum = sum + size.getSize(key);
        });
        return sum;
    }
    getGraphSize(sizeConfig) {
        const { width, height } = sizeConfig;
        const sizes = Array.from(this.sizeMap.keys())
            .filter(item => item !== ELEMENT_TYPE.GEOM)
            .map(key => this.sizeMap.get(key));
        // 绘图容器的大小
        const graphHeight = height - this.sumSize(sizes, 'height');
        const graphWidth = width - this.sumSize(sizes, 'width');
        return new ElementOptions_1.ElementOptions(graphWidth, graphHeight);
    }
    getMeasureNameContainerSize(positionConfig) {
        const { x, y } = positionConfig;
        let yMeasureNameWidth = 0;
        let xMeasureNameHeight = 0;
        if (chartUtils_1.checkIsLinear(x.map(item => item.type))) {
            xMeasureNameHeight = this.labelSize;
        }
        if (chartUtils_1.checkIsLinear(y.map(item => item.type))) {
            yMeasureNameWidth = this.labelSize;
        }
        // return new DoubleElementOptions(0, 0, 0, 0);
        return new DoubleElementOptions_1.DoubleElementOptions(0, xMeasureNameHeight, yMeasureNameWidth, 0);
    }
    initSizeOptions() {
        const { axisConfig, dimensionsConfig, positionConfig, graphDataConfig, sizeConfig, } = this.config;
        this.sizeMap.set(ELEMENT_TYPE.SCROLLER, this.getScrollerSize(axisConfig));
        this.sizeMap.set(ELEMENT_TYPE.FACET_LABEL, this.getFacetLabelSize(dimensionsConfig));
        this.sizeMap.set(ELEMENT_TYPE.AXIS, this.getAxisSize(sizeConfig, positionConfig, graphDataConfig));
        this.sizeMap.set(ELEMENT_TYPE.MEASURE_LABEL, this.getMeasureNameContainerSize(positionConfig));
        this.sizeMap.set(ELEMENT_TYPE.GEOM, this.getGraphSize(sizeConfig));
    }
    get() {
        return this.sizeMap;
    }
}
exports.default = Size;
var ELEMENT_TYPE;
(function (ELEMENT_TYPE) {
    ELEMENT_TYPE["AXIS"] = "AXIS";
    ELEMENT_TYPE["GRID"] = "GRID";
    ELEMENT_TYPE["FACET_LABEL"] = "FACET_LABEL";
    ELEMENT_TYPE["MEASURE_LABEL"] = "MEASURE_LABEL";
    ELEMENT_TYPE["SCROLLER"] = "SCROLLER";
    ELEMENT_TYPE["GEOM"] = "GEOM";
})(ELEMENT_TYPE = exports.ELEMENT_TYPE || (exports.ELEMENT_TYPE = {}));
