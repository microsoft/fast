import { test, expect, ElementHandle } from '@playwright/test';

const PORT = 8080;
const ROOT_URL = `http://localhost:${PORT}/`

test(`should render the 'fast-main' custom element with a shadow root`, async ({ page }) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main");
	await expect(target).not.toBeNull();

	const shadowRoot = await target.evaluate(node => {
		return node.shadowRoot
	});

	expect(shadowRoot).not.toBeNull();
});

test.describe("should render a static element", () => {
	test(`into a shadow root`, async ({ page }) => {
		await page.goto(ROOT_URL);
		const target = await page.$("fast-main #static-element");
		await expect(target).not.toBeNull();

		const rootNodeIsShadowRoot = await target.evaluate(node => node.getRootNode() instanceof ShadowRoot);

		expect(rootNodeIsShadowRoot).toBe(true)
	});
	test(`with static content in a shadow root`, async ({ page }) => {
		await page.goto(ROOT_URL);
		const target = await page.$("fast-main #static-element");

		await expect(await target.innerText()).toBe("Static Element Content")
	});

	test(`with text content bound from an initialized property`, async ({ page }) => {
		await page.goto(ROOT_URL);
		const target = await page.$("fast-main #static-element-bound-content");

		await expect(await target.innerText()).toBe("Initialized string content")
	});
});
test(`should render an element in a 'when' directive when the binding evaluates true`, async ({ page }) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main #when-directive-true");
	expect(target).not.toBeNull();

	await expect(await target.innerText()).toBe("When directive true")
});
test(`should not render an element in a 'when' directive when the binding evaluates false`, async ({ page }) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main #when-directive-false");
	expect(target).toBeNull();
});
test(`should render a custom element into a shadow DOM`,  async ({page}) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main #nested-custom-element");
	expect(target).not.toBeNull();

	const hasShadowRoot = await target.evaluate(node => node.shadowRoot instanceof ShadowRoot);
	expect(hasShadowRoot).toBe(true);

	const innerElement = await target.$("p");
	expect(await innerElement.innerText()).toBe("Leaf node");
});