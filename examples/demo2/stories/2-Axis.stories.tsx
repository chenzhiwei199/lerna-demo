// import * as React from 'react';
// import ReAxis from '@alife/pivot-chart-d3-react/src/components/ReAxis';
// import Label from '@alife/pivot-chart-d3-react/src/components/ReAxis/Label';
// import styled from 'styled-components';
// import { ScaleType, DIRECTION } from '@alife/pivot-chart-d3-react';
// // import { CellTypeEnum } from '@alife/pivot-chart-d3-react';
// export default {
//   title: 'Button',
// };
// const StyledDiv = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   svg {
//     border: 1px solid black;
//     width: 200px;
//     height: 40px;
//   }
// `;
// class WrapSvg extends React.Component<{
//   title?: string;
//   width?: number;
//   height?: number;
// }> {
//   render() {
//     const { title = '没有标题', width = 100, height = 50 } = this.props;
//     return (
//       <div>
//         {React.Children.map(this.props.children, (child, i) => {
//           return (
//             <div >
//               <strong>{title}</strong><br/>
//               <svg style={{ width, height }}>
//                 <g transform={`translate(50, 50)`}>
//                   <rect width={width} height={height} fill={'yellow'}></rect>
//                   {child}
//                 </g>
//               </svg>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }
// }
// // firstTextAnchor, firstVerticalAnchor
// function LabelList(isFirstTextAnchor) {
//   let cmp = [] as JSX.Element[];
//   for (let index = 0; index < 5; index++) {
//     cmp.push(
//       <g transform={`translate(${index * 10 + 10}, 10)`}>
//         <Label text={index} />
//       </g>
//     );
//   }
//   return <svg>{cmp}</svg>;
// }
// const categorys = ['上海', '北京', '苏州', '杭州', '湖南', '武汉', '黑龙江', '新疆']
// const reverse = () => {
//   const n = categorys.slice(0)
//   n.reverse()
//   return n
// }
// export const BaseAxis = () => {
//   return (
//     <StyledDiv>
//       <h3>线性</h3>
//       <WrapSvg title={'垂直'} height={300} width={300}>
//           <ReAxis
//             domainType={ScaleType.LINEAR}
//             range={[0, 200]}
//             direction={DIRECTION.VERTICAL}
//           />
//         </WrapSvg>
//       {/* <WrapSvg title={'水平'} height={300} width={300}>
//           <ReAxis
//             domainType={ScaleType.LINEAR}
//             range={[0, 200]}
//             direction={DIRECTION.HORIZONTAL}
//           />
//         </WrapSvg>

//       <WrapSvg title={'水平 (指定size)'}height={300} width={300}>
//           <ReAxis
//             size={100}
//             domainType={ScaleType.LINEAR}
//             range={[0, 200]}
//             direction={DIRECTION.HORIZONTAL}
//           />
//         </WrapSvg>

//         <WrapSvg title={'水平 (旋转)'} height={300} width={300}>
//           <ReAxis
//             isLabelRotate={true}
//             domainType={ScaleType.LINEAR}
//             range={[0, 200]}
//             direction={DIRECTION.HORIZONTAL}
//           />
//         </WrapSvg>
//         <WrapSvg title={'水平 (指定坐标轴高度)'} height={300} width={300}>
//           <ReAxis
//             axisHeight={50}
//             domainType={ScaleType.LINEAR}
//             range={[0, 200]}
//             direction={DIRECTION.HORIZONTAL}
//           />
//         </WrapSvg>
//         <h3>离散</h3>
//         <WrapSvg title={'水平 '} height={300} width={300}>
//           <ReAxis
//             domainType={ScaleType.CATEGORY}
//             range={categorys}
//             direction={DIRECTION.HORIZONTAL}
//           />
//         </WrapSvg>
//         <WrapSvg title={'垂直 '} height={300} width={300}>
//           <ReAxis
//             domainType={ScaleType.CATEGORY}
//             range={categorys}
//             direction={DIRECTION.VERTICAL}
//           />
//         </WrapSvg>
//         <WrapSvg title={'水平 (label 旋转)'} height={300} width={300}>
//           <ReAxis
//             isLabelRotate={true}
//             domainType={ScaleType.CATEGORY}
//             range={categorys}
//             direction={DIRECTION.HORIZONTAL}
//           />
//         </WrapSvg> */}
//     </StyledDiv>
//   );
// };

// // export const BaseLabel = () => {
// //   return (
// //     <StyledDiv>
// //       <WrapSvg>
// //         <Label text="默认行为 textAnchor='start' vertical='end'" />
// //       </WrapSvg>
// //       <WrapSvg>
// //         <Label text="vertical start" verticalAnchor={'start'} />
// //         <Label text="vertical middle" verticalAnchor={'middle'} />
// //         <Label text="vertical middle" verticalAnchor={'end'} />
// //       </WrapSvg>
// //       <WrapSvg>
// //         <Label text="textAnchor start" textAnchor={'start'} />
// //         <Label text="textAnchor middle" textAnchor={'middle'} />
// //         <Label text="textAnchor end" textAnchor={'end'} />
// //       </WrapSvg>
// //       {LabelList(true)}
// //       {LabelList(false)}
// //     </StyledDiv>
// //   );
// // };

// // export const baseCategory = () => (
// //   <svg>
// //     <g transform="translate(10, 10)">
// //       <ReAxis
// //         cell={{
// //           code: 'test',
// //           range: ['1', '2', '3', '4', '5'],
// //           dimensionKeys: ['2', '3'],
// //           type: CellTypeEnum.CATEGORY,
// //         }}
// //       />
// //     </g>
// //   </svg>
// // );
// // export const baseLinear = () => (
// //   <svg>
// //     <g transform="translate(10, 10)">
// //       <ReAxis
// //         cell={{
// //           code: 'test',
// //           range: [0, 200],
// //           dimensionKeys: ['2', '3'],
// //           type: CellTypeEnum.LINEAR,
// //         }}
// //       />
// //     </g>
// //   </svg>
// // );
