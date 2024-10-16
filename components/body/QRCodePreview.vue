<script setup lang="ts">
const app = useAppStore();
</script>

<template>
  <img
    :src="app.qrCode"
    class="max-h-[375px] aspect-square border border-gray-100 dark:border-gray-800"
  />
</template>
