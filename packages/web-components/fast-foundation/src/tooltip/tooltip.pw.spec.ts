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

    test("should hide a focus driven tooltip when another tooltip is hovered", async () => {
        await root.evaluate((node: HTMLElement) => {
            node.innerHTML = /* html */ `
                <fast-tooltip anchor="anchor-default" id="tooltip-default">
                    Tooltip
                </fast-tooltip>
                <fast-tooltip anchor="anchor-hover" id="tooltip-hover">
                    Tooltip
                </fast-tooltip>
                <fast-button id="anchor-default">
                    Focus me
                </fast-button>
                <fast-button id="anchor-hover">
                    Hover me
                </fast-button>
            `;
        });

        const anchorDefault = page.locator("#anchor-default");
        const anchorHover = page.locator("#anchor-hover");
        const tooltipDefault = page.locator("#tooltip-default");

        await expect(tooltipDefault).toHaveJSProperty("visible", false);

        await expect(tooltipDefault).toBeHidden();

        await anchorDefault.focus();

        await expect(tooltipDefault).toHaveJSProperty("visible", true);

        await expect(tooltipDefault).toBeVisible();

        await anchorHover.hover();

        await expect(tooltipDefault).toBeHidden();
    });

    test("should hide a hover driven tooltip when focus moves in the document", async () => {
        await root.evaluate((node: HTMLElement) => {
            node.innerHTML = /* html */ `
                <fast-tooltip anchor="anchor-default" id="tooltip-default">
                    Tooltip
                </fast-tooltip>
                <fast-tooltip anchor="anchor-focus" id="tooltip-focus">
                    Tooltip
                </fast-tooltip>
                <fast-button id="anchor-default">
                    Hover or focus me
                </fast-button>
                <fast-button id="anchor-focus">
                    Hover or focus me
                </fast-button>
            `;
        });

        const anchorDefault = page.locator("#anchor-default");
        const anchorFocus = page.locator("#anchor-focus");
        const tooltipDefault = page.locator("#tooltip-default");

        await expect(tooltipDefault).toHaveJSProperty("visible", false);

        await expect(tooltipDefault).toBeHidden();

        await anchorDefault.hover();

        await expect(tooltipDefault).toHaveJSProperty("visible", true);
        await expect(tooltipDefault).toBeVisible();

        await anchorFocus.focus();
        await expect(tooltipDefault).toHaveJSProperty("visible", false);
        await expect(tooltipDefault).toBeHidden();
    });
});
