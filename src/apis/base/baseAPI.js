import api from '../config/apiConfig';

/**
 * Base API class - Class cơ sở cho tất cả các API service
 * Cung cấp các phương thức HTTP cơ bản: GET, POST, PUT, DELETE
 * Author: NTT (18/11/2025)
 */
class BaseAPI {

  constructor() {
    // Sử dụng axios instance đã được cấu hình từ apiConfig
    this.api = api;
  }
  /**
   * GET request
   * @param {string} url - Đường dẫn API endpoint
   * @param {object} params - Query parameters
   * @returns {Promise} Response data
   * Author: NTT (18/11/2025)
   */
  get(url, params = {}) {
    return this.api.get(url, { params });
  }

  /**
   * POST request
   * @param {string} url - Đường dẫn API endpoint
   * @param {object} data - Request body data
   * @returns {Promise} Response data
   * Author: NTT (18/11/2025)
   */
  post(url, data = {}) {
    return this.api.post(url, data);
  }

  /**
   * PUT request
   * @param {string} url - Đường dẫn API endpoint
   * @param {object} data - Request body data
   * @returns {Promise} Response data
   * Author: NTT (18/11/2025)
   */
  put(url, data = {}) {
    return this.api.put(url, data);
  }

  /**
   * DELETE request
   * @param {string} url - Đường dẫn API endpoint
   * @returns {Promise} Response data
   * Author: NTT (18/11/2025)
   */
  delete(url) {
    return this.api.delete(url);
  }
}

export default BaseAPI;
