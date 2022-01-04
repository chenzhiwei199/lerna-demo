import * as d3 from 'd3';
import React, { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { useCanvasContext } from './CanvseContext';
import { useSvg } from './stage';
import { getCalculateSizeFunc, useSyncZoomIdentity } from './utils';
import { useZoomContext } from './ZoomContext';

export function OperateWrapper({ children }: { children: React.ReactNode }) {
  const svgElement = useSvg();
  const context = useZoomContext();
  const canvasContxt = useCanvasContext();
  const { setTransform, transform } = context;
  const { x, y, k } = transform;
  const sizeFuncs = getCalculateSizeFunc();
  const { translateExtent } = sizeFuncs(k);
  const GRef = useRef(null);
  useSyncZoomIdentity(svgElement);
  useEffect(() => {
    const selection = d3.select(svgElement.current);
    const zoom = d3
      .zoom()
      .scaleExtent([1 / canvasContxt.maxScale, canvasContxt.maxScale])
      .translateExtent(translateExtent)
      .on('zoom', (event) => {
        const eventTransform = event.transform;
        const { preventScale } = sizeFuncs(eventTransform.k);
        // d3.zoomIdentity.translate(eventTransform.x, eventTransform.y).scale(eventTransform.k)
        setTransform({
          ...preventScale(eventTransform, transform.k),
          ...eventTransform,
          type: 'tree'
        });
      });
    selection.call(zoom as any);
    return () => {
      selection.on('zoom', null);
    };
  }, [svgElement, context, k, x, y]);

  return (
    <g className={'operate-wrapper'}>
      <g ref={GRef} transform={`translate(${x}, ${y}) scale(${k})`}>
        {children}
      </g>
    </g>
  );
}
