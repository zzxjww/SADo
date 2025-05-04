import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/tests/"],
  
  // 添加測試報告配置
  reporters: [
    "default",
    ["jest-junit", {
      outputDirectory: "./test-results/jest",
      outputName: "results.xml",
    }]
  ],
  collectCoverage: true,
  coverageDirectory: "./test-results/coverage",
  coverageReporters: ["json", "lcov", "text", "clover", "html"],
};

export default createJestConfig(config); 