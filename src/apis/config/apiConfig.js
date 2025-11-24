import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7236/api';

/**
   * API configuration - Cấu hình chung cho tất cả các API calls
   * Author: NTT (18/11/2025)
   */
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor bắt lỗi response từ API, đặc biệt 401/403 để xử lý đăng nhập hoặc phân quyền.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response && [401, 403].includes(error.response.status)) {
      // handle error
    }
    return Promise.reject(error);
  },
);

export default api;