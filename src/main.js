import Vue from "vue";
import App from "@/App.vue";
import router from "@/router/index";
import store from "@/store";
import axios from "@/libs/axios";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

Vue.config.productionTip = false;
window.log = console.log.bind(console);

// import _global from './libs/config'
let _global = {
  status: 0,
  baseURL: 'https://programapi.feicuisoft.com/api/'
}

if (process.env.NODE_ENV === 'development') { // 开发阶段
  _global.uploadURL = 'http://api.chinaw.cc/oss/upTest/'
} else if (process.env.NODE_ENV === 'production') { // 生产阶段
  _global.uploadURL = 'http://api.chinaw.cc/oss/up/'
}
Vue.prototype.GLOBAL = _global;

//引入多语言支持
import i18n from './libs/i18n'

new Vue({
  router,
  store,
  axios,
  i18n,
  render: h => h(App)
}).$mount("#app");
