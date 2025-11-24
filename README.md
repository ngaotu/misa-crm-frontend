# misa-vue

Quản lý khách hàng với Vue 3, Vite, VeeValidate

## Giới thiệu
Dự án misa-vue là hệ thống quản lý khách hàng dành cho doanh nghiệp vừa và nhỏ

## Tính năng chi tiết
- **Quản lý danh sách khách hàng:**
  - Hiển thị bảng danh sách, tìm kiếm theo tên, email, số điện thoại.
  - Phân trang, chọn số lượng hiển thị trên mỗi trang.
  - Sắp xếp theo các trường dữ liệu.
- **Thêm/Sửa/Xóa khách hàng:**
  - Form nhập liệu với kiểm tra hợp lệ (VeeValidate, Yup).
  - Kiểm tra trùng email/số điện thoại qua API realtime.
  - Hiển thị lỗi chi tiết từng trường, cảnh báo trùng lặp.
- **Import file khách hàng:**
  - Hỗ trợ file CSV, kéo thả hoặc chọn file.
  - Kiểm tra kích thước file, validate định dạng.
  - Hiển thị kết quả import: tổng số dòng, số dòng thành công, số dòng lỗi.
  - Bảng lỗi chi tiết từng dòng: lý do lỗi, dữ liệu gốc, cho phép xem lại.
- **Thông báo & UX:**
  - Toast thông báo thành công/thất bại, cảnh báo nhập liệu.
  - Component tuỳ chỉnh: MsTable (bảng), MsInput (input), MsSelect (select), MsDatePicker (chọn ngày), MsModal (modal), MsButton (nút bấm).
- **Kiểm thử & chất lượng:**
  - Unit test với Vitest cho các hàm logic, component.
  - E2E test với Playwright cho luồng nhập liệu, import, validate.

## Công nghệ sử dụng
- **Vue 3** (Composition API, SFC)
- **Vite** (build nhanh, HMR)
- **VeeValidate + Yup** (validate form, async check)
- **Playwright** (kiểm thử end-to-end)
- **Vitest** (unit test)
- **Pinia** (state management)
- **SCSS/CSS** (tối ưu UI)

## Cấu trúc thư mục
```
src/
  apis/           // API layer: gọi backend, check trùng, import
  assets/         // Hình ảnh, fonts, style
  components/     // Component dùng lại (MsTable, MsInput...)
  composables/    // Hook logic (useToast, useGenerateCode...)
  constants/      // Hằng số, enum, trạng thái
  layouts/        // Layout chung (Header, TheLayout)
  pages/          // Trang đặc biệt (NotFoundPage)
  router/         // Định tuyến Vue Router
  schemas/        // Schema validate (customerschema)
  stores/         // Pinia store (counter...)
  utils/          // Hàm tiện ích (formatter...)
  views/          // Các màn hình chính (customer CRUD, import...)
```

## Hướng dẫn cài đặt & chạy
1. Clone repo về máy:
   ```sh
   git clone https://github.com/ngaotu/misa-vue.git
   cd misa-vue
   ```
2. Cài đặt dependencies:
   ```sh
   npm install
   ```
3. Chạy ứng dụng:
   ```sh
   npm run dev
   ```
4. Truy cập: http://localhost:5173

## Kiểm thử
- Chạy unit test:
  ```sh
  npm run test
  ```
- Chạy E2E test:
  ```sh
  npm run test:e2e
  ```

## Đóng góp
- Fork repo, tạo branch mới, gửi PR về master.
- Viết code theo chuẩn convention, bổ sung comment rõ ràng cho hàm, biến, logic.
- Đảm bảo test pass trước khi gửi PR.

## Liên hệ & hỗ trợ
- Tác giả: ngaotu
- Email: [your-email@example.com]
- Vui lòng liên hệ để báo lỗi, góp ý hoặc hợp tác phát triển.
