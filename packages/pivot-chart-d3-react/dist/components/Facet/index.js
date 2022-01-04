"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
class Facet extends React.Component {
    constructor(props) {
        super(props);
    }
    getStartAndEnd(scrollStartOffst, cellSize, containerSize) {
        if (cellSize === containerSize) {
            return {
                startIndex: 0,
                endIndex: 0,
                startOffset: 0,
                endOffset: 0,
            };
        }
        if (cellSize === containerSize) {
            return {
                startIndex: 0,
                endIndex: 0,
                startOffset: 0,
                endOffset: 0,
            };
        }
        const startOffset = scrollStartOffst % cellSize;
        const startIndex = Math.floor(scrollStartOffst / cellSize);
        const firstUseSize = cellSize - startOffset;
        if (firstUseSize > containerSize) {
            // 一个元素占满了容器
            return {
                startIndex,
                endIndex: startIndex + 1,
                startOffset,
                endOffset: cellSize - startOffset - containerSize,
            };
        }
        const lastUseSize = (containerSize - firstUseSize) % cellSize;
        const visibleEntireCount = (containerSize - firstUseSize - lastUseSize) / cellSize;
        const endIndex = visibleEntireCount + startIndex + (lastUseSize > 0 ? 1 : 0);
        const endOffset = cellSize - lastUseSize;
        return {
            startIndex,
            endIndex,
            startOffset,
            endOffset,
        };
    }
    getRenderType() {
        const { xField, yField } = this.props;
        if (xField && yField) {
            return FACET_TYPE.ALL;
        }
        else if (xField) {
            return FACET_TYPE.X;
        }
        else if (yField) {
            return FACET_TYPE.Y;
        }
    }
    renderFacet() {
        const { xField, yField, renderFacetCell, scrollOffsetConfig, isTransform = true, } = this.props;
        let { data: xData, size: xSize = 0, gapStart: xGapStart = 0, containerSize: xContainerSize = 0, } = xField || {};
        let { data: yData, size: ySize = 0, gapStart: yGapStart = 0, containerSize: yContainerSize = 0, } = yField || {};
        const { startIndex: xStart, endIndex: xEnd, startOffset: xStartOffset, endOffset: xEndOffset, } = this.getStartAndEnd(scrollOffsetConfig.offsetX, xSize, xContainerSize);
        const { startIndex: yStart, endIndex: yEnd, startOffset: yStartOffset, endOffset: yEndOffset, } = this.getStartAndEnd(scrollOffsetConfig.offsetY, ySize, yContainerSize);
        console.log('facet x ', this.getStartAndEnd(scrollOffsetConfig.offsetX, xSize, xContainerSize));
        console.log('facet y ', this.getStartAndEnd(scrollOffsetConfig.offsetY, ySize, yContainerSize));
        const nodes = [];
        const visibleSize = {
            x: { startOffset: xStartOffset, endOffset: xEndOffset },
            y: { startOffset: yStartOffset, endOffset: yEndOffset },
        };
        if (!xData || xData.length === 0) {
            xData = [undefined];
        }
        if (!yData || yData.length === 0) {
            yData = [undefined];
        }
        const renderType = this.getRenderType();
        // 水平分面
        xData.forEach((x, xIndex) => {
            if (xIndex >= xStart && xIndex <= xEnd) {
                const fragment = [];
                const xOffset = xSize && isTransform ? xSize * (xIndex - xStart) : 0;
                // 单向分面的时候xSize不存在
                const xTransform = `translate(${xOffset}, 0)`;
                yData.forEach((y, yIndex) => {
                    if (yIndex >= yStart && yIndex <= yEnd) {
                        const currentYIndex = yIndex - yStart;
                        const yOffset = ySize && isTransform ? ySize * currentYIndex : 0;
                        const currentYStartOffset = currentYIndex !== 0 ? visibleSize.y.startOffset : 0;
                        const yTransform = `translate(0, ${yOffset - currentYStartOffset})`;
                        if (currentYIndex !== 0) {
                            visibleSize.y.startOffset = 0;
                        }
                        if (yIndex !== yEnd) {
                            visibleSize.y.endOffset = 0;
                        }
                        let section;
                        if (renderType === FACET_TYPE.ALL) {
                            section = renderFacetCell(visibleSize, x, y);
                        }
                        else if (renderType === FACET_TYPE.X) {
                            // 水平分面
                            section = renderFacetCell(visibleSize.x, x);
                        }
                        else if (renderType === FACET_TYPE.Y) {
                            // 垂直分面
                            section = renderFacetCell(visibleSize.y, y);
                        }
                        fragment.push(React.createElement("g", { key: yIndex, className: "col", transform: yTransform },
                            React.createElement("g", { transform: yGapStart ? `translate(${0}, ${yGapStart})` : undefined }, section)));
                    }
                    else {
                        fragment.push('');
                    }
                });
                nodes.push(React.createElement("g", { key: xIndex, className: "row", transform: xTransform },
                    React.createElement("g", { transform: xGapStart ? `translate(${xGapStart}, 0)` : undefined }, fragment)));
            }
            else {
                nodes.push('');
            }
        });
        return React.createElement("g", null, nodes);
    }
    render() {
        return React.createElement("g", null, this.renderFacet());
    }
}
exports.default = Facet;
var FACET_TYPE;
(function (FACET_TYPE) {
    FACET_TYPE["X"] = "x";
    FACET_TYPE["Y"] = "y";
    FACET_TYPE["ALL"] = "all";
})(FACET_TYPE = exports.FACET_TYPE || (exports.FACET_TYPE = {}));
