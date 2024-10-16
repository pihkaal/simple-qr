<script setup lang="ts">
const app = useAppStore();
const baseApiUrl = useBaseApiUrl();

const isQRCodeEmpty = computed(() => app.qrCode === "/default.webp");

const firstBlured = ref(false);

const state = reactive({
  hasLogo: false,
  logo: undefined,
  format: IMAGE_FORMATS[0],
  content: undefined,
});

const stateErrors = computed(() => ({
  content: firstBlured.value && !state.content,
  logo: firstBlured.value && state.hasLogo && !state.logo,
}));

const isValidState = computed(
  () =>
    ((state.hasLogo && state.logo) || !state.hasLogo) &&
    state.content &&
    state.format,
);

const apiUrl = computed((previous) => {
  if (!isValidState.value) return previous;

  const params = new URLSearchParams({
    ...(state.hasLogo && { logo: state.logo }),
    format: state.format,
    content: state.content,
  });

  return `${baseApiUrl}?${params}`;
});

const { icon: copyUrlIcon, copy: copyUrl } = useCopyable(apiUrl);

const openApiModal = () => {
  app.apiModalOpened = true;
};

const updateQRCode = async () => {
  await nextTick();

  if (!isValidState.value) return;

  const logoUrl = state.hasLogo ? `/logos/${state.logo}.png` : undefined;
  const canvas = await renderQRCodeToCanvas(state.content, logoUrl);

  app.qrCode = canvas.toDataURL(`image/${state.format}`);
};

const downloadQRCode = () => {
  const link = document.createElement("a");
  link.href = app.qrCode;
  link.download = `qrcode.${state.format}`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const {
  copy: copyQRCode,
  icon: copyImageIcon,
  label: copyImageLabel,
} = useCopyable(async () => {
  if (isQRCodeEmpty.value) return;

  const logoUrl = state.hasLogo ? `/logos/${state.logo}.png` : undefined;
  const canvas = await renderQRCodeToCanvas(state.content, logoUrl);

  const qrCode = canvas.toDataURL(`image/png`);

  const blob = await (await fetch(qrCode)).blob();
  const item = new ClipboardItem({ "image/png": blob });
  await navigator.clipboard.write([item]);
});
</script>

<template>
  <div class="flex-1 flex flex-col justify-center">
    <UForm ref="form" :state="state" class="space-y-4">
      <UFormGroup
        label="Username or link"
        name="content"
        :error="stateErrors.content"
      >
        <UInput
          v-model="state.content"
          icon="i-heroicons-user"
          placeholder="Your username or profile link"
          @input="updateQRCode"
          @blur="firstBlured = true"
        />
      </UFormGroup>

      <UFormGroup name="logo" :error="stateErrors.logo">
        <template #label>
          <UCheckbox
            v-model="state.hasLogo"
            class="mb-1.5"
            label="Logo"
            @change="updateQRCode"
            @blur="firstBlured = true"
          />
        </template>

        <USelectMenu
          v-model="state.logo"
          icon="i-heroicons-photo"
          :options="LOGOS"
          :disabled="!state.hasLogo"
          placeholder="Select logo"
          searchable
          clear-search-on-close
          @change="updateQRCode"
          @blur="firstBlured = true"
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
          @blur="firstBlured = true"
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
            @click="openApiModal"
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
            :disabled="!isValidState"
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
</template>
