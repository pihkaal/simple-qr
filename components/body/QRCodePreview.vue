<script setup lang="ts">
const app = useAppStore();
</script>

<template>
  <img
    :src="app.qrCode"
    class="w-full max-w-[375px] max-h-[375px] sm:max-w-[315px] sm:max-h-[315px] md:max-w-[375px] md:max-h-[375px] m-auto aspect-square border border-gray-100 dark:border-gray-800"
  />
</template>
