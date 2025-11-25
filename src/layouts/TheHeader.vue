<template>
  <header class="header flex flex-row items-center justify-between">
    <div class="header-left h-full flex flex-row items-center">
      <div class="header-brand flex flex-row items-center mr-6">
        <div class="icon-logo"></div>
        <span class="brand-name">CRM</span>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu h-full flex flex-row items-center gap-16 flex-1">
        <router-link to="/workspaces" class="nav-item" :exact="false">
          <div class="icon icon-dashboard"></div>
          <span>Bàn làm việc</span>
        </router-link>
        <router-link 
          to="/customers" 
          class="nav-item" 
          :class="{ 'router-link-active': $route.path.startsWith('/customers') }"
        >
          <div class="icon icon-account"></div>
          <span>Khách hàng</span>
        </router-link>
        <router-link to="/opportunities" class="nav-item" :exact="false">
              <div class="icon icon-opportunity"></div>
          <span>Cơ hội</span>
        </router-link>
        <router-link to="/quotes" class="nav-item" :exact="false">
          <div class="icon icon-quote"></div>
          <span>Báo giá</span>
        </router-link>
        <router-link to="/orders" class="nav-item" :exact="false">
          <div class="icon icon-sale-order"></div>
          <span>Đơn hàng</span>
        </router-link>
        <router-link to="/products" class="nav-item" :exact="false">
          <div class="icon icon-product"></div>
          <span>Hàng hóa</span>
        </router-link>
        <router-link to="/reports" class="nav-item" :exact="false">
          <div class="icon icon-report"></div>
          <span>Báo cáo</span>
        </router-link>
        <router-link to="/all" class="nav-item">
          <div class="icon icon-all"></div>
          <span>Tất cả</span>
        </router-link>
      </nav>
    </div>
    <!-- Right Actions -->
    <div class="header-right flex flex-row items-center">
      <img src="../assets/images/OIP.webp" alt="Avatar" class="avatar" />
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";

</script>

<style scoped>
.header {
  height: var(--header-height);
  background-color: var(--white-color);
  /* border-bottom: 1px solid #e5e7eb; */
  padding: 0px 16px 0px 48px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}


.header-brand {
  gap: 12px;
}

.brand-name {
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
}

/* Navigation */


.nav-item {
  line-height: 32px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0px;
  font-size: var(--font-size-primary);
  font-weight: 400;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
}

.nav-item:hover {
 cursor: pointer;
}

.nav-item.router-link-active {
  color: var(--primary-color);
  /* background: #EFF6FF; */
}
.nav-item.router-link-active .icon {
  background-color: var(--primary-color);
}

.nav-item.router-link-active::after {
  content: '';
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  border-radius: 2px 2px 0 0;
}

/* Avatar */
.header-right .avatar {
  width: var(--logo-height);
  height: var(--logo-height);
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #E5E7EB;
  cursor: pointer;
  transition: border-color 0.2s;
}


</style>
