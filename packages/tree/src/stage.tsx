import React, { useEffect, useRef, useState } from "react"

const Context = React.createContext<React.RefObject<SVGSVGElement> >(null as any)

export function Stage({ width, height, children, viewBox, preserveAspectRatio }: { preserveAspectRatio?: string, viewBox?: string, width: number, height: number, children: React.ReactNode }) {
  const svgRef = useRef<SVGSVGElement>(null)
  return (
    <svg viewBox={viewBox} ref={svgRef} width={width} height={height} preserveAspectRatio={preserveAspectRatio}>
      <Context.Provider value={svgRef}>{children}</Context.Provider>
    </svg>
  )
}

export function useSvg() {
  return React.useContext(Context)
}