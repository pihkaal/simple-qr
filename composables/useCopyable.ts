export const useCopyable = (
  valueOrCallback: string | Ref<string> | (() => PromiseLike<string>),
) => {
  const icon = ref("i-heroicons-clipboard-document");
  const label = ref("Copy");

  const copy = async () => {
    if (typeof valueOrCallback === "function") {
      await valueOrCallback();
    } else {
      const value = unref(valueOrCallback);
      await navigator.clipboard.writeText(value);
    }

    icon.value = "i-heroicons-clipboard-document-check";
    label.value = "Copied!";

    setTimeout(() => {
      icon.value = "i-heroicons-clipboard-document";
      label.value = "Copy";
    }, 3000);
  };

  return { icon, copy, label };
};
