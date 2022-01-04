export type MatrixType = [number, number, number];

export function matrixMultiplication(
  a: MatrixType[],
  b: MatrixType[]
): MatrixType[] {
  return a.map((row: MatrixType) => {
    return row.map((_: number, i: number) => {
      return row.reduce((sum, cell, j) => {
        return sum + cell * b[j][i];
      }, 0);
    }) as MatrixType;
  });
}
export function getTransformMatrix(matrix: MatrixType[]) {
  if (!matrix || matrix.length < 1) {
    return '';
  }
  const m = reverseMatrix(matrix);
  return `${m[0][0]},${m[1][0]},${m[0][1]},${m[1][1]},${m[0][2]},${m[1][2]}`;
}
export function matrixMultiplications(matrix: MatrixType[][]) {
  return matrix.slice(1).reduce((preMatrix, curMatrix) => {
    return matrixMultiplication(preMatrix, curMatrix);
  }, matrix[0]);
}

// 矩阵转置
export function reverseMatrix(sourceArr: MatrixType[]) {
  if (!sourceArr || sourceArr.length === 0) {
    return sourceArr;
  }
  const reversedArr = [] as MatrixType[];

  for (let n = 0; n < sourceArr[0].length; n++) {
   reversedArr[n] = [0, 0, 0] as MatrixType;
    for (let j = 0; j < sourceArr.length; j++) {
      reversedArr[n][j] = sourceArr[j][n];
    }
  }

  return reversedArr;
}

export function bl2lbMatrix() {
  const composeMatrix = [
    // leftTranslateMatrix(bandWidth, x),
    // yAxisReflection(),
    // rightTranslateMatrix(bandWidth, x),
    originReflectionMatrix(),
    // scaleMatrix(scale),
  ] as MatrixType[][];
  return matrixMultiplications(composeMatrix);
}

/**
 * bottom axis transoform to left
 *
 * @export
 * @param {number} scale
 * @param {number} height
 * @returns
 */
export function b2LAxisMatrix(height: number) {
  const composeMatrix = [
    originReflectionMatrix(180),
    yAxisReflection(),
    bottomTranslateMatrix(height),
  ] as MatrixType[][];
  const composeLabelMatrix = [xAxisReflection()] as MatrixType[][];
  return {
    axis: matrixMultiplications(composeMatrix),
    label: matrixMultiplications(composeLabelMatrix),
  };
}

export function l2BAxisMatrix(scale: number, height: number) {
  const composeMatrix = [
    originReflectionMatrix(180),
    yAxisReflection(),
    bottomTranslateMatrix(height),
  ] as MatrixType[][];
  const composeLabelMatrix = [xAxisReflection()] as MatrixType[][];
  return {
    axis: matrixMultiplications(composeMatrix),
    label: matrixMultiplications(composeLabelMatrix),
  };
}

export function bl2lbSizeMatrix(scale: number) {
  const composeMatrix = [
    originReflectionMatrix(),
    scaleMatrix(scale),
  ] as MatrixType[][];
  return matrixMultiplications(composeMatrix);
}
export const noChangeMatrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

export const originMatrix = [
  [-1, 0],
  [0, -1],
];

export function leftTranslateMatrix(bandWidth: number, x: number) {
  return [
    [1, 0, 0],
    [0, 1, 0],
    [-(x + bandWidth / 2), 0, 1],
  ];
}

export function bottomTranslateMatrix(height: number) {
  return [
    [1, 0, 0],
    [0, 1, 0],
    [0, height, 1],
  ];
}

export function yAxisReflection() {
  return [
    [-1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
}

export function xAxisReflection() {
  return [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, 1],
  ];
}

export function rightTranslateMatrix(bandWidth: number, x: number) {
  return [
    [1, 0, 0],
    [0, 1, 0],
    [x + bandWidth / 2, 0, 1],
  ];
}

export function originReflectionMatrix(angle: number = 90) {
  // 角度转化
  angle = (angle * Math.PI) / 180.0;
  return [
    [Math.cos(angle), Math.sin(angle), 0],
    [-Math.sin(angle), Math.cos(angle), 0],
    [0, 0, 1],
  ];
}

export function getNoneMatrix() {
  return [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]
}

export function scaleMatrix(scale: number) {
  return [
    [scale, 0, 0],
    [0, scale, 0],
    [0, 0, 1],
  ];
}
