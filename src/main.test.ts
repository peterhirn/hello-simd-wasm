import { describe, expect, test } from "vitest";

import { initialize } from "./main.js";

describe("main", async () => {
  const exports = await initialize();

  test("allocate and drop", () => {
    const ptr1 = exports.alloc(10);
    expect(ptr1).toBeDefined();
    exports.drop(ptr1);
    console.log(ptr1);

    const ptr2 = exports.alloc(10);
    expect(ptr2).toBeDefined();
    expect(ptr1).toEqual(ptr1);
    exports.drop(ptr1);
  });

  test("allocate a large amount", () => {
    console.log(exports.memory.buffer.byteLength);
    const ptr1 = exports.alloc(500 * 1024 * 1024);
    expect(ptr1).toBeDefined();
    exports.drop(ptr1);

    expect(() => exports.alloc(2147483648)).toThrow("unreachable");

    const ptr2 = exports.alloc(512 * 1024 * 1024);
    expect(ptr2).toBeDefined();
    exports.drop(ptr2);
  });
});
