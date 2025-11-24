<template>
    <div class="container">
        <TheHeader />
        <div class="flex flex-col flex-1 overflow-hidden">
            <RouterView />
        </div>
    </div>

</template>
<script setup>
import TheHeader from "@/layouts/TheHeader.vue";
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
</style>