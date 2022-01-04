import React from "react";

export const InteractiveContext =React.createContext<IInteractiveContext>(null)
export interface  IInteractiveContext {
  onClickDetail?: (row: any) => void
  showDetail?: boolean;
}

export function useInteractiveContxt() {
  return React.useContext(InteractiveContext) || {} as any
}