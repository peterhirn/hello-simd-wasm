export const toHex = (array: Uint8Array): string =>
  Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
