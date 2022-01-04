export function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas =
    window.getTextWidth.canvas ||
    (window.getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function getOffsetIndex(offset, cellSize) {
  const scrollItemIndex = offset / cellSize;
  const offsetIndex = Math.floor(scrollItemIndex);
  return offsetIndex;
}

export function getVisbileInfo(startOffset, endOffset) {}
/**
 *
 * @param starOffset 前面滚动距离
 * @param endOffset  后面的滚动距离
 * @param size 当前容器大小
 * @param cellSize 最小单元宽度
 */
export function getCellConfig(
  starOffset,
  endOffset,
  size,
  containerSize,
  cellSize
) {
  let max = 0;
  let startIndex;
  let endIndex;
  let cellStartOffset;
  let cellEndOffset;
  cellStartOffset = starOffset % cellSize;
  startIndex = getOffsetIndex(starOffset, cellSize);
  if (containerSize < size) {
    endIndex =
      startIndex + Math.ceil((containerSize - cellStartOffset) / cellSize);
  } else {
    max = size / cellSize;
    endIndex = max - getOffsetIndex(endOffset, cellSize);
  }
  cellEndOffset = endOffset % cellSize;
  return {
    startOffset: cellStartOffset,
    endOffset: cellEndOffset,
    startIndex: startIndex || 0,
    endIndex: endIndex || max,
  };
}
