import * as d3 from 'd3';
import { Datum } from '..';
export function isNumber(obj: any) {
  return obj === +obj;
}

export function makeTreeData(data: Array<any>, keyArray: Array<string>) {
  const d = d3.nest();
  keyArray.forEach(key => {
    d.key((d: any) => {
      return d[key];
    }).sortKeys(d3.ascending);
  });
  return d.entries(data);
}

// function flattenData(data: Array<Datum> | Array<any> | string, rollUpSelection: Array<string>, level?: number) {
//   level = level || 0;
//   if (level === rollUpSelection.length) {
//     return [data];
//   }
//   var flattenedData = [];
//   for (var i = 0; i < data.length; ++i) {
//   var newData = flattenData(data[i].values || data[i].value, rollUpSelection, level + 1);
//   newData.forEach((d) => {
//   d[rollUpSelection[level]] = data[i].key;
//   });
//   flattenedData = flattenedData.concat(newData);
//   }
//   return flattenedData;
// }
