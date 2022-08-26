import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTAnchoredRegion } from "./anchored-region.js";

test.describe("Anchored Region", () => {
    test("should set positioning modes to 'uncontrolled' by default", async ({
        page,
    }) => {
        await page.goto(fixtureURL("anchored-region--anchored-region"));

        const element = page.locator("fast-anchored-region");

        await expect(element).toHaveJSProperty("verticalPositioningMode", "uncontrolled");

        await expect(element).toHaveJSProperty(
            "horizontalPositioningMode",
            "uncontrolled"
        );
    });

    test("should assign anchor and viewport elements by id", async ({ page }) => {
        const anchorId = "anchor";

        await page.goto(fixtureURL("anchored-region--anchored-region", { anchorId }));

        const element = page.locator("fast-anchored-region");

        await expect(element).toHaveAttribute("anchor", anchorId);

        await expect(element).toHaveJSProperty("anchor", anchorId);

        const anchorElementId = await element.evaluate(
            (node: FASTAnchoredRegion) => node.anchorElement?.id
        );

        expect(anchorElementId).toBe(anchorId);
    });

    test("should be sized to match content by default", async ({ page }) => {
        await page.goto(fixtureURL("anchored-region--anchored-region"));

        const element = page.locator("fast-anchored-region");

        const elementClientHeight = await element.evaluate(node => node.clientHeight);

        const content = element.locator("#content");

        const contentClientHeight = await content.evaluate(node => node.clientHeight);

        expect(elementClientHeight).toBe(contentClientHeight);
    });
});
