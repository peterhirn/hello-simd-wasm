import { describe, expect, test } from "vitest";

import { MAX_MEMORY, MAX_U32 } from "./limits.js";
import { alloc, initialize, simd, tryAlloc } from "./main.js";

describe("main", async () => {
  const exports = await initialize();

  test("allocate and drop", () => {
    const ptr1 = exports.alloc(10);
    expect(ptr1).toBeDefined();
    exports.drop(ptr1);

    const ptr2 = exports.alloc(10);
    expect(ptr2).toEqual(ptr1);
    exports.drop(ptr2);
  });

  test("allocate smart pointer", () => {
    let ptr1 = 0;
    {
      using ptr = alloc(exports, 10);
      expect(ptr).toBeDefined();
      ptr1 = ptr.value;
    }

    using ptr2 = alloc(exports, 10);
    expect(ptr2.value).toEqual(ptr1);
  });

  test("validate allocation size ", () => {
    expect(tryAlloc(exports, -1).error).toEqual("Allocation size must be positive");
    expect(tryAlloc(exports, MAX_U32 + 1).error).toEqual("Allocation size is too large");

    expect(tryAlloc(exports, 6.9).error).toEqual("Allocation size must be an integer");
    // @ts-expect-error
    expect(tryAlloc(exports, null).error).toEqual("Allocation size must be an integer");
    // @ts-expect-error
    expect(tryAlloc(exports, "asdf").error).toEqual("Allocation size must be an integer");
  });

  test("allocate a large size", () => {
    const ptr1 = exports.alloc(500 * 1024 * 1024);
    expect(ptr1).toBeDefined();
    exports.drop(ptr1);

    expect(() => alloc(exports, MAX_MEMORY)).toThrow("Allocation failed");

    const ptr2 = exports.alloc(512 * 1024 * 1024);
    expect(ptr2).toBeDefined();
    exports.drop(ptr2);
  });

  test("simd test", () => {
    using result1 = simd(exports, 1);
    expect(result1.value).toEqual(new Float32Array([2, 3, 4, 5]));

    using result2 = simd(exports, 1.5);
    expect(result2.value).toEqual(new Float32Array([2.5, 3.5, 4.5, 5.5]));
  });

  /*
  test("multivalue test", () => {
    const result1 = multivalue(exports, 1);
    expect(result1.value).toEqual([2, 3]);
  });
    */
});
