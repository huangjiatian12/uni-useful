/**
 * * js生成矩阵
 * @param {number} m 横
 * @param {number} n 纵
 * @param {any} value 默认值
 * @returns 矩阵
 */
export function createMatrix(m, n, value = 0) {
  return new Array(n).fill().map(() => new Array(m).fill(value))
}

/**
 * 
 * @param {object | array} obj 克隆数据
 * @returns 
 */
export function deepClone(obj) {
  let newObj = Array.isArray(obj) ? [] : {}
  for (let i in obj) {
    let itm = obj[i]
    if (typeof itm !== "object" || typeof itm === null || typeof itm === undefined) {
      newObj[i] = itm
    } else {
      newObj[i] = deepClone(itm)
    }
  }
  return newObj
}