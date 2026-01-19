import { defineConfig } from "vitest/config";

export default defineConfig({
  clearScreen: false,
  test: {
    include: ["src/**/*.test.ts"],
    reporters: ["default", "junit"],
    outputFile: {
      junit: "junit.xml"
    },
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      reportsDirectory: "coverage",
      reporter: ["text", "cobertura", "html"]
    }
  }
});
