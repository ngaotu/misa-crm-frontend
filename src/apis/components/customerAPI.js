import BaseAPI from '../base/baseAPI';

/**
 * Customer API Service - Kế thừa từ BaseAPI
 * Xử lý các API calls liên quan đến Customer module
 * Author: NTT (18/11/2025)
 */

class CustomerAPI extends BaseAPI {
  constructor() {
    super();
    this.endpoint = '/Customer';
  }

  /**
   * Gán loại khách hàng cho nhiều khách hàng
   * @param {Object} payload { customerIds: Array<string>, customerType: string }
   * @returns {Promise} Response data
   * Author: NTT (18/11/2025)
   */
  async bulkAssignType(payload) {
    // POST /api/customer/bulk-assign-type
    const response = await this.api.post(this.endpoint + '/bulk-assign-type', payload);
    return response.data;
  }

  /**
   * Xóa nhiều khách hàng
   * @param {Object} customerIds  customerIds: Array<string> - Danh sách ID khách hàng cần xóa
   * @returns {Promise} Response data
   * Author: NTT (18/11/2025)
   */
  async bulkDelete(customerIds) {
    // POST /api/customer/bulk-delete
    const response = await this.api.post(this.endpoint + '/bulk-delete', customerIds);
    return response.data;
  }

  /**
   * Export nhiều khách hàng ra file CSV
   * @param {Array<string>} customerIds - Danh sách ID khách hàng
   * @returns {Promise<Blob>} File CSV
   * Author: NTT (19/11/2025)
   */
  async exportCSV(customerIds) {
    // POST /api/Customer/export (body là mảng ID)
    const response = await this.api.post(this.endpoint + '/export', customerIds, { responseType: 'blob' });
    return response.data;
  }

  /**
   * Lấy danh sách customer có phân trang
   * @param {object} params - Query parameters {pageNumber, pageSize, keyword}
   * @returns {Promise} Response data với cấu trúc {success, data: {items, totalRecords, currentPage, pageSize}, message}
   * Author: NTT (18/11/2025)
   */
  async getPaging(params = {}) {
    // console.log('CustomerAPI.getPaging called with params:', params);
    const response = await this.get(`${this.endpoint}/paging`, params);
    return response.data;
  }


  /**
   * Import danh sách customer từ file Excel
   * @param {File} file - File Excel chứa dữ liệu customer
   * @returns {Promise} Response data với kết quả import
   * Author: NTT (19/11/2025)
   */
  async import(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.api.post(`${this.endpoint}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  /**
   * Lấy tất cả customer (không phân trang)
   * @returns {Promise} Response data với danh sách tất cả customers
   * Author: NTT (18/11/2025)
   */
  async getAll() {
    const response = await this.get(this.endpoint);
    return response.data;
  }

  /**
   * Tạo mới customer (hỗ trợ gửi kèm file avatar)
   * @param {object|FormData} customerData - Dữ liệu customer cần tạo mới (có thể là FormData nếu có file)
   * @returns {Promise} Response data với thông tin customer vừa tạo
   * Author: NTT (22/11/2025)
   */
  async create(customerData) {
    // Nếu là FormData (có file), gửi lên endpoint /with-file với multipart
    if (customerData instanceof FormData) {
      const response = await this.api.post(this.endpoint + '/with-file', customerData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    const response = await this.post(this.endpoint, customerData);
    return response.data;
  }

  /**
   * Lấy thông tin chi tiết customer theo ID
   * @param {string} id - Customer ID (GUID)
   * @returns {Promise} Response data với thông tin chi tiết customer
   * Author: NTT (18/11/2025)
   */
  async getById(id) {
    const response = await this.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Cập nhật thông tin customer (hỗ trợ gửi kèm file avatar)
   * @param {string} id - Customer ID (GUID)
   * @param {object|FormData} customerData - Dữ liệu customer cần cập nhật (có thể là FormData nếu có file)
   * @returns {Promise} Response data với thông tin customer sau khi update
   * Author: NTT (22/11/2025)
   */
  async update(id, customerData) {
    // Nếu là FormData (có file), gửi lên endpoint /with-file với multipart
    if (customerData instanceof FormData) {
      const response = await this.api.put(this.endpoint + `/${id}/with-file`, customerData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    // Nếu không có file, gửi như cũ
    const response = await this.put(`${this.endpoint}/${id}`, customerData);
    return response.data;
  }

  /**
   * Xóa customer theo ID
   * @param {string} id - Customer ID (GUID)
   * @returns {Promise} Response data xác nhận xóa thành công
   * Author: NTT (18/11/2025)
   */
  async delete(id) {
    const response = await super.delete(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Sinh mã customer tự động theo quy tắc
   * @returns {Promise} Response data với customer code mới được generate
   * Author: NTT (18/11/2025)
   */
  async generateCode() {
    const response = await this.get(`${this.endpoint}/generate-code`);
    return response;
  }
   /**
     * Kiểm tra email trùng
     * @param {string} email - email cần kiểm tra
     * @param {string|null} excludeId - ID khách hàng cần xóa
     * @returns {Promise<boolean>} true nếu trùng
     * Author: NTT (18/11/2025)
     */
    async checkDuplicateEmail(email, excludeId = null) {
      const params = { email };
      if (excludeId) params.excludeId = excludeId;
      const response = await this.get(this.endpoint + '/check-duplicate/email', params);
      return response.data;
    }

    /**
     * Kiểm tra số điện thoại trùng
     * @param {string} phone - số điện thoại cần kiểm tra
     * @param {string|null} excludeId - ID khách hàng cần xóa
     * @returns {Promise<boolean>} true nếu trùng
     * Author: NTT (18/11/2025)
     */
    async checkDuplicatePhone(phone, excludeId = null) {
      const params = { phone };
      if (excludeId) params.excludeId = excludeId;
      const response = await this.get(this.endpoint + '/check-duplicate/phone', params);
      return response.data;
    }
}

export default CustomerAPI;
