import axios from 'axios'
import {Message} from "element-ui";
import router from "../router";

//请求拦截

axios.interceptors.response.use(success => {
    if (success.status && success.status == 200 && success.data.code == 500) {
        Message.error({message: success.data.msg});
        return;
    }
    // 操作成功返回操作成功消息
    if (success.data.msg) {
        Message.success({message: success.data.msg});
    }
    return success.data;
}, error => {
    if (error && error.response) {
        if (error.response.status == 404) {
            Message.error({message: '404 not found'});
        } else if (error.response.status == 403) {
            Message.error({message: '403'});
        } else if (error.response.status == 401) {
            Message.error({message: '尚未登录，请登录后再试！'});
            router.replace("/");
        } else if (error.response.status == 500) {
            Message.error({message: '500'});
        } else {
            if (error.response.data.msg) {
                Message.error({message: error.response.data.msg});
            }
        }
    } else {
        Message.error({message: '未知错误'});
    }
    return;
});

let base = '';

// 封装 key value 形式的请求，登录请求
export const postKeyValueRequest = (url, params, rememberMe) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let result = '';
            for (let i in data) {
                result += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            result = result.substring(0, result.length - 1);
            result += "&remember-me=" + rememberMe;
            return result;
        }],
        headers: {
            'Context-Type': 'application/x-www-form-urlencoded'
        }
    })
};

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
    })
};

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params,
    })
};
