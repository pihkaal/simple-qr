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

const downloadQRCode = () => {
  const link = document.createElement("a");
  link.href = qrCode.value;
  link.download = "qrcode.png";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

    <UButton
      icon="i-heroicons-arrow-down-tray"
      size="sm"
      color="primary"
      variant="solid"
      label="Download"
      :trailing="false"
      @click="downloadQRCode"
    />
    <UButton
      icon="i-heroicons-clipboard-document"
      size="sm"
      color="primary"
      variant="solid"
      label="Copy to clipboard"
      :trailing="false"
    />
  </div>
</template>
