"use strict";
// import * as React from 'react';
// import Label from '../Label';
// import Offset from '../../help/Offset';
// import { ChartConfig } from '../Chart';
// import Tree from '../Tree';
// import { TreeDataSource, DIRECTION, AXIS_DIRECTION } from '../../global.d';
// import Group from '../Group';
// import { checkIsLinear, checkIsCategory } from '../../utils/chartUtils';
// import { ELEMENT_TYPE } from '../../help/SizeOptions';
// import { DoubleElementOptions } from '../../help/DoubleElementOptions';
// export interface DimensionLabelProps {
//   data: TreeDataSource;
//   config: ChartConfig;
// }
// class DimensionLabel extends React.Component<DimensionLabelProps> {
//   constructor(props: DimensionLabelProps) {
//     super(props);
//   }
//   public renderNode = (data, rowIndex, colIndex) => {
//     const { config } = this.props;
//     const { dimensionConfig } = config;
//     const { x, y } = dimensionConfig;
//     const drawDirection = rowIndex < x.length ? DIRECTION.HORIZONTAL : DIRECTION.VERTICAL;
//     // 当前节点的位置信息
//     const { sizeConfig, offsetConfig, label } = data;
//     const { width, height } = sizeConfig;
//     const { offsetX, offsetY} =  offsetConfig;
//     if (drawDirection === DIRECTION.HORIZONTAL) {
//         return <Label label={label} offset={new Offset(offsetX + width / 2, offsetY)} />;
//     } else {
//       return <Label label={label} offset={new Offset(offsetX , offsetY + height / 2)} isTransform={true}/>;
//     }
//   }
//   public renderCell(config: ChartConfig , rowIndex: number, colIndex: number) {
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
//     if (isCurrentYAxisShow) {
//       return <Label label={y ? y.code : ''} offset={new Offset(measureLable.getY().getWidth() / 2, drawOffsetY + height / 2)}/>;
//     }
//     if (isCurrentXAxisShow) {
//       return <Label label={x ? x.code : ''} offset={new Offset(drawOffsetX + width / 2, measureLable.getX().getHeight() / 2)}/>;
//     }
//     return <g />;
//   }
//   public renderLeaf = (data, rowIndex, colIndex) => {
//     const { config } = this.props;
//     const { dimensionConfig, positionsConfig } = config;
//     const { x, y } = dimensionConfig;
//     const { sizeConfig, offsetConfig, axisConfig } = data;
//     const { height } = sizeConfig;
//     const { offsetX, offsetY} =  offsetConfig;
//     const newConfig = {
//       ...config,
//       sizeConfig,
//       offsetConfig,
//       positionsConfig,
//       axisConfig,
//     };
//     return (
//       <Group
//         data={data}
//         config={newConfig}
//       />
//     );
//   }
//   public render() {
//     const { data, config} = this.props;
//     return (
//       <Tree data={data} renderNode={this.renderNode} renderLeaf={this.renderLeaf}/>
//     );
//   }
// }
// export default DimensionLabel;
