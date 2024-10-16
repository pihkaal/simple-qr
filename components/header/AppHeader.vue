<template>
  <div
    class="pb-1.5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center"
  >
    <h1 class="text-2xl sm:text-4xl font-bold">Simple QRCode</h1>

    <ClientOnly>
      <div class="flex gap-x-1 animate-fadeIn">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-uil-github"
          aria-label="Github repo"
          class="w-8 h-8"
          target="_blank"
          to="https://github.com/pihkaal/simple-qr"
        />

        <ThemeSwitcher />
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 200ms ease-in-out forwards;
}
</style>
