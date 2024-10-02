<script setup lang="ts">
import { renderQRCodeToCanvas } from "@/utils/renderer";
import {
  IMAGE_FORMATS,
  LOGOS,
  settingsSchema,
  type Settings,
} from "@/utils/settings";

import type { FormSubmitEvent } from "#ui/types";

const canvas = ref(null);
const qrCode = ref("/default.webp");

const copyIcon = ref("i-heroicons-clipboard-document");
const copyLabel = ref("Copy");
const isQRCodeEmpty = computed(() => qrCode.value.length === 0);

const state = reactive({
  logo: LOGOS[0],
  format: IMAGE_FORMATS[0],
  content: undefined,
});

const updateQRCode = async () => {
  if (!state.content) return;

  const logoUrl = `/${state.logo}.png`;
  await renderQRCodeToCanvas(canvas.value, state.content, logoUrl);

  console.log(state.format);

  qrCode.value = canvas.value.toDataURL(`image/${state.format}`);
};

const downloadQRCode = () => {
  const link = document.createElement("a");
  link.href = qrCode.value;
  link.download = `qrcode.${state.format}`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const copyQRCode = async () => {
  if (state.content.length === 0) return;

  const logoUrl = `/${state.logo}.png`;
  await renderQRCodeToCanvas(canvas.value, state.content, logoUrl);

  const qrCode = canvas.value.toDataURL(`image/png`);

  const blob = await (await fetch(qrCode)).blob();
  const item = new ClipboardItem({ "image/png": blob });
  await navigator.clipboard.write([item]);

  copyIcon.value = "i-heroicons-clipboard-document-check";
  copyLabel.value = "Copied!";
  setTimeout(() => {
    copyIcon.value = "i-heroicons-clipboard-document";
    copyLabel.value = "Copy";
  }, 3000);
};
</script>

<template>
  <div role="main" class="flex h-[100vh] items-center justify-center">
    <NuxtRouteAnnouncer />
    <canvas ref="canvas" class="hidden" />

    <div class="w-full h-full max-w-[850px] max-h-[375px] flex justify-between gap-8">
      <img :src="qrCode" class="h-full aspect-square" />

      <div class="flex-1 flex flex-col justify-center">
        <UForm :schema="settingsSchema" :state="state" class="space-y-4">
          <UFormGroup label="Username or link" name="content" @input="updateQRCode">
            <UInput v-model="state.content" />
          </UFormGroup>

          <UFormGroup label="Logo" name="logo">
            <USelectMenu v-model="state.logo" :options="LOGOS" searchable @change="updateQRCode" />
          </UFormGroup>

          <UFormGroup label="Format" name="format">
            <USelectMenu v-model="state.format" :options="IMAGE_FORMATS" @change="updateQRCode" />
          </UFormGroup>

          <UButton block :icon="copyIcon" size="md" color="primary" variant="solid" :label="copyLabel" :trailing="false"
            :disabled="isQRCodeEmpty" @click="copyQRCode" />

          <UButton block icon="i-heroicons-arrow-down-tray" size="md" color="primary" variant="solid" label="Download"
            :trailing="false" :disabled="isQRCodeEmpty" @click="downloadQRCode" />
        </UForm>
      </div>
    </div>
  </div>
</template>
