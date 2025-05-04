import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],
  
  // 添加報告配置
  reporter: [
    ['html', { outputFolder: './test-results/playwright/html-report' }],
    ['json', { outputFile: './test-results/playwright/results.json' }],
    ['junit', { outputFile: './test-results/playwright/junit.xml' }]
  ],
  // 設置輸出目錄
  outputDir: './test-results/playwright/test-results',
});
