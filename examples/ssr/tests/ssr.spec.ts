import { test, expect, ElementHandle } from '@playwright/test';

const PORT = 8080;
const ROOT_URL = `http://localhost:${PORT}/`

async function isCustomElementHandle(handle: ElementHandle<HTMLElement | SVGElement>) {
	return await handle.evaluate(el => el.tagName.includes("-"));
}

test(`should render the 'fast-main' custom element with a shadow root`, async ({ page }) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main");
	await expect(target).not.toBeNull();

	const shadowRoot = await target.evaluate(node => {
		return node.shadowRoot
	});

	expect(shadowRoot).not.toBeNull();
});

test.describe('defer-hydration behavior', () => {
	test("all light-dom custom elements should not have the `defer-hydration` attribute", async ({page }) => {
		await page.goto(ROOT_URL);
		const nodes = await page.$$("body :light(*)");
		const customElementNodes: ElementHandle<HTMLElement>[] = []

		for (const node of nodes) {
			if (await isCustomElementHandle(node)) {

				customElementNodes.push(node as ElementHandle<HTMLElement>);
			}
		}

		expect(nodes.length).toBeGreaterThan(0);

		for (const ce of customElementNodes) {
			expect(await ce.getAttribute('defer-hydration')).toBe(null)
		}
	});

	test("all shadow-dom custom elements should have the `defer-hydration` attribute", async ({page }) => {
		await page.goto(ROOT_URL);
		const nodes = await page.$$("*");
		const shadowedCustomElementNodes: ElementHandle<HTMLElement>[] = []

		for (const node of nodes) {
			const shadowed = await node.evaluate(element => { return element.getRootNode() !== document});

			if (!shadowed) {
				continue;
			}

			const tagname = await node.evaluate(element => element.tagName)

			if (await isCustomElementHandle(node)) {
				shadowedCustomElementNodes.push(node as ElementHandle<HTMLElement>);
			}
		}

		expect(nodes.length).toBeGreaterThan(0);

		for (const ce of shadowedCustomElementNodes) {
			expect(await ce.getAttribute('defer-hydration')).toBe("")
		}
	});
})

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

test(`should render a custom element registered with an open shadow root with an open shadow root`, async ({page}) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main #open-shadow-root");
	const shadowRoot = await target.evaluate(node => node.shadowRoot);

	expect(shadowRoot).not.toBeNull();
});
// This fails because open shadow roots are hard-coded. The reason for that is so that hydrated elements can get access
// to the generated shadow root.
test.skip(`should render a custom element registered with a closed shadow root with a closed shadow root`, async ({page}) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main #closed-shadow-root");
	const shadowRoot = await target.evaluate(node => node.shadowRoot);

	expect(shadowRoot).toBeNull();
});

test("should render text into the default slot of an element with a default slot", async ({page}) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main #default-slotted-text");
	const text = await target.innerText();

	expect(text).toBe("Shadow DOM slotted text");
});

test("should render an element into the default slot of an element with a default slot", async ({page}) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main #default-slotted-element > fast-leaf");

	expect(target).not.toBeNull();
});

test("should render an element into a named slot of an element with a named slot", async ({page}) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main #named-slotted-element > fast-leaf");

	expect(target).not.toBeNull();
});

test("should bind an attribute value to an element", async ({page}) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main > fast-bindings #attribute-binding");

	expect(await target.innerText()).toBe("attribute-value");
});

test("should bind a boolean attribute value to an element", async ({page}) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main > fast-bindings #boolean-attribute-binding");

	expect(await target.innerText()).toBe("true");
});
test("should bind a property value to an element", async ({page}) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main > fast-bindings #property-binding");

	expect(await target.innerText()).toBe("property-value");
});
test("should produce a style element for styles an element is defined with", async ({page}) => {
	await page.goto(ROOT_URL);
	const target = await page.$("fast-main > #definition-styles style");

	expect(await (await target.innerText()).replaceAll(/\s/g, "")).toBe(":host{color:red;}");
});
test("should produce a style element for styles an element adding dynamically", async ({page}) => {
	await page.goto(ROOT_URL);
	const targets = await page.$$("fast-main > #instance-styles style");
	const target = targets[1]

	expect(await (await target.innerText()).replaceAll(/\s/g, "")).toBe(":host{color:blue;}");
});

test("should render an element that uses the repeat directive", async ({page}) => {
	await page.goto(ROOT_URL);
	const items = await page.$$("fast-main > #default-repeater li");

	expect(items.length).toBe(4);
	expect(await items[0].innerText()).toBe("A");
	expect(await items[1].innerText()).toBe("B");
	expect(await items[2].innerText()).toBe("C");
	expect(await items[3].innerText()).toBe("D");
});

test("should render an element that uses the repeat directive with bound data", async ({page}) => {
	await page.goto(ROOT_URL);
	const items = await page.$$("fast-main > #data-bound-repeater li");

	expect(items.length).toBe(4);
	expect(await items[0].innerText()).toBe("1");
	expect(await items[1].innerText()).toBe("2");
	expect(await items[2].innerText()).toBe("3");
	expect(await items[3].innerText()).toBe("4");
});