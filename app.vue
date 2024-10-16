<script setup lang="ts">
useSeoMeta({
  title: "Simple QRCode Generator",
  description: "Simple, bullshit-free QR code generator.",
});
</script>

<template>
  <div role="main" class="flex h-[100vh] items-center justify-center">
    <NuxtRouteAnnouncer />

    <div
      class="p-5 w-full max-w-[850px] flex flex-col justify-center space-y-4"
    >
      <AppHeader />
      <AppBody />
    </div>
  </div>
</template>
