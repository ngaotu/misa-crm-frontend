export const STATUS_LABEL = (status) => {
    const statusMap = {
      '0': 'Chờ xử lý',
      '1': 'Đang phỏng vấn',
      '2': 'Đã chấp nhận',
      '3': 'Đã từ chối'
    };
    return statusMap[status] || status;
  };