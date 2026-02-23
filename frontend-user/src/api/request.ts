import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { Toast } from 'antd-mobile'

// 创建axios实例
const request = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        // 从localStorage获取token（如果有登录功能）
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error: AxiosError) => {
        const message = error.response?.data?.message || '网络错误，请稍后重试'
        Toast.show({
            content: message,
            position: 'center',
        })
        return Promise.reject(error)
    },
)

export default request
