<template>
  <div
    v-if="showModal"
    class="modal-overlay"
    :class="[ { active: showModal } ]"
    @click.self="closeModal"
  >
    <div :class="['modal-content', transparent ? 'modal-content--transparent' : '']">
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSlots } from "vue";

const props = defineProps({
  transparent: {
    type: Boolean,
    default: false,
  },
});

const showModal = defineModel({
  type: Boolean,
  default: false,
});

/**
 * Đóng modal
 * Author: NTT (21/11/2025)
 */
const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
.modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(68, 68, 68, 0.2);
  z-index: 1000;
  align-items: center;
  justify-content: center;
}



.modal-overlay.active {
  display: flex;
}


.modal-content {
  background-color: var(--white-color);
  border-radius: 8px;
  width: 90%;
  max-width: 460px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
}
.modal-content--transparent {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.modal-body {
  padding: 20px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  font-size: 13px;
  color: var(--text-color);
}
</style>
