import { expect, test } from "@playwright/test";
import type { FASTTooltip } from "./tooltip.js";

test.describe("Tooltip", () => {
    test("should not render the tooltip by default", async ({ page }) => {
        const element = page.locator("fast-tooltip");
        const anchoredRegion = element.locator("fast-anchored-region");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-tooltip></fast-tooltip>
            `;
        });

        await expect(element).toHaveJSProperty("visible", false);

        await expect(anchoredRegion).toBeHidden();
    });

    test("should render the tooltip when the anchor is hovered", async ({ page }) => {
        const element = page.locator("fast-tooltip");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should render the tooltip when the anchor is focused", async ({ page }) => {
        const element = page.locator("fast-tooltip");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test('should render the tooltip when the `show` attribute is "true"', async ({
        page,
    }) => {
        const element = page.locator("fast-tooltip");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test('should not render the tooltip when the `show` attribute is "false"', async ({
        page,
    }) => {
        const element = page.locator("fast-tooltip");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test('should not render the tooltip when the anchor is hovered and `show` is "false"', async ({
        page,
    }) => {
        const element = page.locator("fast-tooltip");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should change anchor element when the `anchor` attribute changes", async ({
        page,
    }) => {
        const element = page.locator("fast-tooltip");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-tooltip anchor="anchor-default">
                    Tooltip
                </fast-tooltip>
                <fast-button id="anchor-default">
                    Hover or focus me
                </fast-button>
            `;

            const newAnchor = document.createElement("div");
            newAnchor.id = "new-anchor";

            node.append(newAnchor);
        });

        expect(
            await element.evaluate<string | undefined, FASTTooltip>(
                node => node.anchorElement?.id
            )
        ).toBe("anchor-default");

        await element.evaluate(node => {
            node.setAttribute("anchor", "new-anchor");
        });

        expect(
            await element.evaluate<string | undefined, FASTTooltip>(
                node => node.anchorElement?.id
            )
        ).toBe("new-anchor");
    });
});
