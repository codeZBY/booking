import Cookies from "js-cookie";
import store from "storejs";
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  try {
    store.set(name, content)
  } catch (e) {
    console.log('setStore error!')
  }
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  try {
    return store.get(name)
  } catch (e) {
    console.log('getStore error!')
    return null
  }
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  try {
    store.remove(name)
  } catch (e) {
    console.log('removeStore error!')
  }
}

/**
 * 清空localStorage
 */
export const clearStore = () => {
  try {
    store.clearAll()
  } catch (e) {
    console.log('clearStore error!')
  }
}

/**
 * 设置cookie
 * 默认0.5天过期
 */
export const setCookie = (name, value, option = {}) => {
    try {
        Cookies.set(name, value, option);
    } catch (e) {
        console.log("setCookie error!");
    }
};

/**
 * 获取cookie
 */
export const getCookie = name => {
    try {
        return Cookies.get(name);
    } catch (e) {
        console.log("getCookie error!");
        return null;
    }
};

/**
 * 删除cookie
 */
export const removeCookie = (name, option = {}) => {
    try {
        Cookies.remove(name, option);
    } catch (e) {
        console.log("removeCookie error!");
    }
};

/**
 * 清空all cookies
 */
export const clearCookie = function() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;) {
            document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
        }
    }
};


/**
 * 判断是否是对象
 */
export const isObject = (obj, isEffective = false) => {
    if (Object.prototype.toString.call(obj) === '[object Object]') {
      if (isEffective) {
        return !!Object.keys(obj).length
      } else {
        return true
      }
    } else {
      return false
    }
  }
  
  /**
   * 判断是否是数组类型，
   * 并且是否是有效数组
   */
  export const isArray = (array, isEffective = false) => {
    if (Object.prototype.toString.call(array) === '[object Array]') {
      if (isEffective) {
        return array.length > 0
      } else {
        return true
      }
    } else {
      return false
    }
  }
  
  /**
   * 判断是否是字符串类型
   */
  export const isString = (str, isEffective = false) => {
    if (Object.prototype.toString.call(str) === '[object String]') {
      if (isEffective) {
        return !!str
      } else {
        return true
      }
    } else {
      return false
    }
  }
  
  /**
   * 判断是否是数值类型
   */
  export const isNumber = num => {
    if (Object.prototype.toString.call(num) === '[object Number]') {
      return true
    } else {
      return false
    }
  }
  
  /**
   * 判断是否是布尔类型
   */
  export const isBoolean = boolean => {
    if (Object.prototype.toString.call(boolean) === '[object Boolean]') {
      return true
    } else {
      return false
    }
  }

/**
 * 动态设置单页 title
 */
export const setTitle = function(t) {
    document.title = t;
    var i = document.createElement("iframe");
    // i.src = '//m.baidu.com/favicon.ico';
    i.style.display = "none";
    i.onload = function() {
        setTimeout(function() {
            i.remove();
        }, 5);
    };
    document.body.appendChild(i);
};

/**
 * 日期格式化
 */
export function formatTime(fmt, date) {
    date = new Date(date + '+08:00') // 兼容safari
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

/**
 * 提交图片路径处理
 */
export const checkPicUrl = (url) => {
    if (!url) {
        return ''
    }
    if (url.indexOf('http') > -1) {
        return ''
    } else {
        return url.substring(url.indexOf(",") + 1)
    }
};

/**
 * 当前时间，用于文件名称，不重复
 *  */
export const getTimestamp = (mini) => {
  const time = new Date();
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  const h = time.getHours();
  const mm = time.getMinutes();
  const s = time.getSeconds();
  const ms = time.getMilliseconds();
  function Add0(m) {
    return m < 10 ? "0" + m : m;
  }
  if (mini === 'mini') {
    return (
      "" +
      Add0(h) +
      Add0(mm) +
      Add0(s) +
      Add0(ms)
    );
  } else {
    return (
      "" +
      y +
      Add0(m) +
      Add0(d) +
      Add0(h) +
      Add0(mm) +
      Add0(s) +
      Add0(ms)
    );
  }
  
}

/**
 * 文件后缀
 */
export const getSuffix = (filename) => {
  let pos = filename.lastIndexOf(".");
  let suffix = "";
  if (pos != -1) {
    suffix = filename.substring(pos);
  }
  return suffix;
}

/**
 * 根据开始时间和N个10分钟，算结束时间
 */
export const getEndTime = (start, num) => {
  let end = '00'
  let startArr = start.split(':')
  let m = Number(startArr[1])
  let result = m+num*10
  let mm = (result%60 + '' === '0') ? '00' : result%60 // x%y 得到余数，如 71%60=11
  let hh = parseInt(result/60) + Number(startArr[0]) + '' // 满60 加 1小时
  hh = hh.length === 1 ? '0'+hh : hh // 个位的补零
  end = hh + ':' + mm

  return end
};

/**
 * 根据开始时间和结束时间，算N个10分钟
 * fun ('10:00', '11:00')
 */
export const getNumTime = (start, end) => {
  // log(start,end)
  let num = 2
  let startArr = start.split(':')
  let endArr = end.split(':')
  let mNum = Number(endArr[1].slice(0,1)) - Number(startArr[1].slice(0,1)) // 分钟直接抹去了
  num = (Number(endArr[0]) - Number(startArr[0]))*6 + mNum // 小时*6 + N个10分钟

  return num;
};

/**
 * 去掉字符串前后所有空格
 */
export const trim = (str, isglobal) => {
  var result
  result = str.replace(/(^\s+)|(\s+$)/g, '')
  if (isglobal && isglobal.toLowerCase() === 'g') {
    result = result.replace(/\s/g, '')
  }
  return result
}

/**
 * 判断是否合法的手机号码
 */
export const checkPhone = phone => {
  phone = trim(phone, 'g')
  var reg = /^1(3|5|6|7|8|9)\d{9}$/
  return !!reg.test(phone)
}

/**
 * 判断是否是合法的Email
 */
export const checkEmail = str => {
  var re = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
  return !!re.test(str)
}
