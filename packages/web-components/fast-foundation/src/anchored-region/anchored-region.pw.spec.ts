import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTAnchoredRegion } from "./anchored-region.js";

test.describe("Anchored Region", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-anchored-region");

        root = page.locator("#root");

        await page.goto(fixtureURL("anchored-region--anchored-region"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should set positioning modes to 'uncontrolled' by default", async () => {
        await root.evaluate(node => {
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

    test("should assign anchor and viewport elements by id", async () => {
        const anchorId = "anchor";

        await root.evaluate(
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

    test("should be sized to match content by default", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-anchored-region>
                    <div id="content" style="width: 100px; height: 100px;"></div>
                </fast-anchored-region>
            `;
        });

        const elementClientHeight = await element.evaluate(node => node.clientHeight);

        const content = element.locator("#content");

        const contentClientHeight = await content.evaluate(node => node.clientHeight);

        expect(elementClientHeight).toBe(contentClientHeight);
    });
});
