
let _global = {
  status: 0,
  baseURL: 'https://programapi.feicuisoft.com/api/'
}

if (process.env.NODE_ENV === 'development') { // 开发阶段
  _global.uploadURL = 'http://api.chinaw.cc/oss/upTest/'
} else if (process.env.NODE_ENV === 'production') { // 生产阶段
  _global.uploadURL = 'http://api.chinaw.cc/oss/up/'
}

export const global = _global
