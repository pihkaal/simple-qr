<script setup lang="ts">
const app = useAppStore();

const closeModal = () => {
  app.apiModalOpened = false;
};

const baseApiUrl = useBaseApiUrl();
const { copy: copyBaseApiUrl, icon: baseApiUrlIcon } = useCopyable(baseApiUrl);
</script>

<template>
  <UModal v-model="app.apiModalOpened">
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
            @click="closeModal"
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

          <UButtonGroup size="sm" orientation="horizontal" class="w-full">
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
            <UButton
              color="gray"
              :icon="baseApiUrlIcon"
              @click="copyBaseApiUrl"
            />
          </UButtonGroup>
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
</template>
