import * as d3 from 'd3';
import React, { useEffect, useMemo, useState } from 'react';
import { Scale, ZoomContext } from './ZoomContext';

export function ZoomContainer({
  children,
  defaultPosition,
}: {
  children: React.ReactNode;
  defaultPosition: { x: number; y: number };
}) {
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    k: 1,
    type: null,
    ...defaultPosition
  } as Scale);
  useMemo(() => {
    d3.zoomIdentity.translate(transform.x, transform.y).scale(transform.k)
   }, [])
  return (
    <ZoomContext.Provider value={{ transform, setTransform: setTransform }}>
      {children}
    </ZoomContext.Provider>
  );
}
