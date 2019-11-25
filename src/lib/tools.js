/**
 * 判断传入内容是否为数字
 * @param {String|Number} num 数字或字符串内容
 * @returns {Boolean}
 */
function positiveNumberRegularTool (num) {
  return /^[0-9]+(\.[0-9]+)?$/.test(num)
}
/**
 * 判断传入内容是否为正整数
 * @param {String|Number} num 数字或字符串内容
 * @returns {Boolean}
 */
function positiveIntegerRegularTool (num) {
  return /^[0-9]+$/.test(num)
}
/**
 * 判断对象是什么类型
 * @param {*} thing 类型判断对象
 * @param {String|Array} type 判断类型可以一个也可以多个（多个用数组）
 * @returns {String|Boolean} // 返回该类型或者返回布尔
 */
function dataTypeJudgmentTool (thing, type) {
  const objName = Object.prototype.toString.call(thing).match(/^\[object (.*)\]$/)[1]
  if (type === void 0) {
    return objName
  }
  if (Object.prototype.toString.call(type) === '[object String]') {
    return objName === type
  }
  if (Object.prototype.toString.call(type) === '[object Array]') {
    return type.includes(objName)
  }
}
/**
 * 获取当前dom到祖级的距离
 * @param {*} selfEle 自身dom
 * @param {*} parentsEle 父级dom不填就是顶级dom
 * @returns {Number} 距离
 */
function getParentsOffsetTop (selfEle, parentsEle) {
  parentsEle = parentsEle || document.documentElement || document.body // 祖级dom
  let parentEle = selfEle.offsetParent // 父级dom
  let distance = selfEle.offsetTop
  if (parentEle === parentsEle || parentEle === null) {
    return distance
  }
  return distance + getParentsOffsetTop(parentEle, parentsEle)
}
/**
 *  防抖动
 * @param {{callback: Function, wait: Number, immediate: Boolean}} {callback 回调方法, wait 调用时间, immediate 是否立即执行}
 */
function debounce ({ callback, wait = 200, immediate = false }) {
  let args, timer, context, laterFn
  laterFn = () => setTimeout(() => {
    timer = null
    callback.apply(context, args)
    context = args = null
  }, wait)
  return function () {
    args = arguments
    context = this
    if (!timer && immediate) { // 立即执行
      timer = laterFn()
      callback.apply(context, args)
      context = args = null
    } else {
      clearTimeout(timer)
      timer = laterFn()
    }
  }
}
/**
 *  节流
 * @param {{callback: Function, wait: Number, immediate: Boolean}} {callback 回调方法, wait 调用时间, immediate 是否立即执行}
 */
function throttle ({ callback, wait = 200, immediate = false }) {
}
export {
  positiveNumberRegularTool, // 正数正则判断
  positiveIntegerRegularTool, // 正整数正则判断
  dataTypeJudgmentTool, // 判断数据类型
  getParentsOffsetTop, // 获取当前dom到祖级的距离
  debounce, // 防抖动
  throttle // 节流
}
