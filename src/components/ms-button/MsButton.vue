<template>
  <button :class="[
    'ms-btn',
    `ms-btn-${variant}`,
    `ms-btn-${size}`,
    iconOnly && 'ms-btn-icon-only',
    loading && 'ms-btn-loading',
  ]" :type="nativeType" :disabled="disabled || loading" @click="handleClick">
    <!-- Loading Spinner -->
    <span v-if="loading" class="ms-btn-spinner"></span>

    <!-- Left Icon Slot -->
    <slot v-if="!loading" name="icon-left"></slot>

    <!-- Default Slot for Text -->
    <slot v-if="!iconOnly"></slot>

    <!-- Right Icon Slot -->
    <slot v-if="!loading" name="icon-right"></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click']);

const props = defineProps({
  // Button variant/type
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'outline',
      'text',
      'filter'
    ].includes(value)
  },

  // Button size
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },

  // Icon only (no text)
  iconOnly: {
    type: Boolean,
    default: false
  },

  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false
  },

  // HTML button type
  nativeType: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
});

/**
 *  Phat sinh sự kiện click cho button
 * Author: NTT (21/11/2025)
 */
const handleClick = (event) => {
  if (props.disabled || props.loading) return;
  emit('click', event);
};
</script>

<style scoped>
/* ===== BASE BUTTON ===== */
.ms-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-weight: 600;
  font-size: var(--font-size-primary, 13px);
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
  outline: none;
}

.ms-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* ===== SIZES ===== */
.ms-btn-small {
  height: 28px;
  padding: 0 12px;
  font-size: 13px;
}

.ms-btn-medium {
  height: 32px;
  padding: 5px 8px;
}

.ms-btn-large {
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
}

/* Icon Only Button */
.ms-btn-icon-only.ms-btn-small {
  width: 28px;
  padding: 0;
}

.ms-btn-icon-only.ms-btn-medium {
  width: 32px;
  padding: 0;
}

.ms-btn-icon-only.ms-btn-large {
  width: 40px;
  padding: 0;
}

/* ===== VARIANTS ===== */

/* Primary */
.ms-btn-primary {
  background: var(--primary-color);
  color: var(--white-color);
  border-color: var(--primary-color);
}

/* .ms-btn-primary:hover:not(:disabled):not(.ms-btn-loading) {
  background: var(--btn-primary-hover);
  border-color: var(--btn-primary-hover);
} */

.ms-btn-primary:active:not(:disabled):not(.ms-btn-loading) {
  background: #1E40AF;
  border-color: #1E40AF;
}

/* Secondary */
.ms-btn-secondary {
  background: var(--white-color);
  color: var(--text-color);
  border-color: var(--border-secondary);
}

/* .ms-btn-secondary:hover:not(:disabled):not(.ms-btn-loading) {
  border-color: var(--primary-color);
  color: var(--primary-color);
} */

/* Success */
.ms-btn-success {
  background: var(--toast-success);
  color: var(--white-color);
  border-color: var(--toast-success);
}

/* .ms-btn-success:hover:not(:disabled):not(.ms-btn-loading) {
  background: #059669;
  border-color: #059669;
} */

/* Danger */
.ms-btn-danger {
  background: var(--toast-error);
  color: var(--white-color);
  border-color: var(--toast-error);
}

/* .ms-btn-danger:hover:not(:disabled):not(.ms-btn-loading) {
  background: #DC2626;
  border-color: #DC2626;
} */

/* Warning */
.ms-btn-warning {
  background: var(--toast-warning);
  color: var(--white-color);
  border-color: var(--toast-warning);
}

/* .ms-btn-warning:hover:not(:disabled):not(.ms-btn-loading) {
  background: #D97706;
  border-color: #D97706;
} */

/* Info */
.ms-btn-info {
  background: var(--toast-info);
  color: var(--white-color);
  border-color: var(--toast-info);
}

/* .ms-btn-info:hover:not(:disabled):not(.ms-btn-loading) {
  background: #2563EB;
  border-color: #2563EB;
} */

/* Outline */
.ms-btn-outline {
  background: var(--white-color);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

/* Icon trong outline button có màu primary */
.ms-btn-outline :deep(.icon) {
  background-color: var(--primary-color);
}

/* .ms-btn-outline:hover:not(:disabled):not(.ms-btn-loading) {
  background: var(--primary-color);
  color: var(--white-color);
} */

/* Text */
.ms-btn-text {
  background: transparent;
  color: var(--primary-color);
  border-color: transparent;
  padding: 0 8px;
  font-weight: 500;
}

/* .ms-btn-text:hover:not(:disabled):not(.ms-btn-loading) {
  background: rgba(37, 99, 235, 0.08);
} */

/* Filter Button (for toolbar) */
.ms-btn-filter {
  background: var(--white-color);
  color: var(--icon-color);
  border-color: var(--border-secondary);
}

/* .ms-btn-filter:hover:not(:disabled):not(.ms-btn-loading) {
  border-color: var(--primary-color);
  color: var(--primary-color);
} */

/* ===== STATES ===== */

/* Disabled */
.ms-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Loading */
.ms-btn-loading {
  cursor: wait;
  opacity: 0.8;
}

/* Loading Spinner */
.ms-btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ms-btn-spin 0.6s linear infinite;
}

@keyframes ms-btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
