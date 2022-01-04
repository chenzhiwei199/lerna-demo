import * as React from 'react';
import { SizeConfig } from '../../global.d';
export interface MaskProps {
    id: string;
    sizeConfig: SizeConfig;
    transform?: string;
    className?: string;
    clipTransform?: string;
}
declare class Mask extends React.Component<MaskProps> {
    constructor(props: MaskProps);
    render(): JSX.Element;
}
export default Mask;
