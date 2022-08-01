import { expect, test } from "@playwright/test"

test("Check that the first element has styles assigned", async ({ page }) => {
	await page.goto("/fast-style");

	const cards = page.locator("fast-card");
	const styles = await cards.evaluateAll((cardList) => {
		return cardList.map((card) => {
			return window.getComputedStyle(card, null).getPropertyValue("background-color");
		});
	});

	expect(styles[0]).toEqual("rgb(26, 26, 26)");
});
test("Check that the nested element in the first element has styles assigned", async ({ page }) => {
	await page.goto("/fast-style");

	const cards = page.locator("fast-card");
	const styles = await cards.evaluateAll((cardList) => {
		return cardList.map((card) => {
			return window.getComputedStyle(
					(card.shadowRoot?.querySelector("fast-button") as Element), null
				).getPropertyValue("background-color");
		});
	});

	expect(styles[0]).toEqual("rgb(43, 43, 43)");
});
test("Check that all elements have styles assigned", async ({ page }) => {
	await page.goto("/fast-style");

	const cards = page.locator("fast-card");
	const styles = await cards.evaluateAll((cardList) => {
		return cardList.map((card) => {
			return window.getComputedStyle(card, null).getPropertyValue("background-color");
		});
	});

	expect(styles).toHaveLength(10);

	styles.forEach((style) => {
		expect(style).toEqual("rgb(26, 26, 26)");
	});
});
test("Check that all nested elements have styles assigned", async ({ page}) => {
	await page.goto("/fast-style");

	const cards = page.locator("fast-card");
	const styles = await cards.evaluateAll((cardList) => {
		return cardList.map((card) => {
			return window.getComputedStyle(
					(card.shadowRoot?.querySelector("fast-button") as Element), null
				).getPropertyValue("background-color");
		});
	});

	expect(styles).toHaveLength(10);

	styles.forEach((style) => {
		expect(style).toEqual("rgb(43, 43, 43)");
	});
});
