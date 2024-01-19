import { expect, test } from "@playwright/test";
import type { FASTAnchoredRegion } from "./anchored-region.js";

test.describe("Anchored Region", () => {
    test("should set positioning modes to 'uncontrolled' by default", async ({
        page,
    }) => {
        const element = page.locator("fast-anchored-region");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-anchored-region></fast-anchored-region>
            `;
        });

        await expect(element).toHaveJSProperty("verticalPositioningMode", "uncontrolled");

        await expect(element).toHaveJSProperty(
            "horizontalPositioningMode",
            "uncontrolled"
        );
    });

    test("should assign anchor and viewport elements by id", async ({ page }) => {
        const element = page.locator("fast-anchored-region");
        const anchorId = "anchor";

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(
            (node, { anchorId }) => {
                node.innerHTML = /* html */ `
                    <div id="${anchorId}"></div>
                    <fast-anchored-region anchor="${anchorId}" viewport="${anchorId}"></fast-anchored-region>
                `;
            },
            { anchorId }
        );

        await expect(element).toHaveAttribute("anchor", anchorId);

        await expect(element).toHaveJSProperty("anchor", anchorId);

        const anchorElementId = await element.evaluate(
            (node: FASTAnchoredRegion) => node.anchorElement?.id
        );

        expect(anchorElementId).toBe(anchorId);
    });

    test("should be sized to match content by default", async ({ page }) => {
        const element = page.locator("fast-anchored-region");
        const content = element.locator("#content");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-anchored-region>
                    <div id="content" style="width: 100px; height: 100px;"></div>
                </fast-anchored-region>
            `;
        });

        const elementClientHeight = await element.evaluate(node => node.clientHeight);

        const contentClientHeight = await content.evaluate(node => node.clientHeight);

        expect(elementClientHeight).toBe(contentClientHeight);
    });
});
