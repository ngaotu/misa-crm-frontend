<template>
  <div class="customer-import-file-vertical">
    <!-- Import Form (centered, fixed size) -->
    <div v-if="importResult" class="import-header-bar">
      <div class="import-header-left">
        <span class="import-header-item">Tổng số dòng: <b>{{ importResult.TotalRows }}</b></span>
        <span class="import-header-item">Thành công: <b>{{ importResult.SuccessCount }}</b></span>
        <span class="import-header-item">Thất bại: <b>{{ importResult.ErrorCount }}</b></span>
      </div>
      <div class="import-header-right">
        <MsButton
          class="import-btn upload"
          variant="primary"
          @click="goBack"
          style="min-width: 100px;"
        >Quay lại</MsButton>
      </div>
    </div>

    <!-- Table (MsTable) below, only show if error -->
    <div class="import-table-section flex-1">
      <div v-if="!importResult" class="import-dropzone-center">
        <div class="import-form-box">
          <div class="import-dropzone" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop" :class="{ 'import-dropzone--active': isDragOver }">
            <div class="import-dropzone-content">
              <span class="icon icon-attach-file import-dropzone-icon"></span>
              <div class="import-dropzone-text">
                <span>Kéo và thả tài liệu vào đây hoặc <label class="import-file-label"><input ref="fileInputRef"
                      type="file" accept=".csv,.xls,.xlsx" @change="onFileChange" style="display: none;" /> <span
                      class="import-file-btn">chọn file của bạn</span></label></span>
              </div>
              <div class="import-dropzone-support">Chúng tôi hỗ trợ các file .csv</div>
              <div class="import-file-size-note">Kích thước file không quá <b>5MB</b></div>
              <div v-if="selectedFile" class="import-file-selected">
                <span>Đã chọn: <b>{{ selectedFile.name }}</b></span>
                <span class="import-file-remove" @click="removeFile">✕</span>
                <span v-if="fileError" class="import-file-error">{{ fileError }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MsTable
        v-if="importResult && errorRows.length"
        :fields="errorTableFields"
        :rows="paginatedErrorRows"
        :enablePagination="true"
        :total="errorRows.length"
        :currentPage="errorPage"
        :pageSize="errorPageSize"
        :showDebt="false"
        :disableActions="true"
        class="import-error-table"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #errorMessage="{ value }">
          <span class="error-color">{{ value }}</span>
        </template>
      </MsTable>
      <div v-if="importResult && !errorRows.length" class="wrap-no-data-grid-main-screen">
        <div class="flex flex-col gap-8">
          <span class="icon-empty"></span>
          <div class="text-nodata">Không có bản ghi lỗi nào</div>
        </div>
      </div>
    </div>
    <MsModal v-model="isImporting" transparent style="z-index:9999;">
      <div style="display:flex;align-items:center;justify-content:center;height:120px;background:transparent;">
        <ProgressSpinner style="width: 48px; height: 48px;" strokeWidth="4" fill="transparent" animationDuration="1s" />
      </div>
    </MsModal>
    <div v-if="!importResult" class="import-footer flex items-center ">
      <MsButton class="import-btn cancel" variant="outline" @click="goBack" style="min-width: 100px;">Hủy bỏ</MsButton>
      <MsButton class="import-btn upload" :disabled="!selectedFile || !!fileError || isImporting" @click="importFile" variant="primary"
        style="min-width: 100px; margin-left: 12px;">
        Gửi file
      </MsButton>
    </div>

  </div>
</template>
<script setup>
/**
 * Xử lý chuyển trang bảng lỗi import
 * @param {number} page - Trang chuyển tới
 * Author: NTT (24/11/2025)
 */
const handlePageChange = (page) => {
  errorPage.value = page;
};

/**
 * Xử lý thay đổi số lượng bản ghi trên trang bảng lỗi import
 * @param {number} newPageSize - Số lượng bản ghi mới
 * Author: NTT (24/11/2025)
 */
const handlePageSizeChange = (newPageSize) => {
  errorPageSize.value = newPageSize;
  errorPage.value = 1;
};
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import MsButton from '@/components/ms-button/MsButton.vue';
import MsTable from '@/components/ms-table/MsTable.vue';
import MsModal from '@/components/ms-modal/MsModal.vue';
import { CustomerAPI } from '@/apis';
import { useToastNotification } from '@/composables/useToast.js';
import ProgressSpinner from 'primevue/progressspinner';

// Table fields 
const errorTableFields = [
  { key: 'rowNumber', label: 'Dòng lỗi', width: 80, type: 'text' },
  { key: 'errorMessage', label: 'Lý do lỗi', width: 220, type: 'custom' },
  { key: 'fullName', label: 'Tên khách hàng', width: 160, type: 'text' },
  { key: 'phone', label: 'Số điện thoại', width: 120, type: 'text' },
  { key: 'email', label: 'Email', width: 180, type: 'text' },
  { key: 'address', label: 'Địa chỉ (Giao hàng)', width: 220, type: 'text' },
  { key: 'customerType', label: 'Loại KH', width: 100, type: 'text' },
  { key: 'taxCode', label: 'Mã số thuế', width: 120, type: 'text' },
  { key: 'lastPurchaseDate', label: 'Ngày mua hàng gần nhất', width: 200, type: 'date' },
  { key: 'purchasedItems', label: 'Hàng hóa đã mua', width: 150, type: 'text' },
  { key: 'latestPurchasedItems', label: 'Tên hàng hóa đã mua', width: 150, type: 'text' }
];



const router = useRouter();
const customerAPI = new CustomerAPI();

const selectedFile = ref(null);
const fileError = ref('');
const isDragOver = ref(false);
const importResult = ref(null);
const errorRows = ref([]);
const fileInputRef = ref(null);
const insertingIndex = ref(-1);
const errorPage = ref(1);
const errorPageSize = ref(10);
const isImporting = ref(false); // trạng thái loading khi import

const { showSuccess, showError } = useToastNotification();

/**
 * Xử lý sự kiện khi người dùng chọn file từ input
 * @param {Event} e - Sự kiện thay đổi file
 */
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    fileError.value = 'File vượt quá 5MB!';
    selectedFile.value = null;
    importResult.value = null;
    errorRows.value = [];
    return;
  }
  fileError.value = '';
  selectedFile.value = file;
  importResult.value = null;
  errorRows.value = [];
};

/**
 * Xử lý khi kéo file vào vùng dropzone
 * Author: NTT (21/11/2025)
 */
const onDragOver = () => {
  isDragOver.value = true;
};

/**
 * Xử lý khi rời khỏi vùng dropzone
 * Author: NTT (21/11/2025)
 */
const onDragLeave = () => {
  isDragOver.value = false;
};

/**
 * Xử lý khi thả file vào vùng dropzone
 * @param {DragEvent} e - Sự kiện thả file
 * Author: NTT (21/11/2025)
 */
const onDrop = (e) => {
  const files = e.dataTransfer.files;
  if (files && files.length) {
    const file = files[0];
    if (!file) return;
    /** Check file size and validate. */
    if (file.size > 5 * 1024 * 1024) {
      fileError.value = 'File vượt quá 5MB!';
      selectedFile.value = null;
      importResult.value = null;
      errorRows.value = [];
      isDragOver.value = false;
      return;
    }
    fileError.value = '';
    selectedFile.value = file;
    importResult.value = null;
    errorRows.value = [];
  }
  isDragOver.value = false;
};

/**
 * Thực hiện import file khách hàng
 * Gọi API và xử lý kết quả trả về
 * Author: NTT (21/11/2025)
 */
async function importFile() {
  if (!selectedFile.value) return;
  isImporting.value = true;
  try {
    const res = await customerAPI.import(selectedFile.value);
    if (res && res.data) {
      importResult.value = {
        Summary: `Đã nhập ${res.data.successCount} bản ghi thành công, ${res.data.errorCount} lỗi.`,
        TotalRows: res.data.totalRows,
        SuccessCount: res.data.successCount,
        ErrorCount: res.data.errorCount
      };
      errorRows.value = (res.data.errors || []).map(e => {
        // Xóa dấu phẩy ở đầu cho phone, taxCode
        const phone = e.originalRow?.phone ? String(e.originalRow.phone).replace(/^,/, '') : '-';
        const taxCode = e.originalRow?.taxCode ? String(e.originalRow.taxCode).replace(/^,/, '') : '-';
        return {
          rowNumber: e.rowNumber,
          errorMessage: e.errorMessage,
          fullName: e.originalRow?.fullName || '-',
          phone,
          email: e.originalRow?.email || '-',
          address: e.originalRow?.address || '-',
          customerType: e.originalRow?.customerType || '-',
          taxCode,
          lastPurchaseDate: e.originalRow?.lastPurchaseDate || '',
          purchasedItems: e.originalRow?.purchasedItems || '-',
          latestPurchasedItems: e.originalRow?.latestPurchasedItems || '-'
        };
      });
      if (res.data.errorCount === 0) {
        showSuccess('Nhập file thành công!');
      } else if (res.data.errorCount > 0 && res.data.successCount > 0) {
        showSuccess(`Đã nhập ${res.data.successCount} bản ghi thành công, ${res.data.errorCount} thất bại`);
      }
    } else {
      importResult.value = { Summary: 'Có lỗi khi import file.' };
      errorRows.value = [];
      showError('Nhập file thất bại!');
    }
  } catch (err) {
    importResult.value = { Summary: 'Có lỗi khi import file.' };
    errorRows.value = [];
  } finally {
    isImporting.value = false;
  }
}

/**
 * Xóa file đã chọn
 * Author: NTT (21/11/2025)
 */
const removeFile = () => {
  selectedFile.value = null;
  fileError.value = '';
};

/**
 * Quay lại trang danh sách khách hàng
 * Author: NTT (21/11/2025)
 */
const goBack = () => {
  router.push({ name: 'Customers' });
};

/**
 * Tính toán danh sách lỗi theo trang hiện tại
 * Author: NTT (21/11/2025)
 */
const paginatedErrorRows = computed(() => {
  const start = (errorPage.value - 1) * errorPageSize.value;
  return errorRows.value.slice(start, start + errorPageSize.value);
});
</script>

<style scoped>
/* Import header bar */
.import-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  min-height: 56px;
  max-height: 56px;
  background: #e2e4e9;
  border-bottom: 1px solid var(--border-secondary, #e0e0e0);
  padding: 0 32px;
  box-shadow: none;
  z-index: 2;
}
.import-header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}
.import-header-item {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color);
}
.import-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.wrap-no-data-grid-main-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-top: 32px;
  text-align: left;
}

.text-nodata {
  color: var(--text-color);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.re-try {
  color: #586074;
  font-size: 13px;
  padding-top: 8px;
}

.wrap-no-data-grid-main-screen li {
  color: #586074;
  font-size: 13px;
  padding: 8px 0 0 10px;
  list-style: none;
}

.text-link {
  color: #1976d2;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 4px;
}

.no-wrap {
  white-space: nowrap;
}

/* Vertical layout */
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.customer-import-file-vertical {
  width: 100vw;
  height: 100vh;
  margin: 0;
  background: var(--white-color);
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.import-form-top-centered {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 56px;
  min-height: 56px;
  max-height: 56px;
  background: #e2e4e9;
  border-bottom: 1px solid var(--border-secondary, #e0e0e0);
  padding: 0 20px;
  box-shadow: none;
  z-index: 2;
}

.import-form-box {
  width: auto;
  min-height: 40px;
  padding: 0;
  margin: 0;
  background: none;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.import-empty-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 320px;
  margin-top: 32px;
}

.import-empty-image img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 16px;
  opacity: 0.8;
}

.import-empty-text {
  color: #888;
  font-size: 16px;
  margin-top: 8px;
}

.import-btn {
  min-width: 100px;
}

.import-btn.download.disabled {
  pointer-events: none;
  opacity: 0.5;
  background: #ccc;
  color: #fff;
  cursor: not-allowed;
}

.import-table-section {
  /* padding: 0 32px 0 32px; */
  flex: 1 1 0;
  min-height: 0;
  background: #fff;
  /* Table section fills remaining height */
  /* height: calc(100vh - 56px - 56px - 56px -56px); */
  /* Loại bỏ overflow, scroll sẽ nằm trong MsTable */
}


.import-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* gap: 16px; */
  height: 56px;
  padding: 0px 16px;
  border-top: 1px solid #e0e0e0;
  background: #fff;
  z-index: 2;
}

.import-title {
  font-size: var(--font-size-title, 22px);
  font-weight: var(--font-weight-bold, 700);
  margin-bottom: 8px;
}

.import-desc {
  color: var(--text-secondary, #666);
  margin-bottom: 24px;
}

.import-file-size-note {
  color: var(--danger-color, #f44336);
  font-size: var(--font-size-small, 13px);
  margin-bottom: 8px;
  font-weight: var(--font-weight-semibold, 600);
}

.import-dropzone {
  border: 2px dashed var(--primary-color, #2196f3);
  border-radius: var(--border-radius, 8px);
  background: #f5faff;
  padding: 32px 0 24px 0;
  text-align: center;
  transition: border-color 0.2s;
  margin-bottom: 24px;
  position: relative;
}

.import-dropzone--active {
  border-color: var(--primary-hover, #1976d2);
  background: #e3f2fd;
}

.import-dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.import-dropzone-icon {
  font-size: 48px;
  color: var(--primary-color, #2196f3);
  margin-bottom: 8px;
}

.import-dropzone-text {
  padding: 8px;
  margin-top: 12px;
  margin-bottom: 4px;
  color: var(--text-color, #333);
}

.import-file-label {
  cursor: pointer;
  margin-left: 6px;
}

.import-file-btn {
  color: var(--primary-color, #2196f3);
  font-weight: var(--font-weight-semibold, 600);
  text-decoration: underline;
  cursor: pointer;
}

.import-dropzone-support {
  color: var(--text-tertiary, #888);
  font-size: var(--font-size-small, 13px);
  margin-top: 8px;
  margin-bottom: 16px;
}

.import-file-selected {
  margin-top: 10px;
  color: var(--primary-color, #2196f3);
  font-size: var(--font-size-primary, 14px);
  display: flex;
  align-items: center;
  gap: 8px;
}

.import-file-remove {
  color: var(--danger-color, #f44336);
  cursor: pointer;
  font-size: 16px;
  margin-left: 4px;
}

.import-btn {
  padding: 16px 8px;
  font-size: var(--font-size-primary, 13px);
  font-weight: var(--font-weight-semibold, 600);
}

.import-btn-group {
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.import-btn-group-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: 0;
  padding: 0;
}

.import-file-error {
  color: var(--danger-color, #f44336);
  font-size: var(--font-size-small, 13px);
  margin-left: 8px;
}

.import-result {
  margin-top: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color, #4262F0);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
}

.import-error-table th,
.import-error-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.import-error-table th {
  background: #f5f5f5;
}

.import-error-input {
  width: 100%;
  border: 1px solid var(--primary-color, #2196f3);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: var(--font-size-primary, 14px);
}

.import-dropzone-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px - 56px);
}

.error-color {
  color: var(--danger-color, #f44336);
  font-weight: 600;
}
/* Spinner for per-row insert button */
.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(33, 150, 243, 0.2);
  border-top-color: #1976d2;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

