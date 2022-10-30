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

    test("should set anchored region defaults", async () => {
        await expect(element).toHaveJSProperty("verticalPositioningMode", "dynamic");

        await expect(element).toHaveJSProperty("horizontalPositioningMode", "dynamic");

        await expect(element).toHaveJSProperty("autoUpdateMode", "anchor");

        await expect(element).toHaveJSProperty("verticalDefaultPosition", undefined);

        await expect(element).toHaveJSProperty("horizontalDefaultPosition", "center");

        await expect(element).toHaveJSProperty("verticalScaling", "content");

        await expect(element).toHaveJSProperty("horizontalScaling", "content");
    });

    test("should not render the tooltip by default", async () => {
        await expect(element).toHaveJSProperty("tooltipVisible", false);

        await expect(anchoredRegion).toBeHidden();
    });

    test("should set viewport lock attributes to `undefined` by default", async () => {
        await expect(element).toHaveJSProperty("verticalViewportLock", undefined);

        await expect(element).toHaveJSProperty("horizontalViewportLock", undefined);
    });

    test("should render the tooltip when visible is true", async () => {
        await page.goto(fixtureURL("tooltip--tooltip", { visible: true }));

        await expect(element).toHaveJSProperty("tooltipVisible", true);

        await expect(anchoredRegion).toBeVisible();
    });

    test("should not render the tooltip when visible is false", async () => {
        await page.goto(fixtureURL("tooltip--tooltip", { visible: false }));

        await expect(element).toHaveJSProperty("tooltipVisible", false);

        await expect(anchoredRegion).toBeHidden();
    });

    test("should set anchored region defaults when `position` is set to `top`", async () => {
        await page.goto(fixtureURL("tooltip--tooltip", { position: "top" }));

        await expect(element).toHaveJSProperty(
            "verticalPositioningMode",
            "locktodefault"
        );
        await expect(element).toHaveJSProperty(
            "horizontalPositioningMode",
            "locktodefault"
        );

        await expect(element).toHaveJSProperty("verticalDefaultPosition", "top");
        await expect(element).toHaveJSProperty("horizontalDefaultPosition", "center");

        await expect(element).toHaveJSProperty("verticalScaling", "content");
        await expect(element).toHaveJSProperty("horizontalScaling", "content");
    });

    test("should set anchored region defaults when `position` is set to `bottom`", async () => {
        await page.goto(fixtureURL("tooltip--tooltip", { position: "bottom" }));

        await expect(element).toHaveJSProperty(
            "verticalPositioningMode",
            "locktodefault"
        );
        await expect(element).toHaveJSProperty(
            "horizontalPositioningMode",
            "locktodefault"
        );

        await expect(element).toHaveJSProperty("verticalDefaultPosition", "bottom");
        await expect(element).toHaveJSProperty("horizontalDefaultPosition", "center");

        await expect(element).toHaveJSProperty("verticalScaling", "content");
        await expect(element).toHaveJSProperty("horizontalScaling", "content");
    });

    test("should set anchored region defaults when `position` is set to `left`", async () => {
        await page.goto(fixtureURL("tooltip--tooltip", { position: "left" }));

        await expect(element).toHaveJSProperty(
            "verticalPositioningMode",
            "locktodefault"
        );
        await expect(element).toHaveJSProperty(
            "horizontalPositioningMode",
            "locktodefault"
        );

        await expect(element).toHaveJSProperty("verticalDefaultPosition", "center");
        await expect(element).toHaveJSProperty("horizontalDefaultPosition", "left");

        await expect(element).toHaveJSProperty("verticalScaling", "content");
        await expect(element).toHaveJSProperty("horizontalScaling", "content");
    });

    test("should set anchored region defaults when `position` is set to `right`", async () => {
        await page.goto(fixtureURL("tooltip--tooltip", { position: "right" }));

        await expect(element).toHaveJSProperty(
            "verticalPositioningMode",
            "locktodefault"
        );
        await expect(element).toHaveJSProperty(
            "horizontalPositioningMode",
            "locktodefault"
        );

        await expect(element).toHaveJSProperty("verticalDefaultPosition", "center");
        await expect(element).toHaveJSProperty("horizontalDefaultPosition", "right");

        await expect(element).toHaveJSProperty("verticalScaling", "content");
        await expect(element).toHaveJSProperty("horizontalScaling", "content");
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
