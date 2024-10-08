import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { type Dispose, dispose } from "./dispose.js";
import { MAX_U32 } from "./limits.js";
import { type Result, error, ok, valueOrThrow } from "./result.js";

export type Ptr = number;

export interface Exports extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  alloc(size: number): Ptr;
  drop(ptr: Ptr): void;
  simd(input: number): Ptr;
  multivalue(input: number): [number, number];
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
  return instance.exports as Exports;
};

const isUnreachable = (e: unknown): boolean =>
  e instanceof Error && e?.message === "unreachable";

const validateAllocSize = (size: number): Result => {
  if (!Number.isInteger(size)) return error("Allocation size must be an integer");
  if (size < 1) return error("Allocation size must be positive");
  if (size > MAX_U32) return error("Allocation size is too large");
  return ok();
};

export const tryAlloc = (exports: Exports, size: number): Result<Dispose<Ptr>> => {
  const validate = validateAllocSize(size);
  if (!validate.ok) return validate;

  try {
    const ptr = exports.alloc(size);
    return ok(dispose(ptr, () => exports.drop(ptr)));
  } catch (e) {
    if (isUnreachable(e)) return error("Allocation failed");
    throw e;
  }
};

export const alloc = (exports: Exports, size: number): Dispose<Ptr> =>
  valueOrThrow(tryAlloc(exports, size));

export const trySimd = (
  exports: Exports,
  input: number
): Result<Dispose<Float32Array>> => {
  try {
    const ptr = exports.simd(input);
    const heap = new Float32Array(exports.memory.buffer);
    const f32Ptr = ptr / Float32Array.BYTES_PER_ELEMENT;
    const data = heap.slice(f32Ptr, f32Ptr + 4);

    return ok(dispose(data, () => exports.drop(ptr)));
  } catch (e) {
    if (isUnreachable(e)) return error("SIMD test failed");
    throw e;
  }
};

export const simd = (exports: Exports, input: number): Dispose<Float32Array> =>
  valueOrThrow(trySimd(exports, input));

export const multivalue = (exports: Exports, input: number): Result<unknown> => {
  try {
    const ptr = exports.multivalue(input);
    console.log(ptr);
    return ok();
  } catch (e) {
    if (isUnreachable(e)) return error("Multivalue test failed");
    throw e;
  }
};
