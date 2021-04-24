import axios from "axios";
import { message, Modal } from "antd";
import { devHost, prodHost } from "../config";
import i18n from "i18next";

let number = 0;
console.log(process.env.NODE_ENV, prodHost, "process.env.NODE_ENV");
const $axios = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? `${devHost}/api`
      : `${prodHost}/api`,
  timeout: 15000,
  retry: 4,
  retryDelay: 1000,
});

//请求拦截
$axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("jwt");
    config.headers = { Authorization: `Bearer ${token}` };
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    message.error(error.response.data.message);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
$axios.interceptors.response.use(
  function (response) {
    //获取更新的token
    const { authorization } = response.headers;
    //如果token存在则存在localStorage
    authorization && localStorage.setItem("tokenName", authorization);
    return response;
  },
  function (error) {
    if (error.response) {
      const status = error.response.status;
      if (!status) {
        message.error(i18n.t("Fetching data error"));
        return;
      }
      //如果401则到登录页
      //如果401或405则到登录页
      if (status === 401 || status === 405) {
        // history.push("/login");
        //解决多次提示重新登录的问题
        if (number === 1) {
          return;
        }
        localStorage.removeItem("jwt");
        Modal.warning({
          title: i18n.t("Login credential outdated"),
          content: i18n.t("Please retry"),
        });
        number++;
        window.location.reload();
      }
    } else {
      message.error(i18n.t("Fetching data out of time"));
    }
    return Promise.reject(error);
  }
);

export default $axios;
