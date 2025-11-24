<template>
  <div class="input-group">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="input-wrapper">
      <input
        ref="inputRef"
        :type="type"
        v-model="modelValue"
        :placeholder="placeholder"
        :rules="required"
        :class="['input-field', { error: hasError }]"
        :autofocus="autofocus"
        :disabled="disabled"
        @blur="$emit('blur', $event)"
      />
      <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useTemplateRef } from "vue";
const emit = defineEmits(['blur']);
const modelValue = defineModel({
  type: [String, Number],
  default: "",
});
const inputRef = useTemplateRef('inputRef');

defineExpose({
  focus: () => {
    inputRef.value?.focus();
  },
});

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "text",
    validator: (value) =>
      [
        "text",
        "email",
        "tel",
        "password",
        "date",
        "time",
        "number",
        "search",
        "url",
        "color",
        "file",
        "hidden",
        "image",
        "range",
      ].includes(value),
  },
  errorMessage: {
    type: String,
    default: "",
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const hasError = computed(() => !!props.errorMessage);
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.input-label {
  font-size: var(--font-size-primary);
  font-weight: var(--font-weight-medium);
  color: var(--text-color);
  min-width: 160px;
  max-width: 160px;
  margin-right: 16px;
}

.required {
  color: var(--error-color);
}

.input-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-field {
  padding: 0 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-primary);
  line-height: 1.5;
  transition: border-color 0.3s;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  height: var(--input-height);
  color: var(--text-color);
  background-color: #fff;
}

.input-field::placeholder {
  color: #9e9e9e;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
}

.input-field:disabled {
  /* background-color: #f9fafb; */
  cursor: not-allowed;
  /* color: #9e9e9e; */
}

.input-field.error {
  border-color: var(--error-color);
}

.error-message {
  color: var(--error-color);
  font-size: 12px;
  padding: 8px 0 0;
  display: block;
}
</style>
