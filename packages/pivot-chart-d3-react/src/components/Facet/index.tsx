import * as React from 'react';
import {
  DIRECTION,
  OffsetConfig,
  Cell,
  VisibleConfig,
  VisibleCell,
} from '../../global.d';
import { getCellConfig } from '../../utils';

export interface Field {
  data?: any[];
  size?: number;
  containerSize?: number;
  gapStart?: number;
}

export interface FacetProps {
  xField?: Field;
  yField?: Field;
  isTransform?: boolean;
  scrollOffsetConfig: OffsetConfig;
  renderFacetCell: (
    visibleSize: VisibleConfig | VisibleCell,
    cell1: Cell,
    cell2?: Cell
  ) => JSX.Element;
}

class Facet extends React.Component<FacetProps> {
  constructor(props: FacetProps) {
    super(props);
  }

  public getStartAndEnd(
    scrollStartOffst: number,
    cellSize: number,
    containerSize: number
  ) {
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
    const visibleEntireCount =
      (containerSize - firstUseSize - lastUseSize) / cellSize;
    const endIndex =
      visibleEntireCount + startIndex + (lastUseSize > 0 ? 1 : 0);
    const endOffset = cellSize - lastUseSize;
    return {
      startIndex,
      endIndex,
      startOffset,
      endOffset,
    };
  }

  public getRenderType() {
    const { xField, yField } = this.props;
    if (xField && yField) {
      return FACET_TYPE.ALL;
    } else if (xField) {
      return FACET_TYPE.X;
    } else if (yField) {
      return FACET_TYPE.Y;
    }
  }

  public renderFacet() {
    const {
      xField,
      yField,
      renderFacetCell,
      scrollOffsetConfig,
      isTransform = true,
    } = this.props;

    let {
      data: xData,
      size: xSize = 0,
      gapStart: xGapStart = 0,
      containerSize: xContainerSize = 0,
    } = xField || ({} as Field);
    let {
      data: yData,
      size: ySize = 0,
      gapStart: yGapStart = 0,
      containerSize: yContainerSize = 0,
    } = yField || ({} as Field);
    const {
      startIndex: xStart,
      endIndex: xEnd,
      startOffset: xStartOffset,
      endOffset: xEndOffset,
    } = this.getStartAndEnd(scrollOffsetConfig.offsetX, xSize, xContainerSize);
    const {
      startIndex: yStart,
      endIndex: yEnd,
      startOffset: yStartOffset,
      endOffset: yEndOffset,
    } = this.getStartAndEnd(scrollOffsetConfig.offsetY, ySize, yContainerSize);
    console.log(
      'facet x ',
      this.getStartAndEnd(scrollOffsetConfig.offsetX, xSize, xContainerSize)
    );
    console.log(
      'facet y ',
      this.getStartAndEnd(scrollOffsetConfig.offsetY, ySize, yContainerSize)
    );

    const nodes = [] as any;
    const visibleSize = {
      x: { startOffset: xStartOffset, endOffset: xEndOffset },
      y: { startOffset: yStartOffset, endOffset: yEndOffset },
    } as VisibleConfig;

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
        const fragment = [] as any;
        const xOffset = xSize && isTransform ? xSize * (xIndex - xStart) : 0;
        // 单向分面的时候xSize不存在
        const xTransform = `translate(${xOffset}, 0)`;
        (yData as any).forEach((y, yIndex) => {
          if (yIndex >= yStart && yIndex <= yEnd) {
            const currentYIndex = yIndex - yStart;
            const yOffset = ySize && isTransform ? ySize * currentYIndex : 0;
            const currentYStartOffset =
              currentYIndex !== 0 ? visibleSize.y.startOffset : 0;
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
            } else if (renderType === FACET_TYPE.X) {
              // 水平分面
              section = renderFacetCell(visibleSize.x, x);
            } else if (renderType === FACET_TYPE.Y) {
              // 垂直分面
              section = renderFacetCell(visibleSize.y, y);
            }
            fragment.push(
              <g key={yIndex} className="col" transform={yTransform}>
                <g
                  transform={
                    yGapStart ? `translate(${0}, ${yGapStart})` : undefined
                  }
                >
                  {section}
                </g>
              </g>
            );
          } else {
            fragment.push('');
          }
        });

        nodes.push(
          <g key={xIndex} className="row" transform={xTransform}>
            <g transform={xGapStart ? `translate(${xGapStart}, 0)` : undefined}>
              {fragment}
            </g>
          </g>
        );
      } else {
        nodes.push('');
      }
    });
    return <g>{nodes}</g>;
  }
  public render() {
    return <g>{this.renderFacet()}</g>;
  }
}

export default Facet;

export enum FACET_TYPE {
  X = 'x',
  Y = 'y',
  ALL = 'all',
}
