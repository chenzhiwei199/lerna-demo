import * as React from 'react';
import ScrollWrapper, { SCROLL_TYPE } from '../ScrollWrapper';
import Mask from '../Mask';
import { SizeConfig, OffsetConfig } from '../../global.d';

export interface MaskAndScrollWrapperProps {
  id: string;
  transform: string;
  maskSizeConfig: SizeConfig;
  scrollType: SCROLL_TYPE;
  scrollOffsetConfig: OffsetConfig;
}

class MaskAndScrollWrapper extends React.Component<MaskAndScrollWrapperProps> {
  public static defaultProps = {
    scrollOffsetConfig: {
      offsetX: 0,
      offsetY: 0,
    },
  };
  constructor(props: MaskAndScrollWrapperProps) {
    super(props);
  }

  public render() {
    const {
      id,
      transform,
      maskSizeConfig,
      scrollType,
      scrollOffsetConfig,
    } = this.props;
    return (
      <Mask
        id={id}
        className={id}
        transform={transform}
        sizeConfig={maskSizeConfig}
      >
        <ScrollWrapper type={scrollType} scrollOffset={scrollOffsetConfig}>
          {this.props.children}
        </ScrollWrapper>
      </Mask>
    );
  }
}

export default MaskAndScrollWrapper;
