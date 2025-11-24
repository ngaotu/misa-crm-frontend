<template>
  <div class="select-group">
    <label v-if="label" class="select-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <div class="select-wrapper">
      <Select
        v-model="modelValue"
        :options="options"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="['select-field', { 'p-invalid': hasError, error: hasError }]"
        optionLabel="label"
        optionValue="value"
      >
        <template #dropdownicon>
          <span :class="['icon', customDropdownIcon || 'icon-dropdown']"></span>
        </template>
      </Select>
      <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Select from "primevue/select";

const modelValue = defineModel({
  type: [String, Number, Object, Array],
  default: null,
});

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Chọn giá trị",
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
  customDropdownIcon: {
    type: String,
    default: "",
  },
});

const hasError = computed(() => !!props.errorMessage);
</script>

<style>
.select-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.select-label {
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

.select-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* PrimeVue Select */
.select-group .p-select {
  width: 100%;
  height: var(--input-height);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  line-height: 1.5;
  transition: border-color 0.3s;
  font-family: inherit;
  background-color: white;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-group .p-select:not(.p-disabled).p-focus {
  border-color: var(--primary-color);
  outline: none;
}

.select-group .p-select .p-select-label {
  padding: 0 40px 0 12px;
  font-size: var(--font-size-primary);
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  line-height: 1.5;
  color: var(--text-color);
}

.select-group .p-select .p-placeholder {
  color: #9e9e9e;
}

.select-group .p-select:not(.p-disabled).p-focus .p-select-dropdown .icon-dropdown {
  background-color: var(--primary-color);
}

.select-group .p-select.p-disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.select-group .p-select.p-disabled .p-select-label {
  cursor: not-allowed;
}

.select-group .p-select.p-invalid,
.select-group .p-select.error {
  border-color: var(--error-color);
}

.select-group .p-select.p-invalid:not(.p-disabled):hover,
.select-group .p-select.error:not(.p-disabled):hover {
  border-color: var(--error-color);
}

.error-message {
  color: var(--error-color);
  font-size: 12px;
  padding: 8px 0 0;
  display: block;
}

.p-select-overlay {
  border: 1px solid var(--border-color) !important;
  border-radius: var(--border-radius) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  background-color: #fff !important;
  margin-top: 4px !important;
}
.p-select-option-label {
  font-size: var(--font-size-primary);
  color: var(--text-color);
}
.p-select-option.p-select-option-selected {
  background-color: #e1eeff !important;
  color: var(--text-color) !important;
}
.p-select:not(.p-disabled):hover {
    border-color: var(--border-color) !important;
}
</style>
