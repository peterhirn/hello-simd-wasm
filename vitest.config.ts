import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    reporters: ["basic", "junit"],
    outputFile: {
      junit: "junit.xml"
    },
    coverage: {
      all: true,
      include: ["wasm/**"],
      reportsDirectory: "coverage",
      reporter: ["text", "cobertura", "html"]
    }
  }
});
