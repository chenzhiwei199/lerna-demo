import Cube from '../src/core';
describe('cube 接口测试', () => {
  test('测试cube创建是否正常', () => {
    const data = [
      { subCode: '021', storeCode: '8007', gmv: 100 },
      { subCode: '021', storeCode: '8004', gmv: 200 },
    ];
    const rowDimensions = [{ label: '子公司', value: 'subCode' }];
    const indicators = [{ label: 'GMV', value: 'gmv' }];
    const cube = new Cube(data, rowDimensions, [], indicators, []);
    expect(cube.getTableData([])).toEqual([
      { gmv: 300, name: '021', pivot_id_xxx: '021' },
    ]);
  });

  test('测试多维度cube创建是否正常', () => {
    const data = [
      { subCode: '021', storeCode: '8007', gmv: 100 },
      { subCode: '021', storeCode: '8004', gmv: 200 },
    ];
    const rowDimensions = [
      { label: '子公司', value: 'subCode' },
      { label: '门店', value: 'storeCode' },
    ];
    const indicators = [{ label: 'GMV', value: 'gmv' }];
    const cube = new Cube(data, rowDimensions, [], indicators, []);
    expect(cube.getTableData([])).toEqual([
      {
        gmv: 300,
        name: '021',
        pivot_id_xxx: '021',
        children: [
          { gmv: 100, name: '8007', pivot_id_xxx: '021.8007' },
          { gmv: 200, name: '8004', pivot_id_xxx: '021.8004' },
        ],
      },
    ]);
  });
});
