import * as React from 'react';
export interface Datum {
    value?: string;
    values?: any[];
    key?: string;
}
declare class PivotChartD3 extends React.Component {
    state: {
        data: never[];
    };
    componentDidMount(): void;
    render(): JSX.Element;
}
export default PivotChartD3;
