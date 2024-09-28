import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

// @ts-expect-error Polyfill `Symbol.dispose`
Symbol.dispose ??= Symbol("Symbol.dispose");

export type Ptr = number;

export interface Exports extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  alloc(length: number): Ptr;
  drop(ptr: Ptr): void;
  simd(input: number): Ptr;
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

export const initialize = async (): Promise<Exports> => {
  const instance = await instantiate();
  const exports = instance.exports as Exports;
  return exports;
};

export type DisposablePtr = Disposable & { ptr: Ptr };

export interface ResultOk<T> {
  success: true;
  error: never;
  value: T;
}

export interface ResultError {
  success: false;
  error: string;
  value: never;
}

export type Result<T> = ResultOk<T> | ResultError;

export const ok = <T>(value: T): ResultOk<T> =>
  ({
    success: true,
    value
  }) as ResultOk<T>;

export const error = (error: string): ResultError =>
  ({
    success: false,
    error
  }) as ResultError;

export type AllocResult = Result<DisposablePtr>;

export const MAX_U32 = 4_294_967_295;

export const tryAlloc = (exports: Exports, size: number): AllocResult => {
  if (!Number.isInteger(size)) return error("Allocation size must be an integer");
  if (size < 1) return error("Allocation size must be positive");
  if (size > MAX_U32) return error("Allocation size is too large");

  try {
    const ptr = exports.alloc(size);
    return ok({
      ptr,
      [Symbol.dispose]: () => exports.drop(ptr)
    });
  } catch (e) {
    if (e instanceof Error && e?.message === "unreachable")
      return error("Allocation failed");
    console.log(e);
    throw e;
  }
};

export const alloc = (exports: Exports, length: number): DisposablePtr => {
  const result = tryAlloc(exports, length);
  if (result.success) return result.value;
  throw Error(result.error);
};

export type DisposableSimdResult = Disposable & { data: Float32Array };

export const simd = (exports: Exports, input: number): DisposableSimdResult => {
  const ptr = exports.simd(input);
  const heap = new Float32Array(exports.memory.buffer);
  const f32Ptr = ptr / Float32Array.BYTES_PER_ELEMENT;
  const data = heap.slice(f32Ptr, f32Ptr + 4);

  return {
    data,
    [Symbol.dispose]: () => {
      console.log("drop 🗑️", ptr);
      exports.drop(ptr);
    }
  };
};
