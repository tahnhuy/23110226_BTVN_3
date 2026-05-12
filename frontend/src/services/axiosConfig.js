import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api', // Thay đổi port này nếu backend của bạn chạy ở port khác
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Interceptor: Trước khi gửi request, tự động đính kèm Token (nếu có)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor: Xử lý response trả về
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Xử lý chung khi gặp lỗi từ API (VD: token hết hạn, unauthorized)
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized! Token có thể đã hết hạn.');
            // Thực hiện logout hoặc refresh token ở đây nếu cần
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

export default axiosInstance;
