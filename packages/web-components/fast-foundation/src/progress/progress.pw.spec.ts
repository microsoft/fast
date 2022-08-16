import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTProgress } from "./progress.js";

test.describe("Progress", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-progress");

        root = page.locator("#root");

        await page.goto(fixtureURL("progress--progress"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should include a role of progressbar", async () => {
        await expect(element).toHaveAttribute("role", "progressbar");
    });

    test("should set the `aria-valuenow` attribute with the `value` property when provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress value="50"></fast-progress>
            `;
        });

        await expect(element).toHaveAttribute("aria-valuenow", "50");
    });

    test("should set the `aria-valuemin` attribute with the `min` property when provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress min="50"></fast-progress>
            `;
        });

        await expect(element).toHaveAttribute("aria-valuemin", "50");
    });

    test("should set the `aria-valuemax` attribute with the `max` property when provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress max="50"></fast-progress>
            `;
        });

        await expect(element).toHaveAttribute("aria-valuemax", "50");
    });

    test("should render an element with a `determinate` class when a value is provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress value="50"></fast-progress>
            `;
        });

        const progress = element.locator(".determinate");

        await expect(progress).toHaveCount(1);
    });

    test("should render an element with an `indeterminate` class when no value is provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress></fast-progress>
            `;
        });

        const progress = element.locator(".indeterminate");

        await expect(progress).toHaveCount(1);
    });

    test("should return the `percentComplete` property as a value between 0 and 100 when `min` and `max` are unset", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress value="50"></fast-progress>
            `;
        });

        await expect(element).toHaveJSProperty("percentComplete", 50);
    });

    test("should set the `percentComplete` property to match the current `value` in the range of `min` and `max`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress value="0"></fast-progress>
            `;
        });

        await expect(element).toHaveJSProperty("percentComplete", 0);

        await element.evaluate((node: FASTProgress) => {
            node.value = 50;
        });

        await expect(element).toHaveJSProperty("percentComplete", 50);

        await element.evaluate((node: FASTProgress) => {
            node.value = 100;
        });

        await expect(element).toHaveJSProperty("percentComplete", 100);

        await element.evaluate((node: FASTProgress) => {
            node.max = 200;
        });

        await expect(element).toHaveJSProperty("percentComplete", 50);

        await element.evaluate((node: FASTProgress) => {
            node.min = 100;
        });

        await expect(element).toHaveJSProperty("percentComplete", 0);
    });
});
