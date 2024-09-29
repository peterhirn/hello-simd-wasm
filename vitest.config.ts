import { defineConfig } from "vitest/config";

export default defineConfig({
  clearScreen: false,
  test: {
    include: ["src/**/*.test.ts"],
    reporters: ["basic", "junit"],
    outputFile: {
      junit: "junit.xml"
    },
    coverage: {
      all: true,
      include: ["src/**"],
      reportsDirectory: "coverage",
      reporter: ["text", "cobertura", "html"]
    }
  }
});
