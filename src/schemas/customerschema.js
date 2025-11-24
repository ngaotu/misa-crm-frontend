import * as yup from "yup";

/**
 * Helper function để transform string date sang Date object cho yup
 * @param {*} value - Giá trị cần transform
 * @returns {Date|null} - Date object hoặc null
 * Author: NTT
 * Date: 19/11/2025
 */
const transformDate = (value) => {
  // Nếu value là null/undefined/empty, trả về null
  if (!value || value === '') return null;
  // Nếu đã là Date object, trả về luôn
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  // Nếu là string, parse sang Date
  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
};

/**
 * Customer validation schema
 * Ràng buộc:
 * - fullName ≤ 128 ký tự (required)
 * - email theo định dạng chuẩn (unique - không check được ở client)
 * - phone 10-11 số (unique - không check được ở client)
 * - address ≤ 255 ký tự
 * 
 * @returns {yup.ObjectSchema}
 * Author: NTT (19/11/2025)
 */
export const customerSchema = yup.object({
  customerCode: yup.string().nullable().transform(value => value === '' ? null : value),
  
  customerFullName: yup
    .string()
    .required("Tên khách hàng không được để trống")
    .max(128, "Tên khách hàng không được vượt quá 128 ký tự")
    .trim(),
  
  
  customerType: yup.string().nullable().transform(value => value === '' ? null : value),
  
  customerTaxCode: yup
    .string()
    .nullable()
    .transform(value => value === '' ? null : value),
  customerPhone: yup
    .string()
    .nullable()
    .transform(value => value === '' ? null : value)
    .test('phone-format', 'Số điện thoại phải có 10-11 chữ số', function(value) {
      if (!value) return true; // Cho phép bỏ trống
      const cleanPhone = value.replace(/\s/g, '');
      return /^[0-9]{10,11}$/.test(cleanPhone);
    })
    .test('phone-duplicate', 'Số điện thoại đã tồn tại trong hệ thống!', async function(value) {
      if (!value) return true;
      const cleanPhone = value.replace(/\s/g, '');
      if (!/^[0-9]{10,11}$/.test(cleanPhone)) return true;
        const { CustomerAPI } = await import('@/apis');
        const api = new CustomerAPI();
        const excludeId = this.parent.customerId || null;
        const res = await api.checkDuplicatePhone(cleanPhone, excludeId);
        const isDuplicate = res.data;
        return !isDuplicate;
    }),
  customerEmail: yup
    .string()
    .nullable()
    .transform(value => value === '' ? null : value)
    .email("Email không hợp lệ")
    .test('email-duplicate', 'Email đã tồn tại trong hệ thống!', async function(value) {
      if (!value) return true;
        const { CustomerAPI } = await import('@/apis');
        const api = new CustomerAPI();
        const excludeId = this.parent.customerId || null;
        const res = await api.checkDuplicateEmail(value, excludeId);
        const isDuplicate = res.data;
        return !isDuplicate;
      
    }),
  customerShippingAddr: yup
    .string()
    .nullable()
    .transform(value => value === '' ? null : value)
    .max(255, "Địa chỉ không được vượt quá 255 ký tự"),
  customerLastPurchaseDate: yup
    .mixed()
    .nullable()
    .transform(transformDate)
    .test('is-date', 'Ngày mua hàng không hợp lệ', function(value) {
      if (!value) return true; // nullable
      return value instanceof Date && !isNaN(value.getTime());
    })
    .test('not-future', 'Ngày mua hàng không được là ngày trong tương lai', function(value) {
      if (!value) return true;
      return value <= new Date();
    }),
  
  customerPurchasedItems: yup.string().nullable().transform(value => value === '' ? null : value),
  customerLastestPurchasedItems: yup
    .string()
    .nullable()
    .transform(value => value === '' ? null : value)
});
