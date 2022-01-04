"use strict";
// import * as React from 'react';
// import Label from '../Label';
// import Offset from '../../help/Offset';
// import { ChartConfig } from '../Chart';
// import Tree from '../Tree';
// import Group from '../Group';
// import { TreeDataSource, DIRECTION, AXIS_DIRECTION, SizeConfig } from '../../global.d';
// import { ELEMENT_TYPE } from '../../help/SizeOptions';
// import { DoubleElementOptions } from '../../help/DoubleElementOptions';
// import { checkIsCategory, checkIsLinear } from '../../utils/chartUtils';
// import { ElementOptions } from '../../help/ElementOptions';
// export interface DimensionLabelProps {
//   data: TreeDataSource;
//   config: ChartConfig;
// }
// class DimensionLabel extends React.Component<DimensionLabelProps> {
//   constructor(props: DimensionLabelProps) {
//     super(props);
//   }
//   public renderCell(config: ChartConfig, rowIndex: number, colIndex: number) {
//     const { geomInstance, sizeOptions, offsetConfig, axisConfig, sizeConfig, positionsConfig} = config;
//     const { x: positionX, y: positionY } = positionsConfig;
//     const x = positionX[rowIndex];
//     const y = positionY[colIndex];
//     const { width, height} = sizeConfig;
//     const { offsetX, offsetY} = offsetConfig;
//     const measureLable = sizeOptions.get().get(ELEMENT_TYPE.MEASURE_LABEL) as DoubleElementOptions;
//     const [paddingTop, paddingRight, paddingBottom, paddingLeft] = geomInstance.getPadding();
//     const { isYAxisShow, isXAxisShow} = axisConfig;
//     const isCurrentYAxisShow = rowIndex === 0 && isYAxisShow;
//     const isCurrentXAxisShow = colIndex === positionY.length - 1 && isXAxisShow;
//     let drawOffsetX = offsetX;
//     let drawOffsetY = offsetY;
//     let tranpose;
//     let drawWidth;
//     let drawHeight;
//     if (checkIsCategory(x) || (checkIsLinear(x.type) && checkIsLinear(y.type)) || (checkIsLinear(y.type) && !x ) ) {
//       tranpose = AXIS_DIRECTION.BL;
//     } else {
//       tranpose = AXIS_DIRECTION.LB;
//     }
//     const horizontalPaddingWidth = paddingLeft + paddingRight;
//     const horizontalPaddingHeight = paddingTop + paddingBottom;
//     // 柱状图 作为横轴，可能会找bandSize / 2, 这里进行视图优化
//     if ((tranpose === AXIS_DIRECTION.BL )) {
//       if (checkIsLinear(x.type)) {
//         drawWidth =  width - horizontalPaddingWidth;
//         drawOffsetX = drawOffsetX + paddingLeft;
//       }
//     } else if (tranpose === AXIS_DIRECTION.LB) {
//       if ( checkIsLinear(y.type)) {
//         drawHeight = height - horizontalPaddingHeight;
//         drawOffsetY = drawOffsetY + paddingTop;
//       }
//     }
//     if (isYAxisShow) {
//       return <Label label={y ? y.code : ''} offset={new Offset(measureLable.getY().getWidth() / 2, drawOffsetY + height / 2)}/>;
//     }
//     if (isXAxisShow) {
//       return <Label label={x ? x.code : ''} offset={new Offset(drawOffsetX + width / 2, measureLable.getX().getHeight() / 2)}/>;
//     }
//     return <g />;
//   }
//   public renderNode(config, data, rowIndex, colIndex) {
//     const { dimensionConfig, dimensionValuesConfig, positionsConfig, axisConfig } = config;
//     const { x, y } = dimensionConfig;
//     const drawDirection = rowIndex < x.length ? DIRECTION.HORIZONTAL : DIRECTION.VERTICAL;
//     const { sizeConfig, offsetConfig, label } = data;
//     const { height } = sizeConfig;
//     const { offsetX, offsetY} =  offsetConfig;
//     const isYAxisShow = drawDirection === DIRECTION.HORIZONTAL
//     ? (colIndex === 0 )
//     : true;
//     const isXAxisShow = drawDirection === DIRECTION.VERTICAL
//     ? (colIndex === dimensionValuesConfig[rowIndex].length - 1 )
//     : true;
//     const newConfig = {
//       ...config,
//       sizeConfig,
//       offsetConfig,
//       axisConfig: {
//         ...axisConfig,
//         isXAxisShow,
//         isYAxisShow,
//       },
//     };
//     if (drawDirection === DIRECTION.HORIZONTAL) {
//         return (
//           <Group
//             data={data}
//             positionConfig={positionsConfig}
//             renderCell={this.renderCell.bind(this, newConfig)}
//           />
//         );
//     } else {
//       return (
//         <Group
//           data={data}
//           positionConfig={positionsConfig}
//           renderCell={this.renderCell.bind(this, newConfig)}
//         />
//       );
//     }
//   }
//   public render() {
//     const { data, config} = this.props;
//     return (
//       <Tree data={data} renderNode={this.renderNode.bind(this, config)}/>
//     );
//   }
// }
// export default DimensionLabel;
