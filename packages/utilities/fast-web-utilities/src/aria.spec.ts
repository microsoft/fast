import { expect, test } from "@playwright/test";
import type { Orientation as OrientationType } from "./aria.js";

declare const Orientation: OrientationType;

test.describe("aria-orientation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { Orientation } from "/dist/aria.js";
                globalThis.Orientation = Orientation;
            `,
        });

        await page.waitForFunction(() => "Orientation" in globalThis);
    });

    test("should correctly return orientation values", async ({ page }) => {
        const orientation = await page.evaluate(() => Orientation);

        expect(orientation).toHaveProperty("horizontal", "horizontal");

        expect(orientation).toHaveProperty("vertical", "vertical");
    });
});
