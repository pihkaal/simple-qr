<script setup lang="ts">
import { renderQRCodeToCanvas } from "@/utils/renderer";
import { IMAGE_FORMATS, LOGOS } from "@/utils/settings";

const format = ref(IMAGE_FORMATS[0]);
const logo = ref(LOGOS[0]);
const content = ref("");

const canvas = ref(null);
const qrCode = ref("");

const copyIcon = ref("i-heroicons-clipboard-document");
const copyLabel = ref("Copy to clipboard");
const isQRCodeEmpty = computed(() => qrCode.value.length === 0);

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

const copyQRCode = async () => {
  if (content.value.length === 0) return;

  const logoUrl = `/${logo.value}.png`;
  await renderQRCodeToCanvas(canvas.value, content.value, logoUrl);

  const qrCode = canvas.value.toDataURL(`image/png`);

  const blob = await (await fetch(qrCode)).blob();
  const item = new ClipboardItem({ "image/png": blob });
  await navigator.clipboard.write([item]);

  copyIcon.value = "i-heroicons-clipboard-document-check";
  copyLabel.value = "Copied!";
  setTimeout(() => {
    copyIcon.value = "i-heroicons-clipboard-document";
    copyLabel.value = "Copy to clipboard";
  }, 3000);
};
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

    <USelectMenu
      v-model="format"
      :options="IMAGE_FORMATS"
      @change="updateQRCode"
    />
    <USelectMenu v-model="logo" :options="LOGOS" @change="updateQRCode" />
    <UInput v-model="content" @input="updateQRCode" />

    <canvas ref="canvas" class="hidden" />
    <img :src="qrCode" />

    <UButton
      block
      icon="i-heroicons-arrow-down-tray"
      size="sm"
      color="primary"
      variant="solid"
      label="Download"
      :trailing="false"
      :disabled="isQRCodeEmpty"
      @click="downloadQRCode"
    />
    <UButton
      block
      :icon="copyIcon"
      size="sm"
      color="primary"
      variant="solid"
      :label="copyLabel"
      :trailing="false"
      :disabled="isQRCodeEmpty"
      @click="copyQRCode"
    />
  </div>
</template>
