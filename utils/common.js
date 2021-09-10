/**
 * 
 * @param {number} m 横
 * @param {number} n 纵
 * @param {any} value 默认值
 * @returns 矩阵
 */
export function createMatrix(m, n, value = 0) {
  return new Array(n).fill().map(() => new Array(m).fill(value))
}