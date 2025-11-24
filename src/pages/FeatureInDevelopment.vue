<template>
  <div class="feature-dev-container">
    <div class="feature-dev-content">
      <span class="feature-dev-icon icon-logo"></span>
      <h2 class="feature-dev-title">Tính năng đang trong quá trình phát triển</h2>
      <p class="feature-dev-desc">Chức năng này sẽ sớm được cập nhật. Vui lòng quay lại sau!</p>
      <MsButton class="feature-dev-back" variant="primary" :noHover="true" @click="goBack">Quay lại</MsButton>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import MsButton from '@/components/ms-button/MsButton.vue';
const router = useRouter();

/**
 * Quay lại trang danh sách khách hàng
 * Author: NTT (21/11/2025)
 */
const goBack = () => {
  router.push('/customers');
};
</script>

<style scoped>
.feature-dev-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white-color);
}
.feature-dev-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(66,98,240,0.08);
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 400px;
}
.feature-dev-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--primary-color, #4262F0);
}
.feature-dev-icon.icon-logo {
    scale: 1.5;
}
.feature-dev-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color, #4262F0);
  margin-bottom: 12px;
}
.feature-dev-desc {
  font-size: 16px;
  color: #586074;
  margin-bottom: 12px;
  text-align: center;
}
.feature-dev-back {
  min-width: 120px;
  font-size: 13px;
  font-weight: 600;
  background: var(--primary-color, #4262F0);
  color: #fff;
  border-radius: 6px;
  box-shadow: none;
  border: none;
  padding: 12px 0;
}
.feature-dev-back.no-hover {
  background: var(--primary-color, #4262F0);
  color: #fff;
  box-shadow: none;
  border: none;
}
</style>
