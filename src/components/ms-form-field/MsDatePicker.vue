<template>
  <div class="date-group">
    <label v-if="label" class="date-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="date-wrapper">
      <div class="date-picker-wrapper">
        <VueDatePicker
          ref="datePickerRef"
          v-model="dateValue"
          :placeholder="placeholder"
          :formats="formats"
          :time-config="timeConfig"
          :min-date="minDate"
          :max-date="maxDate"
          :locale="locale"
          auto-apply
          :class="['date-field', { error: hasError }]"
          @update:model-value="handleDateChange"
        >
          <template #clear-icon>
            <span style="display: none;"></span>
          </template>
        </VueDatePicker>
      </div>
      <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
/**
 * MsDatePicker Component
 * 
 * Component date picker dựa trên @vuepic/vue-datepicker
 * CÁC TRƯỜNG/PROPS ĐÃ SỬ DỤNG:
 * 
 * 1. v-model (defineModel):
 *    - Tự động xử lý two-way binding
 *    - Nhận giá trị: String (YYYY-MM-DD), Date object, hoặc null
 *    - Trả về giá trị: String format YYYY-MM-DD
 * 
 * 2. label (String):
 *    - Nhãn hiển thị phía trên date picker
 *    - Optional, mặc định: ''
 * 
 * 3. required (Boolean):
 *    - Đánh dấu trường bắt buộc
 *    - Hiển thị dấu * màu đỏ bên cạnh label
 *    - Mặc định: false
 * 
 * 4. errorMessage (String):
 *    - Thông báo lỗi validation
 *    - Hiển thị màu đỏ phía dưới input
 *    - Mặc định: ''
 * 
 * 5. placeholder (String):
 *    - Placeholder text trong input
 *    - Mặc định: 'dd/MM/yyyy'
 * 
 * 6. formats (Object):
 *    - FormatsConfig object để định dạng các phần tử của date picker
 *    - Hỗ trợ: month, year, weekDay, quarter, day, input, preview
 *    - Mặc định: { input: 'dd/MM/yyyy' }
 * 
 * 7. locale (Object):
 *    - Locale object từ date-fns cho date picker (vi, en, etc.)
 *    - Ảnh hưởng đến format ngày và tên tháng/năm trong calendar
 *    - Mặc định: vi (tiếng Việt) từ date-fns/locale
 * 
 * 8. timeConfig (Object):
 *    - Config object cho time picker (TimeConfig interface)
 *    - Hỗ trợ: enableTimePicker, ignoreTimeValidation, enableSeconds, 
 *      enableMinutes, is24, noHoursOverlay, noMinutesOverlay, 
 *      noSecondsOverlay, hoursGridIncrement, minutesGridIncrement,
 *      secondsGridIncrement, timePickerInline, startTime
 *    - Mặc định: { enableTimePicker: false, ... }
 * 
 * 9. minDate (Date | String | Number):
 *     - Ngày tối thiểu có thể chọn
 *     - Không thể chọn ngày trước minDate
 *     - Mặc định: null (không giới hạn)
 * 
 * 10. maxDate (Date | String | Number):
 *     - Ngày tối đa có thể chọn
 *     - Không thể chọn ngày sau maxDate
 *     - Mặc định: null (không giới hạn)
 * 
 * 
 * 11. clearable (Boolean):
 *     - Cho phép xóa giá trị (hiện nút X)
 *     - Mặc định: true
 * 
 * 12. auto-apply (Boolean - prop của VueDatePicker):
 *     - Tự động áp dụng khi chọn ngày (đóng calendar ngay)
 *     - Mặc định: true trong component này
 */

import { computed, ref, watch } from 'vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import { vi } from 'date-fns/locale';
import '@vuepic/vue-datepicker/dist/main.css';


const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'dd/MM/yyyy',
  },
  formats: {
    type: Object,
    default: () => ({
      input: 'dd/MM/yyyy',
    }),
  },
  timeConfig: {
    type: Object,
    default: () => ({
      enableTimePicker: false,
      ignoreTimeValidation: false,
      enableSeconds: false,
      enableMinutes: false,
      is24: false,
      noHoursOverlay: false,
      noMinutesOverlay: false,
    }),
  },
  minDate: {
    type: [Date, String, Number],
    default: null,
  },
  maxDate: {
    type: [Date, String, Number],
    default: null,
  },
  locale: {
    type: Object,
    default: () => vi,
  },
});

const modelValue = defineModel({
  type: [String, Date, Number],
  default: null,
});

const dateValue = ref(null);

/**
 * Chuyển đổi giá trị từ modelValue sang Date object
 * @param value -  Giá trị từ modelValue (có thể là String, Date, hoặc Number)
 * @returns {Date|null} - Date object hoặc null
 * Author: NTT (18/11/2025)
 */
const convertToDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
};

/**
 * Convert Date object -> String format YYYY-MM-DD
 * Để lưu vào modelValue (chuẩn HTML date input)
 * @param {Date} date - Ngày cần chuyển đổi
 * @return {String|null} - Chuỗi ngày ở định dạng YYYY-MM-DD hoặc null nếu không hợp lệ
 * Author: NTT (18/11/2025)
 */
const convertToString = (date) => {
  if (!date) return null;
  if (typeof date === 'string') return date;
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return null;
};


/**
 * Watch modelValue từ parent -> Convert sang Date -> Gán vào dateValue
 * Khi parent thay đổi giá trị (ví dụ: reset form)
 * Author: NTT (18/11/2025)
 */
watch(
  () => modelValue.value,
  (newVal) => {
    const convertedDate = convertToDate(newVal);
    if (convertedDate?.getTime() !== dateValue.value?.getTime()) {
      dateValue.value = convertedDate;
    }
  },
  { immediate: true }
);

/**
 * Handle khi user chọn ngày từ VueDatePicker
 * Convert Date -> String YYYY-MM-DD -> Gán vào modelValue
 * * @param {Date} date - Ngày được chọn từ VueDatePicker
 * Author: NTT (18/11/2025)
 */
const handleDateChange = (date) => {
  dateValue.value = date;
  const stringValue = convertToString(date);
  modelValue.value = stringValue;
};


const hasError = computed(() => !!props.errorMessage);

</script>

<style>
.date-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  overflow: visible;
}

.date-label {
  font-size: var(--font-size-primary);
  font-weight: var(--font-weight-medium);
  color: var(--text-color);
  min-width: 160px;
  max-width: 160px;
  margin-right: 16px;
}

.required {
  color: #ec4243;
}

.date-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.date-picker-wrapper {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  width: 100%;
  transition: border-color 0.3s;
}
.date-picker-wrapper:focus-within {
  border-color: var(--primary-color);
}

.date-field {
  width: 100%;
}

.error-message {
  color: var(--error-color);
  font-size: 12px;
  padding: 8px 0 0;
  display: block;
}

/* Global styles for VueDatePicker to override default styles */
.date-picker-wrapper .dp__input_wrap {
  border-radius: var(--border-radius);
  transition: border-color 0.3s;
  box-sizing: border-box;
  height: var(--input-height);
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}

.date-picker-wrapper .dp__input {
  flex: 1;
  padding: 0 12px;
  padding-right: 0;
  padding-inline-end: 0;
  border: none;
  border-radius: var(--border-radius);
  font-size: var(--font-size-primary);
  line-height: 1.5;
  background-color: #fff;
  box-sizing: border-box;
  height: 100%;
  text-align: left;
  color: var(--text-color);
}

.date-picker-wrapper .dp__input::placeholder {
  color: #9e9e9e;
}

.date-picker-wrapper .dp__input:hover,
.date-picker-wrapper .dp__input:focus {
  outline: none;
}


.date-picker-wrapper .dp__input_wrap::after {
  display: block;
  content: '';
  position: absolute;
  right: 36px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 100%;
  background-color: var(--border-color);
}

.date-picker-wrapper .dp__input_icon,
.date-picker-wrapper button.dp__input_icon {
  position: absolute;
  left: auto;
  right: 10px;
  height: 100%;
  width: 16px;
  cursor: pointer;
  padding: 0;
  color: var(--icon-color);
}
/* .dp__instance_calendar{

} */
.dp__month_year_wrap{
  font-size: 16px;
  font-weight: 700;
}
.dp__calendar_header_item{
  font-weight: 600;
  font-size: 13px;
  padding: 1px 0 6px;
  text-align: center;
  text-transform: uppercase;
  height: auto;
}
.dp__cell_inner {
  font-size: 13px !important;
  font-weight: 500;
}
</style>
