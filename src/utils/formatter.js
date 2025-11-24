/**
 * Format number value
 * @param {*} value 
 * @returns {string}
 * Author: NTT (18/11/2025)
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return new Intl.NumberFormat('vi-VN').format(value);
};

/**
 * Format date value
 * @param {*} value 
 * @returns {string}
 * Author: NTT (18/11/2025)
 */
export const formatDate = (value) => {
  // Kiểm tra giá trị rỗng
  if (!value || value === null || value === undefined || value === '') {
    return '';
  }
  
  // Kiểm tra date mặc định (01/01/0001)
  if (value === '0001-01-01T00:00:00' || value.startsWith('0001-01-01')) {
    return '';
  }
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

/**
 * Format text value
 * @param {*} value 
 * @returns {string}
 * Author: NTT (18/11/2025)
 */
export const formatText = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return String(value);
};

