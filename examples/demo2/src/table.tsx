// import React from 'react';
// import { Table, Button } from '@alife/hippo';
// import html2canvas from 'html2canvas';
// import domtoimage from 'dom-to-image';
// import '@alife/hippo/dist/hippo.css'
// import { image } from 'html2canvas/dist/types/css/types/image';
// (window as any).domtoimage = domtoimage;
// (window as any).downloadURI = downloadURI;
// function downloadURI(uri, name) {
//   var link = document.createElement("a");
//   link.download = name;
//   link.href = uri;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }

// const onRowClick = function(record, index, e) {
//     console.log(record, index, e);
//   },
//   getData = j => {
//     let result = [] as any;
//     for (let i = 0; i < j; i++) {
//       result.push({
//         title: {
//           name: `Quotation for 1PCS Nano ${3 + i}.0 controller compatible`
//         },
//         id: 100306660940 + i,
//         time: 2000 + i
//       });
//     }
//     return result;
//   },
//   render = (value, index, record) => {
//     return (
//       <Button shape="text" type="primary">
//         删除
//       </Button>
//     );
//   };

// export default class App extends React.Component {
//   state = {
//     dataSource: getData(15)
//   };

//   render() {
//     return (
//       <div>
//          <button onClick={() => {
//             const body = document.querySelector('.next-table-inner .next-table-body table') 
//             const header = document.querySelector('.next-table-inner .next-table-header table') 
//             const container =document.createElement("div");  
//             // const { width: bodyWidth, height: bodyHeight } = body ? body.getBoundingClientRect() : { width: 400, height: 200}
//             // const { width: headerWidth, height: headerHeight } = header ? header.getBoundingClientRect() : { width: 400, height: 200}
//             container.style.position = 'relative';
//             // container.style.top = `${bodyHeight + headerHeight}px`;
//             // const waterMarker = document.createElement('div')
//             // waterMarker.style.backgroundImage = 'url(https://portalpro.hemaos.com/api/watermark)'
//             // waterMarker.style.backgroundSize = '360px 189px'
//             // waterMarker.style.width = '100%'
//             // waterMarker.style.height = '100%'
//             // waterMarker.style.position = 'absolute'
//             // waterMarker.style.top = '0px'
//             // waterMarker.style.zIndex = '10'

//             body &&  body.parentElement && body.parentElement.appendChild(container)
//             header && container.appendChild(header.cloneNode(true))
//             body && container.appendChild(body.cloneNode(true))
//             const { width, height } = container ? container.getBoundingClientRect() : { width: 400, height: 200}
//             const waterMarker = createWaterMarker(width, height);

//             container.appendChild(waterMarker)
//             domtoimage.toPng(container).then((dataUrl) => {
//               downloadURI(dataUrl, 'tes')
//             })
//             // html2canvas(container as any, {  imageTimeout: 10000, allowTaint: true, useCORS: false, width: headerWidth, height: headerHeight + bodyHeight}).then((canvas) => {
//             //   var img = new Image();
//             //   img.setAttribute('crossOrigin', 'anonymous');
//             //   img.src = canvas.toDataURL("image/png");
//             //   document.body.prepend(img)
//             //   // downloadURI(canvas.toDataURL("image/png"), 'test');
//             //   // container.remove()
//             // })
//         }}>点击截图</button>

//         <Table
//           dataSource={this.state.dataSource}
//           onRowClick={onRowClick}
//           fixedHeader
//           maxBodyHeight={400}
//         >
//           <Table.Column title="Id1" dataIndex="id" width={140} />
//           <Table.ColumnGroup>
//             <Table.Column title={'222s'} dataIndex="id" lock width={140} />
//             <Table.Column title="Title" dataIndex="title.name" width={400} />
//             <Table.Column title="Title" dataIndex="title.name" width={200} />
//           </Table.ColumnGroup>
//           <Table.ColumnGroup>
//             <Table.Column title="Time" dataIndex="time" width={500} />
//             <Table.Column cell={render} width={200} lock="right" />
//           </Table.ColumnGroup>
//         </Table>
//       </div>
//     );
//   }

//   onClick = () => {
//     this.setState({
//       dataSource: getData(4)
//     });
//   };
// }

// function createWaterMarker(width: number, height: number) {
//   const waterMarker = document.createElement('div');
//   waterMarker.style.position = 'absolute';
//   waterMarker.style.top = '0px';
//   waterMarker.style.width = `${width}px`;
//   waterMarker.style.height = `${height}px`;
//   waterMarker.style.display = 'flex';
//   waterMarker.style.flexWrap = 'wrap';
//   const rows = Math.floor(width / 270);
//   const cols = Math.floor(height / 190);
//   for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
//     for (let colIndex = 0; colIndex < cols; colIndex++) {
//       const div = document.createElement('div');
//       div.style.width = '270px';
//       div.style.height = '190px';
//       div.style.transform = 'rotate(45deg)';
//       div.style.color = 'lightgrey';
//       div.innerHTML = '陈智伟';
//       waterMarker.appendChild(div);
//     }
//   }
//   return waterMarker;
// }
