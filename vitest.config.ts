import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["js/**/*.test.ts"],
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
