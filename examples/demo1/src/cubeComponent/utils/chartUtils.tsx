import AnyChart from '../component/anyChart';
import wrapChart2 from '../HOC/chartWrapper2';
import { ComponentClass } from 'react';
import { ChartProps } from '../global';
const NewAnyChart = wrapChart2(AnyChart);

export function getChartByType(type: string): ComponentClass<ChartProps> {
  switch (type) {
    case 'any':
      return NewAnyChart;
    default:
      return NewAnyChart;
  }
}
