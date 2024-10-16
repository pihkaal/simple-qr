export const useAppStore = defineStore("appStore", {
  state: () => ({
    qrCode: "/default.webp",
    apiModalOpened: false,
  }),
});
