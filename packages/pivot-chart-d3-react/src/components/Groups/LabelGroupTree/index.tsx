import * as React from 'react';
import {  DIRECTION, OffsetConfig } from '../../../global.d';
import { FacetData } from '../../Chart';
import LabelGroup from '../LabelGroup';

export interface LabelGroupTreeProps {
 data: FacetData;
 containerSize: number;
 type: DIRECTION;
 scrollOffsetConfig: OffsetConfig;
}

class LabelGroupTree extends React.PureComponent<LabelGroupTreeProps> {
  public renderLabelGroupTree() {
    const { data, type, containerSize, scrollOffsetConfig} = this.props;
    const labelSize = 30;
    return data.map((d, index) => {
      const { size, data: treeData } = d;
      let transform;
      if (type === DIRECTION.HORIZONTAL) {
        transform = `translate(${labelSize * index}, 0)`;
      } else {
        transform = `translate(0, ${labelSize * index})`;
      }
      return (
        <g key={index} transform={transform}>
          <LabelGroup scrollOffsetConfig={scrollOffsetConfig} containerSize={containerSize} labelHeight={labelSize} size={size} type={type} data={treeData}/>
        </g>
      );
    });
  }
  public render() {
    return <g>{this.renderLabelGroupTree()}</g>;
  }
}

export default LabelGroupTree;
