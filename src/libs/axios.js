import Vue from "vue";
import axios from "axios";

Vue.prototype.$axios = axios;
export default {};
// //http request 请求头拦截器
// //http://www.php.cn/js-tutorial-394773.html
import { getStore } from "@/libs/utils.js";

axios.interceptors.request.use(
    config => {
        // 排除此接口，不加 Authorization 请求头
        if (config.url.indexOf("/User/PCUserLogin") === -1) {
            try{
                let token = getStore("loginObj").Ticket;

                if (!token) {
                console.warn('no token', '请检查！');
                return;
                }
                //请求方式
                switch (config.method.toLowerCase()) {
                    case "get":
                    case "delete":
                    case "post":
                    case "put":
                        Object.assign(config.headers, {
                            Authorization: 'BasicAuth ' + token
                        });
                        break;
                    default:
                }
            } catch(e) {
                log('no ticket')
            }
            
        }
        return config;

    },
    error => {
        return Promise.reject(error);
    }
);

//http response 后台返回拦截器
axios.interceptors.response.use(
    response => {
        // console.log(response)
        if (typeof response.data === "string") {
            // return JSON.parse(response.data);
        } else {
            return response.data;
        }
    },
    error => {
        return Promise.reject(error);
    }
);