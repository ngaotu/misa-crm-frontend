<template>
<div class="notfound-container">
  <div class="notfound-content">
    <div class="notfound-404">404</div>
    <h2 class="notfound-title">Không tìm thấy trang</h2>
    <p class="notfound-desc">Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
    <MsButton class="notfound-back" variant="primary" :noHover="true" @click="goHome">Quay lại</MsButton>
  </div>
</div>
</template>

<script setup>
</script>
<script setup>
import { useRouter } from 'vue-router';
import MsButton from '@/components/ms-button/MsButton.vue';
const router = useRouter();

/**
 * Quay lại trang danh sách khách hàng
 * Author: NTT (21/11/2025)
 */
const goHome = () => {
  router.push('/customers');
};
</script>

<style scoped>


.notfound-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white-color, #fff);
}
.notfound-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(66,98,240,0.08);
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 400px;
}
.notfound-404 {
  font-size: 120px;
  font-weight: 900;
  color: var(--primary-color, #4262F0);
  margin-bottom: 16px;
  letter-spacing: 2px;
}
.notfound-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color, #4262F0);
  margin-bottom: 12px;
}
.notfound-desc {
  font-size: 16px;
  color: #586074;
  margin-bottom: 18px;
  text-align: center;
}
.notfound-back {
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
.notfound-back.no-hover {
  background: var(--primary-color, #4262F0);
  color: #fff;
  box-shadow: none;
  border: none;
}


</style>
