import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { type DisposableValue, disposable } from "./disposable.js";
import { type Result, ResultError, error, ok, valueOrThrow } from "./result.js";

export type Ptr = number;

export interface Exports extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  alloc(length: number): Ptr;
  drop(ptr: Ptr): void;
  simd(input: number): Ptr;
}

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

const isUnreachable = (e: unknown): boolean =>
  e instanceof Error && e?.message === "unreachable";

export const MAX_U32 = 4_294_967_295;

const validateAllocSize = (size: number): ResultError | undefined => {
  if (!Number.isInteger(size)) return error("Allocation size must be an integer");
  if (size < 1) return error("Allocation size must be positive");
  if (size > MAX_U32) return error("Allocation size is too large");
};

export const tryAlloc = (
  exports: Exports,
  size: number
): Result<DisposableValue<Ptr>> => {
  const sizeError = validateAllocSize(size);
  if (sizeError) return sizeError;

  try {
    const ptr = exports.alloc(size);
    return ok(disposable(ptr, () => exports.drop(ptr)));
  } catch (e) {
    if (isUnreachable(e)) return error("Allocation failed");
    throw e;
  }
};

export const alloc = (exports: Exports, length: number): DisposableValue<Ptr> =>
  valueOrThrow(tryAlloc(exports, length));

export const trySimd = (
  exports: Exports,
  input: number
): Result<DisposableValue<Float32Array>> => {
  try {
    const ptr = exports.simd(input);
    const heap = new Float32Array(exports.memory.buffer);
    const f32Ptr = ptr / Float32Array.BYTES_PER_ELEMENT;
    const data = heap.slice(f32Ptr, f32Ptr + 4);

    return ok(disposable(data, () => exports.drop(ptr)));
  } catch (e) {
    if (isUnreachable(e)) return error("SIMD test failed");
    throw e;
  }
};

export const simd = (exports: Exports, input: number): DisposableValue<Float32Array> =>
  valueOrThrow(trySimd(exports, input));
