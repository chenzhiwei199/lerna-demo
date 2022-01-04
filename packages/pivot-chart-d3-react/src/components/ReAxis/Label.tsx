import * as React from 'react';
import { VictoryLabel } from 'victory-core';
import { DIRECTION } from '../../global.d';

export default function(props) {
  const { firstTextAnchor, firstVerticalAnchor, type, index } = props;
  const config = {} as any;
  if (index === 0) {
    if (type === DIRECTION.HORIZONTAL) {
      config.textAnchor = firstTextAnchor;
    } else {
      config.verticalAnchor = firstVerticalAnchor;
    }
  }
  // 离散型 + rotate =  (textAnchor = start, vierticalAnchor = middle)
  return <VictoryLabel {...props} {...config} />;
}
