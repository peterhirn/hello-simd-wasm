import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

// @ts-expect-error Polyfill `Symbol.dispose`
Symbol.dispose ??= Symbol("Symbol.dispose");

export type Ptr = number;

export type DisposablePtr = Disposable & { ptr: Ptr };

export interface Exports extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  initialize(): void;
  drop(ptr: Ptr): void;
  test(input: number): Ptr;
}

export const toHex = (array: Uint8Array): string =>
  Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const instantiate = async (): Promise<WebAssembly.Instance> => {
  const path = resolve(import.meta.dirname, "..", "dist", "main.wasm");
  const wasm = await readFile(path);
  const imports = {};
  const { instance } = await WebAssembly.instantiate(wasm, imports);
  return instance;
};

export const test = (exports: Exports, input: number): DisposablePtr => {
  const ptr = exports.test(input);
  console.log("allocated 👉", ptr);
  return {
    ptr,
    [Symbol.dispose]: () => {
      console.log("drop 🗑️", ptr);
      exports.drop(ptr);
    }
  };
};

export const main = async (): Promise<void> => {
  const instance = await instantiate();
  const exports = instance.exports as Exports;
  exports.initialize();

  const f32Heap = () => new Float32Array(exports.memory.buffer);

  const logTestResult = (ptr: Ptr): void => {
    const f32Ptr = ptr / Float32Array.BYTES_PER_ELEMENT;
    console.log(f32Heap().slice(f32Ptr, f32Ptr + 4));
  };

  // drop ptr1 at the end of this scope
  {
    using ptr1 = test(exports, 1.5);
    logTestResult(ptr1.ptr);
  }

  using ptr2 = test(exports, -5);
  logTestResult(ptr2.ptr);

  using ptr3 = test(exports, 10);
  using ptr4 = test(exports, 20);

  logTestResult(ptr3.ptr);
  logTestResult(ptr4.ptr);
};
