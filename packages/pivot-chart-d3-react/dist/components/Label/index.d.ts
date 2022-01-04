import * as React from 'react';
import Offset from '../../help/Offset';
export interface LabelProps {
    fill?: string;
    offset?: Offset;
    label: string;
    isTranspose?: boolean;
}
export interface LabelState {
}
declare class Label extends React.Component<LabelProps, LabelState> {
    static defaultProps: {
        fill: string;
        isTranspose: boolean;
    };
    constructor(props: LabelProps);
    render(): JSX.Element;
}
export default Label;
