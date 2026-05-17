import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { ApiErrorPayload } from '../types/api';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized! Token có thể đã hết hạn.');
        }
        return Promise.reject((error.response?.data as ApiErrorPayload) || error.message);
    }
);

/** Axios instance that returns unwrapped `response.data` (see response interceptor). */
export interface ApiClient {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export default axiosInstance as unknown as ApiClient;
