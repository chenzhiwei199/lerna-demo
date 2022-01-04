import * as React from 'react';
import { SizeConfig } from '../../global.d';

export interface MaskProps {
  id: string;
  sizeConfig: SizeConfig;
  transform?: string;
  className?: string;
  clipTransform?: string;
}

class Mask extends React.Component<MaskProps> {
  constructor(props: MaskProps) {
    super(props);
  }
  public render() {
    const { className, sizeConfig, id, transform, clipTransform } = this.props;
    const { width, height } = sizeConfig;
    return (
      <g className={className} transform={transform}>
        <g clipPath={`url(#${id})`}>{this.props.children}</g>
        <g transform={clipTransform}>
        <clipPath id={id}>
          <rect height={height} width={width} />
        </clipPath>
        </g>
      </g>
    );
  }
}

export default Mask;
