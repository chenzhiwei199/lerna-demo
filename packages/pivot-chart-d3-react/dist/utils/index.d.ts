export declare function getTextWidth(text: any, font: any): any;
export declare function getVisbileInfo(startOffset: any, endOffset: any): void;
/**
 *
 * @param starOffset 前面滚动距离
 * @param endOffset  后面的滚动距离
 * @param size 当前容器大小
 * @param cellSize 最小单元宽度
 */
export declare function getCellConfig(starOffset: any, endOffset: any, size: any, containerSize: any, cellSize: any): {
    startOffset: any;
    endOffset: any;
    startIndex: any;
    endIndex: any;
};
