import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import { useCanvasContext } from './CanvseContext';
import { getCalculateSizeFunc, useSyncZoomIdentity } from './utils';
import { Scale, useZoomContext } from './ZoomContext';

function toMini(transform: Scale) {
  return {
    ...transform,
    x: -transform.x,
    y: -transform.y,
    k:  1/ transform.k,
  }
}
export function MiniViewRect() {
  const rectRef = useRef(null);
  const GRef = useRef(null);
  const { setTransform, transform } = useZoomContext();
  const { x, y, k } = transform;
  const canvasContxt = useCanvasContext();
  const sizeFunc = getCalculateSizeFunc();
  const {
    margin,
    content,
    ratio,
    maxScale,
    width,
    layerHeight,
    cardHeight,
    height,
    layerWidth,
  } = canvasContxt;
  const {
    translateExtent,
    miniTranslateExtent,
    scaleV,
    leftDistance,
  } = sizeFunc(k);
  useSyncZoomIdentity(rectRef, 'mini');
  useEffect(() => {
    const selection = d3.select(rectRef.current);
    const zoom = d3
      .zoom()
      .scaleExtent([1 / maxScale, 1])
      .extent([
        [0, 0],
        [width, height],
      ])
      .translateExtent(miniTranslateExtent)
      .on('zoom', (event) => {
        // const eventTransform = {
        //   x: - event.transform.x,
        //   y: -event.transform.y,
        //   k: 1 / event.transform.k,
        // }
        const eventTransform = toMini(event.transform)
        const { preventScale } = sizeFunc(eventTransform.k);
        const newTransform = preventScale({ ...eventTransform }, transform.k);

        // d3.zoomIdentity.translate(eventTransform.x, eventTransform.y).scale(eventTransform.k)
        setTransform((transform) => {
          
          // console.log(
          //   'newTransform: ',
          //   event.transform,
          //   newTransform,
          //   transform
          // );
          if (
            eventTransform.k !== transform.k ||
            eventTransform.x !== transform.x ||
            eventTransform.y !== transform.y
          ) {
            console.log('eventTransform: ', eventTransform,transform, eventTransform.k !== transform.k,eventTransform.x !== transform.x , eventTransform.y !== transform.y);
            return {
              ...eventTransform,
              type: 'mini'
            };
          } else {
            return transform;
          }
        });
      });
    selection.call(zoom);
    return () => {
      selection.on('zoom', null);
    };
  }, [canvasContxt, k, x, y]);
  // 操作画布，拖动的是画布
  // 操作miniMap, 拖动的是窗口
  // 两者的行为是相反的
  return (
    <>
      <svg
        viewBox={` 0 0 ${layerWidth} ${layerHeight}`}
        width={width / ratio}
        height={height / ratio}
      >
        <rect
          width={'100%'}
          height={'100%'}
          fill={'white'}
          strokeWidth={layerWidth / width}
          stroke={'black'}
        ></rect>
        <g style={{ pointerEvents: 'none' }}>{content}</g>
        {/* 矩形模块要保持中间 */}
        <rect
          x={leftDistance - x}
          y={-y}
          style={{ cursor: 'move', pointerEvents: 'all' }}
          ref={rectRef}
          transform={` scale(${scaleV})`}
          width={width}
          height={height}
          stroke={'blue'}
          strokeWidth={10}
          fill={'transparent'}
        ></rect>
      </svg>
      <div>
        layerHeight: {layerHeight}
        <br />
        x1 {x} y1 {y} x: {translateExtent[0].join(',')}, y:{' '}
        {translateExtent[1].join(',')}
        k: {k}
      </div>
    </>
  );
}
