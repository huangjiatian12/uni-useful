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
 * @param {any} obj 克隆数据
 * @returns 
 */
export function deepClone(obj) {
  if (typeof obj !== 'object') return obj;
  if (obj.constructor === Date) return new Date(obj);
  if (obj.constructor === RegExp) return new RegExp(obj);
  let newObj = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let itm = obj[key]
      if (typeof itm !== "object" || typeof itm === null || typeof itm === undefined) {
        newObj[key] = itm
      } else {
        newObj[key] = deepClone(itm)
      }
    }
  }
  return newObj
}

/**
 * * 判断变量类型
 */

export function checkType(value) {
  const types = {
    "[object Number]": "Number",
    "[object String]": "String",
    "[object Boolean]": "Boolean",
    "[object Undefined]": "Undefined",
    "[object Null]": "Null",
    "[object Object]": "Object",
    "[object Array]": "Array",
    "[object Date]": "Date",
    "[object Error]": "Error",
    "[object RegExp]": "RegExp",
    "[object Function]": "Function",
  }
  let type = Object.prototype.toString.call(value)
  return types[type]
}