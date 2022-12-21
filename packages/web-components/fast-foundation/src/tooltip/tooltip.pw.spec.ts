import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTooltip } from "./tooltip.js";

test.describe("Tooltip", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let anchoredRegion: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-tooltip");

        root = page.locator("#root");

        anchoredRegion = element.locator("fast-anchored-region");

        await page.goto(fixtureURL("tooltip--tooltip", { delay: 0 }));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should not render the tooltip by default", async () => {
        await expect(element).toHaveJSProperty("visible", false);

        await expect(anchoredRegion).toBeHidden();
    });

    test("should render the tooltip when the anchor is hovered", async () => {
        await root.evaluate((node: HTMLElement) => {
            node.innerHTML = /* html */ `
            <fast-tooltip anchor="anchor-default">
                Tooltip
            </fast-tooltip>
            <fast-button id="anchor-default">
                Hover or focus me
            </fast-button>
        `;
        });

        const anchor = page.locator("#anchor-default");

        await anchor.hover();

        await expect(element).toHaveJSProperty("visible", true);

        await expect(element).toBeVisible();
    });

    test("should render the tooltip when the anchor is focused", async () => {
        await root.evaluate((node: HTMLElement) => {
            node.innerHTML = /* html */ `
                <fast-tooltip anchor="anchor-default">
                    Tooltip
                </fast-tooltip>
                <fast-button id="anchor-default">
                    Hover or focus me
                </fast-button>
            `;
        });

        const anchor = page.locator("#anchor-default");

        await expect(element).toHaveJSProperty("visible", false);

        await expect(element).toBeHidden();

        await anchor.focus();

        await expect(element).toHaveJSProperty("visible", true);

        await expect(element).toBeVisible();
    });

    test('should render the tooltip when the `show` attribute is "true"', async () => {
        await root.evaluate((node: HTMLElement) => {
            node.innerHTML = /* html */ `
                <fast-tooltip anchor="anchor-default" show="true">
                    Tooltip
                </fast-tooltip>
                <fast-button id="anchor-default">
                    Hover or focus me
                </fast-button>
            `;
        });

        await expect(element).toHaveJSProperty("visible", true);

        await expect(element).toBeVisible();
    });

    test('should not render the tooltip when the `show` attribute is "false"', async () => {
        await root.evaluate((node: HTMLElement) => {
            node.innerHTML = /* html */ `
                <fast-tooltip anchor="anchor-default" show="false">
                    Tooltip
                </fast-tooltip>
                <fast-button id="anchor-default">
                    Hover or focus me
                </fast-button>
            `;
        });

        await element.evaluate((node: FASTTooltip) => {
            node.show = false;
        });

        await expect(element).toHaveJSProperty("visible", false);

        await expect(element).toBeHidden();
    });

    test('should not render the tooltip when the anchor is hovered and `show` is "false"', async () => {
        await root.evaluate((node: HTMLElement) => {
            node.innerHTML = /* html */ `
                <fast-tooltip anchor="anchor-default">
                    Tooltip
                </fast-tooltip>
                <fast-button id="anchor-default">
                    Hover or focus me
                </fast-button>
            `;
        });

        const anchor = page.locator("#anchor-default");

        await element.evaluate((node: FASTTooltip) => {
            node.show = false;
        });

        await expect(element).toHaveJSProperty("visible", false);

        await expect(element).toBeHidden();

        await anchor.hover();

        await expect(element).toHaveJSProperty("visible", false);

        await expect(element).toBeHidden();
    });

    test("should change anchor element when the `anchor` attribute changes", async () => {
        await page.goto(fixtureURL("tooltip--tooltip"));

        await root.evaluate(node => {
            const newAnchor = document.createElement("div");
            newAnchor.id = "new-anchor";

            node.append(newAnchor);
        });

        expect(
            await element.evaluate((node: FASTTooltip) => node.anchorElement?.id)
        ).toBe("anchor-default");

        await element.evaluate(node => {
            node.setAttribute("anchor", "new-anchor");
        });

        expect(
            await element.evaluate((node: FASTTooltip) => node.anchorElement?.id)
        ).toBe("new-anchor");
    });
});
