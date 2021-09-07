// * 获取微信登录code
/**
 *
 * @returns
 * * code -> code = 0,未拿到code;
 * * msg -> 报错信息
 */
export function getLoginCode() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: "weixin",
      success: function (res) {
        let { code } = res;
        if (code) {
          resolve({ code });
        } else {
          reject({ code: 0, msg: "未拿到code" });
        }
      },
      fail(err) {
        reject({ code: 0, msg: err });
      },
    });
  });
}

// * 显示加载条
export function showLoading(str = "加载中", mask = true) {
  uni.showLoading({
    title: str,
    mask,
  });
}

/**
 * 显示对话框
 * @param {string} str -> 主要内容
 * @param {string} icon -> 图标
 * @param {boolean} mask -> 遮罩
 * @param {number} d -> 展示时间
 */
export function showToast({ str, icon = "none", mask = false, d = 1500 }) {
  uni.showToast({
    title: str,
    icon,
    mask,
    duration: d,
  });
}

/**
 *
 * @param {String} text => 复制的文案
 * @returns
 */
export function copyTxt(text) {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: text,
      success: function (res) {
        resolve();
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

/**
 * 显示modal弹窗
 * @param {string} title -> 标题
 * @param {string} content -> 主要内容
 * @param {function} confirm -> 点击确认方法
 * @param {function} cancel -> 点击取消方法
 * @param {string} cancelText -> 取消文字
 * @param {string} cancelColor -> 取消文字的颜色
 * @param {string} confirmText -> 确认文字
 * @param {string} confirmColor -> 确认文字的颜色
 */
export function showModal({
  title = "",
  content = "",
  confirm = () => { },
  cancel,
  cancelText = "取消",
  cancelColor = "#000",
  confirmText = "确定",
  confirmColor = "#FF0059",
}) {
  let showCancel = cancel ? true : false;
  uni.showModal({
    title,
    content,
    showCancel,
    cancelText,
    cancelColor,
    confirmText,
    confirmColor,
    success: function (res) {
      if (res.confirm) {
        confirm();
      } else if (res.cancel) {
        cancel();
      }
    },
  });
}

// * 停止下拉刷新
export function stopPullDown(time = 1000) {
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, time);
}

// * 滚动到指定位置
export function scrollPage({ selector = "", scrollTop = 0 }) {
  let _params = {
    duration: 300,
  };
  if (selector) {
    _params.selector = selector;
  } else {
    _params.scrollTop = scrollTop;
  }
  return uni.pageScrollTo(_params);
}

// * 设置头部标题
export function setTitle(str) {
  uni.setNavigationBarTitle({
    title: str,
  });
}

/**
 * * 设置头部导航样式
 * @param {string} frontColor 字体颜色, accept(#ffffff,#000000)
 * @param {string} backgroundColor 背景色
 */
export function setTopbarStyle({
  frontColor = "#000000",
  backgroundColor = "#fff",
}) {
  uni.setNavigationBarColor({
    frontColor,
    backgroundColor,
    // animation: {
    //   duration: 400,
    //   timingFunc: "easeIn",
    // },
  });
}

/**
 * * 下载
 * @param {String} url => 下载地址
 * @returns
 */
export function downloadFile({ url, _showLoading = false }) {
  if (_showLoading) {
    showLoading("资源下载中");
  }
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url, //仅为示例，并非真实的资源
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath);
        }
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

// * 保存图片到相册
export function saveImage(filePath) {
  return new Promise((resove, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: (res) => {
        console.log(res, "res");
        if (res.errMsg === "saveImageToPhotosAlbum:ok") {
          resove();
        }
      },
      fail(err) {
        console.log(err, "err");
        reject(err);
      },
    });
  });
}

// * 生成随机整数
export function randomNumInteger(min, max) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * min + 1, 10);
    case 2:
      return parseInt(Math.random() * (max - min + 1) + min, 10);
    default:
      return 0;
  }
}
// * 倒计时获取日、时、分、秒
export function computedTimer(totalTime) {
  let d = parseInt(totalTime / (24 * 60 * 60));
  let h = formate(parseInt((totalTime / (60 * 60)) % 24));
  let m = formate(parseInt((totalTime / 60) % 60));
  let s = formate(parseInt(totalTime % 60));
  return {
    d,
    h,
    m,
    s,
  };
}
// * 格式化时间
export function formate(time) {
  if (time >= 10) {
    return time;
  } else {
    return `0${time}`;
  }
}

/**
 * * 预览图片
 * @param {Array} urls -> 图片组
 * @param {number | string} current -> 图片下标或者图片地址
 */
export function uniPreviewImg(urls, current) {
  uni.previewImage({
    current,
    urls,
    showmenu: false,
    longPressActions: {
      itemList: ["发送给朋友", "保存图片", "收藏"],
      success: function (data) { },
      fail: function (err) {
        console.log(err.errMsg);
      },
    },
  });
}
// * 小程序模板消息
export function requestMessage(tmplIds) {
  return new Promise((resolve) => {
    uni.requestSubscribeMessage({
      tmplIds: tmplIds,
      complete(res) {
        resolve(res);
      },
    });
  });
}

// * url解码
export function getRequest(search) {
  let url = search ? search : window.location.search,
    theRequest = {};
  if (url.indexOf("?") != -1) {
    let str = url.substr(1);
    let strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]); //对字符串解码
    }
  }
  return theRequest;
}
// * 对象转url
export function formateObjToParamStr(paramObj) {
  const sdata = [];
  for (let attr in paramObj) {
    sdata.push(`${attr}=${utils.filter(paramObj[attr])}`);
  }
  return sdata.join("&");
}

// * 二维码解码
export function getURLComponent(object) {
  let r = decodeURIComponent(object).split("&");
  var newArr = {};
  for (let i = 0; i < r.length; i++) {
    let kye = r[i].split("=")[0];
    let value = r[i].split("=")[1];
    newArr[kye] = value;
  }
  return newArr;
}

// * 切割数组
export function splitArray(arr, N) {
  var result = [];
  for (var i = 0; i < arr.length; i += N) {
    result.push(arr.slice(i, i + N));
  }
  return result;
}

// * 获取当月天数
export function getDayNum(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}

/**
 *
 * @param {Number} time 时间戳
 * @returns
 * * year -> 年份
 * * month -> 月份
 * * day -> 当日
 * * weekday -> 星期
 * * hour -> 时
 * * minutes -> 分
 * * seconds -> 秒
 */
export function getToday(time) {
  var date;
  if (time) {
    date = new Date(time);
  } else {
    date = new Date();
  }
  let year = date.getFullYear();
  let month = formate(date.getMonth() + 1); // * 月
  let day = formate(date.getDate()); // * 日
  let weekday = date.getDay(); // * 星期
  let hour = formate(date.getHours()); // * 时
  let minutes = formate(date.getMinutes()); // * 分
  let seconds = formate(date.getSeconds()); // * 秒
  return { year, month, day, weekday, hour, minutes, seconds };
}

// * navigateTo跳转
export function navigateTab(url) {
  return uni.navigateTo({
    url,
  });
}
// * redirectTo跳转
export function redirectTab(url) {
  return uni.redirectTo({
    url,
    success(res) {
      console.log("跳转成功");
    },
    fail(err) {
      console.log("跳转失败");
    },
  });
}
// * switchTab跳转
export function switchTab(url) {
  return uni.switchTab({
    url,
  });
}
// * reLaunch跳转
export function reLaunchTab(url) {
  return uni.reLaunch({
    url,
  });
}

/**
 *
 * @param {string} type 跳转类型
 * @param {string} url 跳转路径
 * @returns
 * 跳转类型以下四种
 * * n -> navigateTo跳转
 * * d -> redirectTo跳转
 * * s -> switchTab跳转
 * * r -> reLaunch跳转
 */
export function urlJump({ type = "n", url }) {
  const funcs = {
    n: (url) => navigateTab(url),
    d: (url) => redirectTab(url),
    s: (url) => switchTab(url),
    r: (url) => reLaunchTab(url),
  };
  return funcs[type](url);
}

/**
 * 小程序跳转
 */
export function jumpToApp(appId, path = "") {
  if (appId) {
    uni.navigateToMiniProgram({
      appId, //要打开的小程序 appId,
      path, //打开的页面路径，如果为空则打开首页,
      success: (res) => {
        console.log("success");
      },
    });
  } else {
    console("no appid");
  }
}

// * 深克隆
export function deepClone(data) {
  return JSON.parse(JSON.stringify(data));
}

// * 获取当前时间戳
export function getTimetamp() {
  return Date.parse(new Date());
}

// * 浮点计算
export function formatFloat(f, digit) {
  let m = Math.pow(10, digit);
  let num = Math.round(f * m) / m;
  return num;
}

// * 去除所有空格
export function trim(str) {
  return str.replace(/\s/g, "");
}

// * 验证手机号
export function phoneCheck(value) {
  const name = "手机号码",
    reg =
      /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/g;
  if (!value)
    return {
      msg: `请填写${name}`,
      code: 0,
    };
  let pass = reg.test(value);
  if (!pass)
    return {
      msg: `${name}格式不正确`,
      code: 0,
    };
  return {
    code: 1,
    msg: "验证通过",
  };
}
// * 验证身份证
export function idCheck(value) {
  const name = "身份证号",
    reg =
      /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
  if (!value)
    return {
      msg: `请填写${name}`,
      code: 0,
    };
  let pass = reg.test(value);
  if (!pass)
    return {
      msg: `${name}格式不正确`,
      code: 0,
    };
  return {
    code: 1,
    msg: "验证通过",
  };
}

/**
 *
 * @param {string} type 验证类型
 * @param {number | string} value 值
 * @returns 返回验证方法
 * type类型
 * * id -> 身份证号
 * * phone -> 手机号码
 */
export function checkForm(type, value) {
  if (typeof value == "string") {
    value = trim(value);
  }
  const funcs = {
    phone: (value) => phoneCheck(value),
    id: (value) => idCheck(value),
  };
  return funcs[type](value);
}

/**
 * 获取网络状态
 * @returns Promise对象
 * * wifi
 * * 2g
 * * 3g
 * * 4g
 * * 5g
 * * ethernet 有线
 * * unknown Android 下不常见的网络类型
 * * none
 */
export function getNetWorkStatus() {
  return new Promise((resolve, reject) => {
    uni.getNetworkType({
      success: function (res) {
        let isConnected = true;
        let { networkType } = res;
        if (networkType === "none") {
          isConnected = false;
        }
        resolve({ networkType, isConnected });
      },
    });
  });
}

// * uniapp获取用户经纬度
/**
 *
 * @returns longitude, latitude => 经纬度
 */
export function getLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: "gcj02",
      success(res) {
        let { longitude, latitude } = res;
        resolve({ longitude, latitude });
      },
      fail(err) {
        console.log(err, "获取位置失败");
        reject({ code: 0, msg: err.errMsg });
      },
    });
  });
}

/**
 *
 * @param {Object} param => 支付参数
 * * [provider, timeStamp, nonceStr, wxPackage, signType, paySign]
 * @returns
 */
export function uniPay({
  provider = "wxpay",
  timeStamp,
  nonceStr,
  packageValue,
  signType,
  paySign,
}) {
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      provider,
      timeStamp,
      nonceStr,
      package: packageValue,
      signType,
      paySign,
      success: function (res) {
        resolve(res);
        // let reg = new RegExp("ok");
        // let status = reg.test(res.errMsg);
        // showToast("付款成功", false);
      },
      fail(err) {
        console.log(err, "失败");
        if (err.errMsg === "requestPayment:fail cancel") {
          console.log("拒绝付钱");
        }
        reject(err);
      },
    });
  });
}

/**
 *
 * @param {Array} list 旧数组
 * @param {Array} newList 新数组
 * @returns
 * * list 合并后的数组
 * * isEmpty 是否为空
 */
export function mergeList(list, newList) {
  list = [...list, ...newList];
  let isEmpty = list.length <= 0;
  return {
    list,
    isEmpty,
  };
}

/**
 *
 * @param {number} timestamp
 * @param {number} hours
 * @returns flag = 是否在规定时差内
 */
export function checkReget(timestamp, day = 365) {
  let nowTimestamp = getTimetamp(),
    lag = day * 24 * 60 * 60 * 1000;
  return nowTimestamp - timestamp <= lag;
}

/**
 *
 * @param {String} str ==> 字符串
 * @param {Number} n ==> 位数
 * @returns
 */
export function fixZeroEnd(str, n) {
  return (str + Array(n).join(0)).slice(0, n);
}

// * 节流函数
export function throttle(fn, interval) {
  let enterTime = 0;
  let gapTime = interval || 500;
  return function () {
    let that = this;
    let args = arguments;
    let backTime = new Date();
    if (backTime - enterTime > gapTime) {
      enterTime = backTime;
      fn.call(that, args);
    } else {
      showToast("您的操作过快！");
    }
  };
}

// * 防抖函数/模糊搜索
export function debounce(fn, interval) {
  let timer;
  interval = interval || 1000;
  return function () {
    clearTimeout(timer);
    let that = this;
    let args = arguments;
    timer = setTimeout(function () {
      fn.call(that, args);
    }, interval);
  };
}

export function setParentId(userId) {
  let us = uni.getStorageSync("userInfo"),
    parentId = uni.getStorageSync("parentId");
  if (!parentId && us.id != userId) {
    uni.setStorageSync('parentId', userId)
  }
}
