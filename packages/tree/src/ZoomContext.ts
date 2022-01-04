import React, { createContext, useMemo } from "react";
import * as  d3 from 'd3'
export interface Scale { x: number, y: number, k: number, type?: 'mini' | 'tree' }
const transform = {
  x: 0,
  y: 0,
  k: 1,
  type: null as 'mini' | 'tree'
} as Scale
export const ZoomContext = createContext({
  transform: transform,
  setTransform: (v: Scale | ((prevState: Scale) => Scale)) => { }
})


export const useZoomContext = () => {
  return React.useContext(ZoomContext)
}