// TODO: Playwright 測試範例

import { test, expect } from "@playwright/test";

test("測試新增待辦事項", async ({ page }) => {
  // 前往 Todo App
  await page.goto("http://localhost:3000");

  // 填寫新待辦事項
  await page.fill('input[name="title"]', "學習 Playwright");
  await page.fill('textarea[name="description"]', "學習 Playwright 的使用方法");
  await page.click('button[type="submit"]');

  // 確認新增的待辦事項是否正確
  const todoItem = await page.waitForSelector(".todo-item");
  expect(todoItem).not.toBeNull();
  expect(await todoItem.innerText()).toContain("學習 Playwright");
  expect(await todoItem.innerText()).toContain("學習 Playwright 的使用方法");
});
