import { expect, test } from '@playwright/test';

test("example server test", async ({ page }) => {
	await page.goto("/");
	expect(await page.innerText('body')).toBe("hello world");
});
