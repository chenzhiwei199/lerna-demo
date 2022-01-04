import BaseCore from './BaseCore';
import { getKylinDataSets } from '../../dataService';

export default class KylinCore extends BaseCore {
  queryCfg() {
    // 请求数据， 请求入参
    return getKylinDataSets().then((data: any) => {
      const dimensions = data.dimensions.map(item => ({
        label: item.name,
        value: item.alias,
      }));
      const measures = data.measures.map(item => ({
        label: item.name,
        value: item.alias,
      }));
      return {
        dimensions,
        measures,
      };
    });
  }

  queryData() {
    // 请求数据， 请求入参
  }
}
