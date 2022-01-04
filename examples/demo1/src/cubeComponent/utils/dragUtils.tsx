import * as React from 'react';
import { MetricsType } from '../global';

export function getColor(type) {
  switch (type) {
    case MetricsType.DIMENSION:
      return 'rgb(73,150,178)';
    case MetricsType.MEASURE:
      return 'rgb(0, 177,128)';
    default:
      return 'rgb(73,150,178)';
  }
}
export function getIcon(type) {
  let color = getColor(type);
  let icon = '&#xe629;';
  switch (type) {
    case MetricsType.DIMENSION:
      icon = '&#xe629;';
      break;
    case MetricsType.MEASURE:
      icon = '&#xe62a;';
      break;
    default:
      icon = '&#xe629;';
      break;
  }
  return (
    <i
      style={{ color: color, paddingRight: '12px' }}
      className="iconfont"
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}
