import { describe, expect, test } from "vitest";

import { initialize } from "./main.js";

describe("main", async () => {
  const exports = await initialize();

  test("allocate", () => {
    const ptr1 = exports.alloc(10);
    expect(ptr1).toBeDefined();
    exports.drop(ptr1);

    const ptr2 = exports.alloc(10);
    expect(ptr2).toBeDefined();
    expect(ptr1).toEqual(ptr1);
    exports.drop(ptr1);
  });
});
