"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getScollInfo(containerSize, realSize) {
    // 滚动条宽度 (容器宽度 / 实际宽度)  = 滚动条宽度 / 容器宽度
    const scrollBarSize = containerSize / realSize * containerSize;
    // 最大的滚动距离,
    const maxScroll = Math.max(containerSize - scrollBarSize, 0);
    // 视图最大的滚动距离
    const viewMaxScroll = realSize - containerSize;
    return {
        scrollBarSize, maxScroll, viewMaxScroll,
    };
}
exports.getScollInfo = getScollInfo;
