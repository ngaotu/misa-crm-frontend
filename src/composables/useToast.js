import { useToast } from 'primevue/usetoast'

/**
 * Composable để sử dụng PrimeVue Toast
 * @returns {Object} Object chứa các hàm hiển thị toast
 */
export const useToastNotification = () => {
  const toast = useToast()

  /**
   * Hiển thị toast thành công
   * @param {string} message - Thông báo
   * @param {string} title - Tiêu đề (optional)
   */
  const showSuccess = (message, title = 'Thành công') => {
    toast.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000
    })
  }

  /**
   * Hiển thị toast lỗi
   * @param {string} message - Thông báo
   * @param {string} title - Tiêu đề (optional)
   */
  const showError = (message, title = 'Lỗi') => {
    toast.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 3000
    })
  }

  /**
   * Hiển thị toast cảnh báo
   * @param {string} message - Thông báo
   * @param {string} title - Tiêu đề (optional)
   */
  const showWarning = (message, title = 'Cảnh báo') => {
    toast.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: 3000
    })
  }

  /**
   * Hiển thị toast thông tin
   * @param {string} message - Thông báo
   * @param {string} title - Tiêu đề (optional)
   */
  const showInfo = (message, title = 'Thông tin') => {
    toast.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: 3000
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    toast // Expose toast instance để có thể custom
  }
}

