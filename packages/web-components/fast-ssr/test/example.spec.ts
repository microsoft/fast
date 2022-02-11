import { test, expect, ElementHandle } from '@playwright/test';
import fastSSR from "../src";

test("example module test", async () => {
	expect(fastSSR).toBe("fast-ssr");
})
test("example server test", async ({ page }) => {
	await page.goto("/");
	expect(await page.innerText('body')).toBe("hello world");
});
