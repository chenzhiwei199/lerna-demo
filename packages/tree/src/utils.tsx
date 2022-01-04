import * as d3 from 'd3';
import React from 'react';
import { MutableRefObject, useMemo } from 'react';
import { useCanvasContext } from './CanvseContext';
import { useZoomContext } from './ZoomContext';

export const getCalculateSizeFunc = () => {
  const canvasContxt = useCanvasContext();
  return (k: number) => {
    let {
      layerWidth,
      width,
      layerHeight,
      height,
      leftLayerWidth,
      rightLayerWidth,
      cardHeight,
      margin,
    } = canvasContxt;
    const scaleV = 1 / k;
    // scale是对画布的放大
    layerWidth = layerWidth * k
    leftLayerWidth = leftLayerWidth * k
    layerHeight = layerHeight * k
    rightLayerWidth = rightLayerWidth * k
    
    const diffWidth = layerWidth - width;
    // 窗口左侧距离世界左侧的距离
    const leftDistance = leftLayerWidth - width / 2;
    const allLayerWidth = leftLayerWidth + rightLayerWidth;
    // 窗口右侧距离世界右侧的距离
    const rightDistance = rightLayerWidth - width / 2;
    const topDistance = layerHeight;
    const bottomDistance = layerHeight;
    // translate会被scale影响，这里要抹去影响
    const translateExtent = [
      [-leftDistance / k  , 0],
      [
        (allLayerWidth - leftDistance )  / k,
        // layerHeight 包含了上边距和 卡片高度 layerHeight - margin.top - cardHeight = 窗口下边缘距离时间下边界的高度
        layerHeight / k,
        // (layerHeight - margin.top - cardHeight + margin.bottom) / k,
      ],
    ] as [[number, number], [number, number]];
    
    // 这里需要以rect为边界来设置世界的大小
    const miniTranslateExtent = [
      // 1. 右侧可以移动的距离  2. 高度剩余的空间
      [-rightDistance * k, -(layerHeight - height) * k],
      // 1. 窗口宽度 + 左侧可以移动的距离 2. 时间的下边界，应该就是高度
      [(width + leftDistance) * k , height * k],
    ] as [[number, number], [number, number]];
    return {
      miniTranslateExtent,
      translateExtent,
      scaleWidth: width,
      scaleHeight: height,
      diffWidth,
      preventScale: (
        eventTransform: { x: number; y: number; k: number },
        preK: number
      ) => {
        if (eventTransform.k !== preK) {
          // 防止缩放的时候产生位移，效果不佳
          let { x, y } = eventTransform;

          if (eventTransform.k < preK && x !== 0 && y !== 0) {
            // 约束的算法  this.x  / k  < translateExtend[0][0]
            // this.x = translateExtend[0][0]  * k
            // 左侧距离
            const isPositive = x === 0 || x / Math.abs(x) > 0;
            if (isPositive) {
              if (eventTransform.x > rightDistance * eventTransform.k) {
                x = rightDistance * eventTransform.k;
              }
            } else {
              if (
                Math.abs(eventTransform.x) >
                leftDistance * eventTransform.k
              ) {
                x = -leftDistance * eventTransform.k;
              }
            }
            if (y > bottomDistance * eventTransform.k) {
              y = bottomDistance * eventTransform.k;
            } else if (y < 0) {
              y = 0;
            }
          } else {
            // 缩小
          }
          return { x: x, y: y, k: eventTransform.k };
        } else {
          return eventTransform;
        }
      },
      leftDistance,
      rightDistance,
      topDistance,
      bottomDistance,
      scaleV,
    };
  };
};

export function usePrevious<T>(value: T) {
  const ref = React.useRef<T>()
  React.useEffect(() => {
    ref.current = value
  })
  return ref.current
}
export function useSyncZoomIdentity(
  ref: MutableRefObject<any>,
  defineType: "tree" | 'mini'  = 'tree'
) {
  const { transform } = useZoomContext();
  const { x, y, k, type } = transform;
  React.useEffect(() => {
    if (ref.current) {
      const selection = d3.select(ref.current);
      if(defineType !== type || type === null) {
        if(defineType === 'mini' ) {
          d3.zoom().transform(
            selection,
            d3.zoomIdentity.translate(-x, -y).scale( 1/ k)
          );
        } else if(defineType === 'tree') {
          d3.zoom().transform(
            selection,
            d3.zoomIdentity.translate(x, y).scale(k)
          );
        } 
        
      }
    }
    // d3.zoomIdentity.translate(x, y).scale(k)
  }, [x, y, k, type]);
}
