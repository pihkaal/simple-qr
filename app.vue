<script setup lang="ts">
// TODO: disable buttons when no qr code is generated (it is currenly possible to download default qr code)

import { renderQRCodeToCanvas } from "@/utils/renderer";
import { IMAGE_FORMATS, LOGOS } from "@/utils/settings";

const canvas = ref(null);
const form = ref(null);
const qrCode = ref(undefined);

const copyIcon = ref("i-heroicons-clipboard-document");
const copyLabel = ref("Copy");
const isQRCodeEmpty = computed(() => !qrCode.value);
const qrCodeSrc = computed(() => qrCode.value ?? "/default.webp");

const state = reactive({
  logo: undefined,
  format: IMAGE_FORMATS[0],
  content: undefined,
});

const isValidState = computed(
  () => state.content && state.logo && state.format,
);

const BASE_API_URL = "http://localhost:3000/api";

const apiUrl = computed(() => {
  if (!isValidState.value) return "";

  const params = new URLSearchParams({
    logo: state.logo,
    format: state.format,
    content: state.content,
  });

  return `${BASE_API_URL}?${params}`;
});

const updateQRCode = async () => {
  await nextTick();

  if (!isValidState.value) return;

  const logoUrl = `/${state.logo}.png`;
  await renderQRCodeToCanvas(canvas.value, state.content, logoUrl);

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
  if (isQRCodeEmpty.value) return;

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

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const upperCase = (str: string) => str.toUpperCase();
</script>

<template>
  <div role="main" class="flex h-[100vh] items-center justify-center">
    <NuxtRouteAnnouncer />
    <canvas ref="canvas" class="hidden" />

    <div
      class="w-full h-full max-w-[850px] max-h-[375px] flex justify-between space-x-10"
    >
      <img :src="qrCodeSrc" class="h-full aspect-square" />

      <div class="flex-1 flex flex-col justify-center">
        <UForm ref="form" :state="state" class="space-y-4">
          <UFormGroup
            label="Username or link"
            name="content"
            @input="updateQRCode"
          >
            <UInput
              v-model="state.content"
              placeholder="Your username or profile link"
            />
          </UFormGroup>

          <UFormGroup label="Logo" name="logo">
            <USelectMenu
              v-model="state.logo"
              :options="LOGOS"
              placeholder="Select logo"
              searchable
              @change="updateQRCode"
            >
              <template #label>
                <span v-if="state.logo">{{ capitalize(state.logo) }}</span>
              </template>

              <template #option="props">
                <span>{{ capitalize(props.option) }}</span>
              </template>
            </USelectMenu>
          </UFormGroup>

          <UFormGroup label="Format" name="format">
            <USelectMenu
              v-model="state.format"
              :options="IMAGE_FORMATS"
              placeholder="Select format"
              @change="updateQRCode"
            >
              <template #label>
                <span v-if="state.format">{{ upperCase(state.format) }}</span>
              </template>

              <template #option="props">
                <span>{{ upperCase(props.option) }}</span>
              </template>
            </USelectMenu>
          </UFormGroup>

          <UFormGroup label="API">
            <UButtonGroup size="sm" orientation="horizontal" class="w-full">
              <UInput
                v-model="apiUrl"
                disabled
                placeholder="Please fill all fields first"
                class="w-full"
              />
              <UButton
                :disabled="isQRCodeEmpty"
                icon="i-heroicons-clipboard-document"
              />
            </UButtonGroup>
          </UFormGroup>

          <div class="flex space-x-4 pt-2">
            <UButton
              class="flex-1"
              block
              :icon="copyIcon"
              size="md"
              color="primary"
              variant="solid"
              :label="copyLabel"
              :trailing="false"
              :disabled="isQRCodeEmpty"
              @click="copyQRCode"
            />

            <UButton
              class="flex-1"
              block
              icon="i-heroicons-arrow-down-tray"
              size="md"
              color="primary"
              variant="solid"
              label="Download"
              :trailing="false"
              :disabled="isQRCodeEmpty"
              @click="downloadQRCode"
            />
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>
