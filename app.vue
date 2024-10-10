<script setup lang="ts">
import { renderQRCodeToCanvas } from "@/utils/renderer";
import { IMAGE_FORMATS, LOGOS } from "@/utils/settings";

const canvas = ref(null);
const form = ref(null);
const qrCode = ref(undefined);

const copyUrlIcon = ref("i-heroicons-clipboard-document");
const copyImageIcon = ref("i-heroicons-clipboard-document");
const copyImageLabel = ref("Copy");

const isQRCodeEmpty = computed(() => !qrCode.value);
const qrCodeSrc = computed(() => qrCode.value ?? "/default.webp");

const isApiModelOpen = ref(false);

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

const copyUrl = async () => {
  if (!isValidState.value) return;

  await navigator.clipboard.writeText(apiUrl.value);

  copyUrlIcon.value = "i-heroicons-clipboard-document-check";
  setTimeout(() => {
    copyUrlIcon.value = "i-heroicons-clipboard-document";
  }, 3000);
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

  copyImageIcon.value = "i-heroicons-clipboard-document-check";
  copyImageLabel.value = "Copied!";
  setTimeout(() => {
    copyImageIcon.value = "i-heroicons-clipboard-document";
    copyImageLabel.value = "Copy";
  }, 3000);
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const upperCase = (str: string) => str.toUpperCase();

const arrayToUnion = (array: string[]) =>
  array.map((x) => `"${x}"`).join(" | ");
</script>

<template>
  <div role="main" class="flex h-[100vh] items-center justify-center">
    <NuxtRouteAnnouncer />
    <canvas ref="canvas" class="hidden" />

    <div
      class="p-5 w-full max-w-[850px] flex flex-col justify-center space-y-4"
    >
      <h1 class="text-4xl font-bold text-white border-b border-gray-700">
        Simple QRCode Generator
      </h1>
      <div class="flex justify-between space-x-8">
        <img :src="qrCodeSrc" class="max-h-[375px] aspect-square" />

        <div class="flex-1 flex flex-col justify-center">
          <UForm ref="form" :state="state" class="space-y-4">
            <UFormGroup
              label="Username or link"
              name="content"
              @input="updateQRCode"
            >
              <UInput
                v-model="state.content"
                icon="i-heroicons-user"
                placeholder="Your username or profile link"
              />
            </UFormGroup>

            <UFormGroup label="Logo" name="logo">
              <USelectMenu
                v-model="state.logo"
                icon="i-heroicons-photo"
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
                icon="i-heroicons-document-duplicate"
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
              <template #hint>
                <UButton
                  size="md"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-question-mark-circle"
                  @click="isApiModelOpen = true"
                />
              </template>

              <UButtonGroup size="sm" orientation="horizontal" class="w-full">
                <UInput
                  v-model="apiUrl"
                  disabled
                  placeholder="Please fill all fields first"
                  class="w-full"
                />
                <UButton
                  color="gray"
                  :disabled="isQRCodeEmpty"
                  :icon="copyUrlIcon"
                  @click="copyUrl"
                />
              </UButtonGroup>
            </UFormGroup>

            <div class="flex space-x-4 pt-2">
              <UButton
                class="flex-1"
                block
                :icon="copyImageIcon"
                size="md"
                color="primary"
                variant="solid"
                :label="copyImageLabel"
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

    <UModal v-model="isApiModelOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-xl font-semibold leading-6 text-gray-900 dark:text-white"
            >
              API Documentation
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isApiModelOpen = false"
            />
          </div>
        </template>

        <div class="flex flex-col space-y-8">
          <p>
            You can easily generate QRCodes by using the API, with no rate
            limitation.
            <br />
            <br />
            If you are not sure how to use the API, you can fill the QRCode form
            and copy the generated API URL.
          </p>

          <div class="space-y-3">
            <h2 class="font-bold text-lg">Base API URL</h2>
            <UInput
              model-value="https://simple-qr.com/api"
              size="sm"
              class="w-full"
              disabled
              :ui="{ base: '!ps-12 !cursor-text font-mono' }"
            >
              <template #leading>
                <span
                  class="text-white dark:text-gray-900 bg-primary py-0.5 -mx-1 px-2 text-xs rounded-sm"
                  >GET</span
                >
              </template>
            </UInput>
          </div>

          <div class="space-y-3">
            <h2 class="font-bold text-lg">Query parameters</h2>
            <div
              class="text-sm flex flex-col space-y-4 font-mono divide-y divide-gray-200 dark:divide-gray-800"
            >
              <div class="pt-1 flex justify-between gap-x-5">
                <span class="text-primary font-semibold">format</span>
                <span class="text-slate-700 dark:text-slate-200 text-right">{{
                  arrayToUnion(IMAGE_FORMATS)
                }}</span>
              </div>

              <div class="pt-4 flex justify-between gap-x-5">
                <span class="text-primary font-semibold">logo</span>
                <span class="text-slate-700 dark:text-slate-200 text-right">{{
                  arrayToUnion(LOGOS)
                }}</span>
              </div>

              <div class="pt-4 flex justify-between gap-x-5">
                <span class="text-primary font-semibold">content</span>
                <span class="text-slate-700 dark:text-slate-200 text-right"
                  >string</span
                >
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
