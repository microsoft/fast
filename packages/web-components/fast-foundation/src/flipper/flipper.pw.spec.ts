import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTFlipper } from "./flipper.js";

test.describe("Flipper", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-flipper");

        root = page.locator("#root");

        await page.goto(fixtureURL("flipper--flipper"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should include a role of button", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-flipper></fast-flipper>
            `;
        });

        await expect(element).toHaveAttribute("role", "button");
    });

    test('should set `aria-hidden` to "true" by default', async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-flipper></fast-flipper>
            `;
        });

        await expect(element).toHaveAttribute("aria-hidden", "true");
    });

    test("should set the `hiddenFromAT` property to true by default", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-flipper></fast-flipper>
            `;
        });

        await expect(element).toHaveJSProperty("hiddenFromAT", true);
    });

    test('should set the `direction` property to "next" by default', async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-flipper></fast-flipper>
            `;
        });

        await expect(element.locator("span")).toHaveClass(/next/);
    });

    test("should toggle the `aria-disabled` attribute based on the value of the `disabled` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-flipper disabled></fast-flipper>
            `;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate((node: FASTFlipper) => {
            node.disabled = false;
        });

        await (await element.elementHandle())?.waitForElementState("stable");

        await expect(element).not.toHaveAttribute("aria-disabled");
    });

    test('should set the `tabindex` attribute to "-1" when `hiddenFromAT` is true', async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-flipper></fast-flipper>
            `;
        });

        await expect(element).toHaveAttribute("tabindex", "-1");

        await element.evaluate((node: FASTFlipper) => {
            node.hiddenFromAT = false;
        });

        await (await element.elementHandle())?.waitForElementState("stable");

        await expect(element).toHaveAttribute("tabindex", "0");

        await element.evaluate((node: FASTFlipper) => {
            node.hiddenFromAT = true;
        });

        await expect(element).toHaveAttribute("tabindex", "-1");
    });

    test("should set a `tabindex` of 0 when `aria-hidden` is false", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-flipper aria-hidden="false"></fast-flipper>
            `;
        });

        await expect(element).toHaveAttribute("tabindex", "0");

        await element.evaluate(node => {
            node.setAttribute("aria-hidden", "true");
        });

        await expect(element).toHaveAttribute("tabindex", "-1");
    });

    test('should render a span with a class of "next" when the `direction` attribute is "next"', async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-flipper direction="next"></fast-flipper>
            `;
        });

        const spans = element.locator("span");

        await expect(spans).toHaveCount(1);

        await expect(spans).toHaveClass(/next/);
    });

    test('should render a span with a class of "previous" when the `direction` attribute is "previous"', async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-flipper direction="previous"></fast-flipper>
            `;
        });

        const spans = element.locator("span");

        await expect(spans).toHaveCount(1);

        await expect(spans).toHaveClass(/previous/);
    });
});
