export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const upperCase = (str: string) => str.toUpperCase();

export const arrayToUnion = (array: string[]) =>
  array.map((x) => `"${x}"`).join(" | ");
