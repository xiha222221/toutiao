// 请求模块
import axios from 'axios'
import store from '@/store/index.js'
const request = axios.create({
    baseURL: 'http://www.liulongbin.top:8000'
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function(config) {
    // 请求发起会经过这里
    // config：本次请求的请求配置对象
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
    console.log(config);
    return config
}, function(error) {
    //如果请求出错了（还没有发出去）会进入这里
    return Promise.reject(error);
});


// 响应拦截器
export default request