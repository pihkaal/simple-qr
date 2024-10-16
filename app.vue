<script setup lang="ts">
const TITLE = "Simple QRCode Generator";
const DESCRIPTION =
  "Simple, bullshit-free QR code generator with straightforward API.";
const IMAGE = "/thumbnail.png";

useSeoMeta({
  title: TITLE,
  description: DESCRIPTION,
  ogType: "website",
  ogTitle: TITLE,
  ogDescription: DESCRIPTION,
  ogImage: IMAGE,
  themeColor: "#4ade80",
  twitterCard: "summary",
  twitterTitle: TITLE,
  twitterDescription: DESCRIPTION,
  twitterImage: IMAGE,
});
</script>

<template>
  <div role="main" class="flex min-h-[100vh] items-center justify-center">
    <NuxtRouteAnnouncer />

    <div
      class="p-5 w-full max-w-[430px] sm:max-w-[850px] flex flex-col justify-center space-y-4"
    >
      <AppHeader />
      <AppBody />
    </div>
  </div>
</template>
