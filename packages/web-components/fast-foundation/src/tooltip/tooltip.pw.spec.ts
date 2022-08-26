import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTooltip } from "./tooltip.js";

test.describe("Tooltip", () => {
    test("should not render the tooltip by default", async ({ page }) => {
        await page.goto(fixtureURL("tooltip--tooltip", { delay: 0 }));

        const element = page.locator("fast-tooltip");

        const anchoredRegion = element.locator("fast-anchored-region");

        await expect(element).toHaveJSProperty("tooltipVisible", false);

        await expect(anchoredRegion).toBeHidden();
    });

    test("should render the tooltip when visible is true", async ({ page }) => {
        await page.goto(fixtureURL("tooltip--tooltip", { delay: 0, visible: true }));

        const element = page.locator("fast-tooltip");

        const anchoredRegion = element.locator("fast-anchored-region");

        await expect(element).toHaveJSProperty("tooltipVisible", true);

        await expect(anchoredRegion).toBeVisible();
    });

    test("should not render the tooltip when visible is false", async ({ page }) => {
        await page.goto(fixtureURL("tooltip--tooltip", { delay: 0, visible: false }));

        const element = page.locator("fast-tooltip");

        const anchoredRegion = element.locator("fast-anchored-region");

        await expect(element).toHaveJSProperty("tooltipVisible", false);

        await expect(anchoredRegion).toBeHidden();
    });

    test("should set anchored region defaults", async ({ page }) => {
        await page.goto(fixtureURL("tooltip--tooltip"));

        const element = page.locator("fast-tooltip");

        await expect(element).toHaveJSProperty("verticalPositioningMode", "dynamic");

        await expect(element).toHaveJSProperty("horizontalPositioningMode", "dynamic");

        await expect(element).toHaveJSProperty("autoUpdateMode", "anchor");

        await expect(element).toHaveJSProperty("verticalDefaultPosition", undefined);

        await expect(element).toHaveJSProperty("horizontalDefaultPosition", "center");

        await expect(element).toHaveJSProperty("verticalScaling", "content");

        await expect(element).toHaveJSProperty("horizontalScaling", "content");
    });

    test("should set anchored region defaults when `position` is set to `top`", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tooltip--tooltip", { position: "top" }));

        const element = page.locator("fast-tooltip");

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

    test("should set anchored region defaults when `position` is set to `bottom`", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tooltip--tooltip", { position: "bottom" }));

        const element = page.locator("fast-tooltip");

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

    test("should set anchored region defaults when `position` is set to `left`", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tooltip--tooltip", { position: "left" }));

        const element = page.locator("fast-tooltip");

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

    test("should set anchored region defaults when `position` is set to `right`", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tooltip--tooltip", { position: "right" }));

        const element = page.locator("fast-tooltip");

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

    test("should set viewport lock attributes to `undefined` by default", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tooltip--tooltip"));

        const element = page.locator("fast-tooltip");

        await expect(element).toHaveJSProperty("verticalViewportLock", undefined);

        await expect(element).toHaveJSProperty("horizontalViewportLock", undefined);
    });

    test("should change anchor element when the `anchor` attribute changes", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tooltip--tooltip"));

        const element = page.locator("fast-tooltip");

        await page.evaluate(() => {
            const newAnchor = document.createElement("div");
            newAnchor.id = "new-anchor";
            document.getElementById("root")?.append(newAnchor);
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
