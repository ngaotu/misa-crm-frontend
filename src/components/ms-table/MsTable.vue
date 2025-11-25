<template>
  <div class="ms-table-container flex-1 flex flex-column justify-between">
    <div class="ms-table-wrapper flex-1 flex flex-column">
      <div ref="headerRef" class="ms-table-header-wrapper">
        <table class="ms-table">
          <colgroup>
            <col v-if="selectable" style="width: 40px; min-width: 40px;" />
            <col v-for="field in fields" :key="'col-h-' + field.key" :style="{
              width: (field.width ? field.width + 'px' : '150px'),
              minWidth: (field.width ? field.width + 'px' : '80px')
            }" />
            <col style="width: 0px; min-width: 0px;" />
          </colgroup>

          <thead>
            <tr>
              <th v-if="selectable" class="checkbox-col">
                <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" class="table-checkbox" />
              </th>
              <th v-for="field in fields" :key="field.key" @click="handleHeaderClick(field, $event)" :class="{
                'sortable': isFieldSortable(field),
                'sorted': sortBy === field.key
              }">
                <div class="th-content">
                  <span :title="field.label">{{ field.label }}</span>
                  <span v-if="sortBy === field.key && sortDirection" class="sort-icon">
                    <span v-if="sortDirection === 'asc'" class="icon icon-dropdown"
                      style="transform: rotate(180deg);"></span>
                    <span v-else class="icon icon-dropdown"></span>
                  </span>
                </div>
              </th>
              <th class="actions-header"></th>
            </tr>
          </thead>
        </table>
      </div>

      <div ref="bodyRef" class="ms-table-body-wrapper flex-1" @scroll="handleScroll">
        <table class="ms-table">
          <colgroup>
            <col v-if="selectable" style="width: 40px; min-width: 40px;" />
            <col v-for="field in fields" :key="'col-b-' + field.key" :style="{
              width: (field.width ? field.width + 'px' : '150px'),
              minWidth: (field.width ? field.width + 'px' : '80px')
            }" />
            <col style="width: 0px; min-width: 0px;" />
          </colgroup>

          <tbody>
            <tr v-for="(row, rowIndex) in paginatedRows" :key="rowIndex" class="table-row"
              :class="{ 'selected': isRowSelected(row) }">
              <td v-if="selectable" class="checkbox-col">
                <input type="checkbox" :checked="isRowSelected(row)" @change="toggleRowSelection(row)"
                  class="table-checkbox" />
              </td>
              <td v-for="field in fields" :key="field.key" class="table-cell"
                :title="row[field.key] ? handleFormat(row[field.key], field.type || 'text') : ''">
                <template v-if="field.type === 'custom'">
                  <slot :name="field.key" :row="row" :field="field" :value="row[field.key]">
                    {{ handleFormat(row[field.key], 'text') }}
                  </slot>
                </template>
                <template v-else>
                  {{ handleFormat(row[field.key], field.type || 'text') }}
                </template>
              </td>

              <td class="actions-cell">
                <div class="actions-overlay">
                  <template v-if="$slots.actions">
                    <slot name="actions" :row="row" :rowIndex="rowIndex" />
                  </template>
                  <template v-else>
                    <span v-if="!disableActions" class="btn-action btn-edit" @click="handleEdit(row)" title="Sửa">
                      <span class="icon icon-edit"></span>
                    </span>
                    <span v-if="!disableActions" class="btn-action btn-delete" @click="handleDelete(row)" title="Xóa">
                      <span class="icon icon-delete"></span>
                    </span>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="paginatedRows.length === 0" class="wrap-no-data-grid-main-screen">
          <div class="flex flex-col gap-8">
            <span class="icon-empty"></span>
            <div class="text-nodata">Không có bản ghi nào</div>
            <div class="re-try">
              <span>Kiểm tra lại điều kiện lọc</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showSortPopup" class="sort-popup-overlay" @click="closeSortPopup">
        <div class="sort-popup" :style="{
          top: sortPopupPosition.top + 'px',
          left: sortPopupPosition.left + 'px'
        }" @click.stop>
          <div class="sort-option" @click="applySort('asc')">
            <span class="icon icon-dropdown" style="transform: rotate(180deg);"></span>
            <span>Tăng dần</span>
          </div>

          <div class="sort-option" @click="applySort('desc')">
            <span class="icon icon-dropdown"></span>
            <span>Giảm dần</span>
          </div>

          <div v-if="sortBy === sortPopupField?.key" class="sort-option sort-clear" @click="clearSort">
            <span class="icon icon-none"></span>
            <span>Không sắp xếp</span>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="ms-table-pagination" v-if="enablePagination">
      <div class="pagination-left">
        <div class="icon icon-total-rows"></div>
        <div class="pagination-records flex flex-col gap-4">
          <span>Tổng số:</span>
          <span class="pagination-records-total">{{ total }}</span>
        </div>
        <div v-if="showDebt" class="pagination-records flex flex-col gap-4">
          <span>Công nợ:</span>
          <span class="pagination-records-total">0</span>
        </div>
      </div>

      <div class="pagination-right">
        <div class="pagination-page-size">
          <MsSelect id="pageSizeSelect" v-model="internalPageSize" :options="pageSizeOptions"
            class="page-size-select" />
        </div>

        <div class="pagination-controls">
          <button class="pagination-btn btn-first" :disabled="currentPage === 1" @click="goToPage(1)" title="Trang đầu">
            <span class="icon icon-start-page"></span>
          </button>
          <button class="pagination-btn btn-prev" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)"
            title="Trang trước">
            <span class="icon icon-previous-page"></span>
          </button>
          <div class="pagination-info">
            <strong>{{ paginationStart }}</strong>
            <span> đến </span>
            <strong>{{ paginationEnd }}</strong>
          </div>
          <button class="pagination-btn btn-next" :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)" title="Trang sau">
            <span class="icon icon-next-page"></span>
          </button>
          <button class="pagination-btn btn-last" :disabled="currentPage === totalPages" @click="goToPage(totalPages)"
            title="Trang cuối">
            <span class="icon icon-end-page"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { formatNumber, formatDate, formatText } from '@/utils/formatter';
import MsSelect from '@/components/ms-form-field/MsSelect.vue';


//#region Props
const props = defineProps({
  fields: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(field => {
        const validTypes = ['text', 'number', 'date', 'custom'];
        return field.key &&
          field.label &&
          validTypes.includes(field.type || 'text');
      });
    }
  },
  rows: {
    type: Array,
    required: true
  },
  enablePagination: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  selectable: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  sortBy: {
    type: String,
    default: ''
  },
  sortDirection: {
    type: String,
    default: '',
    validator: (value) => ['', 'asc', 'desc'].includes(value)
  },
  sortableFields: {
    type: Array,
    default: () => []
  },
  disableActions: {
    type: Boolean,
    default: false
  },
  showDebt: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['edit', 'delete', 'edit-selected', 'delete-selected', 'page-change', 'page-size-change', 'update:modelValue', 'sort-change']);

// Page size select internal state
const pageSizeOptions = [
  { label: '10 Bản ghi trên trang', value: 10 },
  { label: '20 Bản ghi trên trang', value: 20 },
  { label: '50 Bản ghi trên trang', value: 50 },
  { label: '100 Bản ghi trên trang', value: 100 }
];

const internalPageSize = ref(props.pageSize);
watch(() => props.pageSize, (v) => { internalPageSize.value = v; });
watch(internalPageSize, (v) => { emit('page-size-change', v); });

// Refs cho 2 table để sync scroll
const headerRef = ref(null);
const bodyRef = ref(null);

/**
 * Đồng bộ scroll ngang giữa Header và Body
 * Khi body scroll ngang -> cập nhật header
 * Author: NTT
 * Date: 22/11/2025
 * @param {Event} e - Sự kiện scroll của body
 * @returns {void}
 */
const handleScroll = (e) => {
  if (headerRef.value) {
    headerRef.value.scrollLeft = e.target.scrollLeft;
  }
};

//#region Selection


/**
 * Kiểm tra một row có được chọn không
 * Author: NTT
 * Date: 18/11/2025
 * @param {Object} row - Dòng dữ liệu cần kiểm tra
 * @returns {boolean} - True nếu row được chọn, false nếu không
 */
const isRowSelected = (row) => {
  if (!props.selectable) return false;
  const rowId = row[props.rowKey];
  return props.modelValue.includes(rowId);
};


/**
 * Kiểm tra tất cả rows có được chọn không
 * Author: NTT
 * Date: 18/11/2025
 * @returns {boolean} - True nếu tất cả rows được chọn, false nếu không
 */
const isAllSelected = computed(() => {
  if (!props.selectable || props.rows.length === 0) return false;
  return props.rows.every(row => isRowSelected(row));
});


/**
 * Toggle chọn/bỏ chọn một row
 * Author: NTT
 * Date: 18/11/2025
 * @param {Object} row - Dòng dữ liệu cần toggle
 * @returns {void}
 */
const toggleRowSelection = (row) => {
  const rowId = row[props.rowKey];
  const newSelection = [...props.modelValue];
  const index = newSelection.indexOf(rowId);

  if (index > -1) {
    newSelection.splice(index, 1);
  } else {
    newSelection.push(rowId);
  }

  emit('update:modelValue', newSelection);
};


/**
 * Toggle chọn/bỏ chọn tất cả rows
 * Author: NTT
 * Date: 18/11/2025
 * @returns {void}
 */
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    emit('update:modelValue', []);
  } else {
    const allIds = props.rows.map(row => row[props.rowKey]);
    emit('update:modelValue', allIds);
  }
};
//#endregion

//#region Sorting
const showSortPopup = ref(false);
const sortPopupField = ref(null);
const sortPopupPosition = ref({ top: 0, left: 0 });


/**
 * Kiểm tra field có sortable không
 * Author: NTT
 * Date: 19/11/2025
 * @param {Object} field - Thông tin cột
 * @returns {boolean} - True nếu field có thể sort, false nếu không
 */
const isFieldSortable = (field) => {
  if (props.sortableFields.length === 0) {
    return true;
  }
  return props.sortableFields.includes(field.key);
};


/**
 * Mở popup sort khi click vào column header
 * Author: NTT
 * Date: 19/11/2025
 * @param {Object} field - Thông tin cột được click
 * @param {Event} event - Sự kiện click
 * @returns {void}
 */
const handleHeaderClick = (field, event) => {
  if (!isFieldSortable(field)) return;

  const rect = event.currentTarget.getBoundingClientRect();
  sortPopupPosition.value = {
    top: rect.bottom + 4,
    left: rect.left
  };

  sortPopupField.value = field;
  showSortPopup.value = true;
};


/**
 * Áp dụng sort cho field
 * Author: NTT
 * Date: 19/11/2025
 * @param {string} direction - Hướng sắp xếp ('asc' hoặc 'desc')
 * @returns {void}
 */
const applySort = (direction) => {
  if (!sortPopupField.value) return;

  emit('sort-change', {
    sortBy: sortPopupField.value.key,
    sortDirection: direction
  });

  showSortPopup.value = false;
};


/**
 * Xóa sort hiện tại
 * Author: NTT
 * Date: 19/11/2025
 * @returns {void}
 */
const clearSort = () => {
  emit('sort-change', {
    sortBy: '',
    sortDirection: ''
  });

  showSortPopup.value = false;
};


/**
 * Đóng popup sort
 * Author: NTT
 * Date: 19/11/2025
 * @returns {void}
 */
const closeSortPopup = () => {
  showSortPopup.value = false;
};
//#endregion



/**
 * Định dạng giá trị cell theo kiểu dữ liệu
 * Author: NTT
 * Date: 18/11/2025
 * @param {*} value - Giá trị cần định dạng
 * @param {string} type - Kiểu dữ liệu ('text', 'number', 'date')
 * @returns {string} - Giá trị đã được định dạng
 */
const handleFormat = (value, type) => {
  switch (type) {
    case 'number':
      return formatNumber(value);
    case 'date':
      return formatDate(value);
    case 'text':
      return formatText(value);
    default:
      return formatText(value);
  }
};


/**
 * Xử lý sự kiện sửa bản ghi
 * Author: NTT
 * Date: 18/11/2025
 * @param {Object} row - Dòng dữ liệu cần sửa
 * @returns {void}
 */
const handleEdit = (row) => {
  emit('edit', row);
};


/**
 * Xử lý sự kiện xóa bản ghi
 * Author: NTT
 * Date: 18/11/2025
 * @param {Object} row - Dòng dữ liệu cần xóa
 * @returns {void}
 */
const handleDelete = (row) => {
  emit('delete', row);
};


/**
 * Tính toán dữ liệu phân trang
 * Author: NTT
 * Date: 18/11/2025
 * @returns {Array} - Mảng dữ liệu đã phân trang
 */
const paginatedRows = computed(() => {
  if (!props.enablePagination) {
    return props.rows;
  }
  if (props.total > 0) {
    return props.rows;
  }
  const start = (props.currentPage - 1) * props.pageSize;
  const end = start + props.pageSize;
  return props.rows.slice(start, end);
});


/**
 * Tính tổng số trang
 * Author: NTT
 * Date: 18/11/2025
 * @returns {number} - Tổng số trang
 */
const totalPages = computed(() => {
  if (!props.enablePagination) return 1;
  return Math.ceil(props.total / props.pageSize);
});


/**
 * Tính số thứ tự bản ghi đầu tiên của trang hiện tại
 * Author: NTT
 * Date: 19/11/2025
 * @returns {number} - Số thứ tự bản ghi đầu tiên
 */
const paginationStart = computed(() => {
  if (!props.enablePagination || props.total === 0) return 0;
  return (props.currentPage - 1) * props.pageSize + 1;
});


/**
 * Tính số thứ tự bản ghi cuối cùng của trang hiện tại
 * Author: NTT
 * Date: 19/11/2025
 * @returns {number} - Số thứ tự bản ghi cuối cùng
 */
const paginationEnd = computed(() => {
  if (!props.enablePagination || props.total === 0) return 0;
  return Math.min(props.currentPage * props.pageSize, props.total);
});


/**
 * Chuyển trang khi click phân trang
 * Author: NTT
 * Date: 18/11/2025
 * @param {number} page - Số trang cần chuyển tới
 * @returns {void}
 */
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page);
  }
};
</script>

<style scoped>
/* Table container */
.ms-table-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height) - 56px);
  width: 100%;
}

/* Table wrapper chung */
.ms-table-wrapper {
  background-color: #fff;
  border-radius: 6px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 1. HEADER WRAPPER */
.ms-table-header-wrapper {
  overflow-x: hidden;
  /* Ẩn thanh scroll ngang của header */
  overflow-y: hidden;
  background-color: #f1f2f4;
  flex-shrink: 0;
  /* Không co lại */
  width: 100%;
}

/* 2. BODY WRAPPER */
.ms-table-body-wrapper {
  overflow-x: auto;
  /* Scroll ngang khi content lớn */
  overflow-y: auto;
  /* Scroll dọc cho dữ liệu */
  width: 100%;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: #c5c9d3 #f1f1f1;
}

/* Custom scrollbar styling */
.ms-table-body-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.ms-table-body-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.ms-table-body-wrapper::-webkit-scrollbar-thumb {
  background: #c5c9d3;
  border-radius: 4px;
}

.ms-table-body-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* CHUNG CHO TABLE */
.ms-table {
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
  table-layout: fixed;
}

/* CSS cho Header */
.ms-table th {
  height: var(--row-height);
  text-align: left;
  vertical-align: middle;
  padding: 0 16px;
  background-color: #f1f2f4;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-primary);
  color: var(--text-color);
  border-bottom: 2px solid var(--background-main-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ms-table th:hover {
  cursor: pointer;
}

/* Sortable */
.ms-table th.sortable {
  cursor: pointer;
  user-select: none;
}

/* .ms-table th.sorted {
  background-color: #d0e7ff;
} */

.th-content {
  display: flex;
  align-items: center;
  gap: 4px;
  /* justify-content: space-between; */
  width: 100%;
}

.sort-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checkbox-col {
  /* Width xử lý bởi colgroup, ở đây chỉ style nội dung */
  text-align: center;
  padding: 0 !important;
  display: table-cell;
  vertical-align: middle;
}

.table-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--primary-color);
  margin: 0 auto;
  display: block;
}

/* CSS cho Body Cell */
.ms-table td {
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
  height: var(--row-height);
  font-size: var(--font-size-primary);
  color: var(--text-color);
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ms-table tbody tr {
  height: var(--row-height);
  position: relative;
}

.ms-table tbody tr:hover {
  background-color: #d0d8fb !important;
}

.ms-table tbody tr:hover td {
  background-color: #d0d8fb !important;
}

.ms-table tbody tr.selected {
  background-color: #d0d8fb !important;
}

.ms-table tbody tr.selected td {
  background-color: #d0d8fb !important;
}

/* ACTIONS COLUMN */
.actions-header {
  width: 0;
  padding: 0 !important;
  border: none;
}

.actions-cell {
  width: 0;
  padding: 0 !important;
  position: sticky;
  /* Sticky để overlay luôn bám phải */
  overflow: visible !important;
  right: 0;
  z-index: 5;
  background: transparent;
  border-bottom: 1px solid #eee;
  /* Giữ border để đẹp */
}

/* Khi hover tr, overlay hiện lên */
.actions-overlay {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  pointer-events: none;
}

.ms-table tbody tr:hover .actions-overlay {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

/* Button action */
.btn-action {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.btn-action::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  border: 1px solid #d0d5dd;
  border-radius: 50%;
  z-index: 0;
}

.btn-action .icon {
  width: 16px;
  height: 16px;
  position: relative;
  z-index: 1;
}

/* No Data */
.wrap-no-data-grid-main-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  /* Thêm min-height để đẹp hơn */
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

/* Pagination và Popup giữ nguyên như cũ */
.ms-table-pagination {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-top: 1px solid #d3d7de;
  background: var(--background-white);
  flex-shrink: 0;
  /* Không bị co */
}

/* ... (Rest of pagination styles) ... */
.pagination-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pagination-records {
  font-size: var(--font-size-primary);
  color: #586074;
}

.pagination-records .pagination-records-total {
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
}

.pagination-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-size-select {
  min-height: 32px;
  padding-left: 16px;
  padding-right: 8px;
  background: var(--background-white);
  cursor: pointer;
  font-size: var(--font-size-primary);
  font-weight: 400;
  color: var(--text-color);
  min-width: 182px;
  appearance: none;
  -webkit-appearance: none;
}

.page-size-select:focus {
  outline: none;
}

.pagination-info {
  font-size: var(--font-size-primary);
  color: var(--text-color);
  padding: 4px;
}

.pagination-info strong {
  color: var(--text-color);
  font-weight: var(--font-weight-bold);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.pagination-btn .icon {
  width: 16px;
  height: 16px;
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  background-color: var(--background-white);
}

.sort-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: transparent;
}

.sort-popup {
  position: fixed;
  width: 200px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  overflow: hidden;
}

.sort-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 32px;
  cursor: pointer;
  font-size: var(--font-size-primary);
  color: var(--text-color);
  transition: background-color 0.2s;
}

.sort-option:hover {
  background-color: #f5f5f5;
}

.sort-option .icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* .sort-option.sort-clear {
  border-top: 1px solid var(--border-color);
} */
</style>