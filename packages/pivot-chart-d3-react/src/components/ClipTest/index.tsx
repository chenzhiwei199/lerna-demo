import * as React from 'react';

export interface ClipProps {}

export interface ClipState {}

class Clip extends React.Component<ClipProps, ClipState> {
  constructor(props: ClipProps) {
    super(props);
  }
  public render() {
    return (
      <svg width='400' height='500'>
        <rect width='400' height='500' strokeWidth='1' stroke='green'></rect>
        <g transform='translate(50, 50)'>
          <g transform='translate(-50, 0)'>
            <g clipPath={`url(#test)`}>
              <rect width='100' height='300' fill='red'></rect>
              <rect x='100' width='200' height='300' fill='green'></rect>
              <rect x='200' width='200' height='300' fill='yellow'></rect>
            </g>
          </g>

          <clipPath id='test'>
            <rect width='100' height='100'></rect>
          </clipPath>
        </g>
      </svg>
    );
  }
}

export default Clip;
