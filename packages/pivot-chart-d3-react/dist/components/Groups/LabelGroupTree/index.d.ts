import * as React from 'react';
import { DIRECTION, OffsetConfig } from '../../../global.d';
import { FacetData } from '../../Chart';
export interface LabelGroupTreeProps {
    data: FacetData;
    containerSize: number;
    type: DIRECTION;
    scrollOffsetConfig: OffsetConfig;
}
declare class LabelGroupTree extends React.PureComponent<LabelGroupTreeProps> {
    renderLabelGroupTree(): JSX.Element[];
    render(): JSX.Element;
}
export default LabelGroupTree;
