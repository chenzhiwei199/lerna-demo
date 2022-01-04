import React, { createContext } from "react";

export interface ICanvasContext {
  width: number
  height: number
  maxScale: number
  content: React.ReactNode
  ratio: number
  cardWidth: number,
  cardHeight: number,
  layerWidth: number,
  layerHeight: number,
  leftLayerWidth: number,
  rightLayerWidth: number,
  margin: {
    top: number
    bottom: number
    left: number
    right: number
  },
}
export const CanvasContext = createContext<ICanvasContext>({
  leftLayerWidth: 0,
  rightLayerWidth: 0,
  margin: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  layerWidth: 0,
  layerHeight: 0,
  ratio: 1,
  content: null,
  cardWidth: 0,
  cardHeight: 0,
  maxScale: 1,
  width: 0,
  height: 0,
})

export const useCanvasContext = () => {
  return React.useContext(CanvasContext)
}