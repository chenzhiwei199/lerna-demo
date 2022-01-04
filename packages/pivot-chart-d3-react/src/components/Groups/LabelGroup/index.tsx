import * as React from 'react';
import { Cell, DIRECTION, OffsetConfig } from '../../../global.d';
import Label from '../../Label';
import Facet from '../../Facet';
import Offset from '../../../help/Offset';

export interface LabelGroupProps {
 data: Array<{ label?: string }>;
 type: DIRECTION;
 /**
  * 整体坐标轴的大小
  */
 size: number;
 labelHeight: number;
 containerSize: number;
 scrollOffsetConfig: OffsetConfig;
 gapStart?: number;
 gapEnd?: number;
}

class LabelGroup extends React.PureComponent<LabelGroupProps> {
  public renderFacetCell = (visibleSize, cell) => {
    const { type, size, labelHeight, gapStart = 0, gapEnd = 0} = this.props;
    let offset;
    if (type === DIRECTION.HORIZONTAL) {
      offset = new Offset( size / 2, labelHeight / 2);
    } else {
      offset = new Offset( labelHeight / 2, size / 2);
    }

    return  (
      <g>
      <Label isTranspose={type === DIRECTION.VERTICAL} label={cell ? cell.label : ''} offset={offset} />
    </g>
    );
  }
  public renderAxisGroup() {
    const { data, type, size, containerSize, scrollOffsetConfig } = this.props;
    let xField;
    let yField;
    if (type === DIRECTION.HORIZONTAL) {
      xField = {
        data,
        size,
        containerSize,
      };
    } else {
      yField = {
        data,
        size,
        containerSize,
      };
    }
    return <Facet xField={xField} yField={yField} renderFacetCell={this.renderFacetCell} scrollOffsetConfig={scrollOffsetConfig} />;
  }
  public render() {
    return <g>{this.renderAxisGroup()}</g>;
  }
}

export default LabelGroup;
