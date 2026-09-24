import { expect, test } from "@playwright/test";
import type { HydrationMarkersV2Element } from "./main.js";

test.describe("FAST Element 2.x hydration markers", () => {
    test("hydrates the server-rendered view", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/hydration-markers-v2/");
        await hydrationCompleted;

        const element = page.locator("hydration-markers-v2-element");
        const items = element.locator("span");

        expect(
            await element.evaluate(
                (node: HydrationMarkersV2Element) => node.$fastController.isHydrated,
            ),
        ).toBe(true);
        await expect(items).toHaveText(["one", "two"]);
    });

    test("updates repeat content after hydration", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/hydration-markers-v2/");
        await hydrationCompleted;

        const element = page.locator("hydration-markers-v2-element");
        await element.evaluate((node: HydrationMarkersV2Element) => {
            node.items = ["three"];
        });
        await expect(element.locator("span")).toHaveText(["three"]);
    });

    test("connects attribute and event bindings", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/hydration-markers-v2/");
        await hydrationCompleted;

        const element = page.locator("hydration-markers-v2-element");
        const button = element.locator("button");

        expect(
            await element.evaluate(
                (node: HydrationMarkersV2Element) =>
                    node.input === node.shadowRoot!.querySelector("input"),
            ),
        ).toBe(true);

        await element.evaluate((node: HydrationMarkersV2Element) => {
            node.disabled = true;
        });
        await expect(button).toBeDisabled();

        await element.evaluate((node: HydrationMarkersV2Element) => {
            node.disabled = false;
        });
        await button.click();
        expect(
            await element.evaluate((node: HydrationMarkersV2Element) => node.count),
        ).toBe(1);
    });
});
