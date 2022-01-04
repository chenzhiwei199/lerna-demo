import React from "react";

export interface IThemeContxt {
  height: number;
  width: number;
}

export const DisassemblyThemeContext = React.createContext<IThemeContxt>(null)

export function useThemeContext() {
  return React.useContext(DisassemblyThemeContext)
}