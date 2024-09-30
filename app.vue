<script setup lang="ts">
import { renderQRCodeToCanvas } from "@/utils/renderer";
import { IMAGE_FORMATS, LOGOS } from "@/utils/settings";

const format = ref(IMAGE_FORMATS[0]);
const logo = ref(LOGOS[0]);
const content = ref("");

const canvas = ref(null);
const qrCode = ref("");

const updateQRCode = async () => {
  await nextTick();

  if (content.value.length === 0) return;

  const logoUrl = `/${logo.value}.png`;
  await renderQRCodeToCanvas(canvas.value, content.value, logoUrl);

  qrCode.value = canvas.value.toDataURL(`image/${format.value}`);
};
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

    <USelectMenu
      v-model="format"
      :options="IMAGE_FORMATS"
      @input="updateQRCode"
    />
    <USelectMenu v-model="logo" :options="LOGOS" @input="updateQRCode" />
    <UInput v-model="content" @input="updateQRCode" />

    <canvas ref="canvas" class="hidden" />
    <img :src="qrCode" />
  </div>
</template>
