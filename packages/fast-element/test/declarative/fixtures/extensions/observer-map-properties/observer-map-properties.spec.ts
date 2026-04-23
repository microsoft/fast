import { expect, test } from "@playwright/test";

test.describe("ObserverMap properties", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/fixtures/extensions/observer-map-properties/");
        await page.waitForSelector("selective-obs-element");
    });

    test.describe("selective observation", () => {
        test("should render initial values", async ({ page }) => {
            const el = page.locator("selective-obs-element");

            await expect(el.locator(".user-name")).toHaveText("Alice");
            await expect(el.locator(".user-age")).toHaveText("28");
            await expect(el.locator(".user-location-city")).toHaveText("New York");
            await expect(el.locator(".active-chart")).toHaveText("line");
            await expect(el.locator(".analytics-summary")).toHaveText("good");
        });

        test("should update observed property: user.name", async ({ page }) => {
            const el = page.locator("selective-obs-element");
            await el.locator("button:has-text('Update Name')").click();

            await expect(el.locator(".user-name")).toHaveText("Bob");
        });

        test("should update observed property: user.age", async ({ page }) => {
            const el = page.locator("selective-obs-element");
            await el.locator("button:has-text('Update Age')").click();

            await expect(el.locator(".user-age")).toHaveText("29");
        });

        test("should NOT update excluded property: user.history (false)", async ({
            page,
        }) => {
            const el = page.locator("selective-obs-element");
            const initialValue = await el.locator(".user-history-visits").textContent();

            await el.locator("button:has-text('Update History')").click();

            // Wait a frame
            await page.evaluate(
                () => new Promise(resolve => requestAnimationFrame(() => resolve(true))),
            );

            // The text should NOT have updated because history is excluded
            await expect(el.locator(".user-history-visits")).toHaveText(initialValue!);
        });

        test("should update observed property: user.location (true)", async ({
            page,
        }) => {
            const el = page.locator("selective-obs-element");
            await el.locator("button:has-text('Update Location')").click();

            await expect(el.locator(".user-location-city")).toHaveText("London");
        });

        test("should NOT update unlisted root property: settings", async ({ page }) => {
            const el = page.locator("selective-obs-element");
            const initialValue = await el.locator(".settings-theme").textContent();

            await el.locator("button:has-text('Update Settings')").click();

            await page.evaluate(
                () => new Promise(resolve => requestAnimationFrame(() => resolve(true))),
            );

            // settings is not listed in properties → skipped
            await expect(el.locator(".settings-theme")).toHaveText(initialValue!);
        });

        test("should update observed property inside $observe:false branch: analytics.charts.activeChart", async ({
            page,
        }) => {
            const el = page.locator("selective-obs-element");
            await el.locator("button:has-text('Update Active Chart')").click();

            await expect(el.locator(".active-chart")).toHaveText("bar");
        });

        test("should NOT update excluded property: analytics.charts.cachedData (inherits $observe:false)", async ({
            page,
        }) => {
            const el = page.locator("selective-obs-element");
            const initialValue = await el.locator(".cached-data").textContent();

            await el.locator("button:has-text('Update Cached Data')").click();

            await page.evaluate(
                () => new Promise(resolve => requestAnimationFrame(() => resolve(true))),
            );

            // cachedData inherits $observe:false from charts node
            await expect(el.locator(".cached-data")).toHaveText(initialValue!);
        });

        test("should update observed property: analytics.summary (true)", async ({
            page,
        }) => {
            const el = page.locator("selective-obs-element");
            await el.locator("button:has-text('Update Summary')").click();

            await expect(el.locator(".analytics-summary")).toHaveText("excellent");
        });
    });

    test.describe("empty config object (observe all)", () => {
        test("should update user.name with observerMap: {}", async ({ page }) => {
            const el = page.locator("all-obs-element");
            await el.locator("button:has-text('Update Name')").click();

            await expect(el.locator(".user-name")).toHaveText("Bob");
        });

        test("should update settings.theme with observerMap: {}", async ({ page }) => {
            const el = page.locator("all-obs-element");
            await el.locator("button:has-text('Update Settings')").click();

            await expect(el.locator(".settings-theme")).toHaveText("light");
        });
    });

    test.describe("empty properties object (observe nothing)", () => {
        test("should NOT update user.name with properties: {}", async ({ page }) => {
            const el = page.locator("empty-props-element");
            const initialValue = await el.locator(".user-name").textContent();

            await el.locator("button:has-text('Update Name')").click();

            await page.evaluate(
                () => new Promise(resolve => requestAnimationFrame(() => resolve(true))),
            );

            await expect(el.locator(".user-name")).toHaveText(initialValue!);
        });

        test("should NOT update settings.theme with properties: {}", async ({ page }) => {
            const el = page.locator("empty-props-element");
            const initialValue = await el.locator(".settings-theme").textContent();

            await el.locator("button:has-text('Update Settings')").click();

            await page.evaluate(
                () => new Promise(resolve => requestAnimationFrame(() => resolve(true))),
            );

            await expect(el.locator(".settings-theme")).toHaveText(initialValue!);
        });
    });

    test.describe("array with selective observation", () => {
        test("should render initial array items", async ({ page }) => {
            const el = page.locator("array-selective-element");

            await expect(el.locator(".item-text").first()).toHaveText("item-1");
            await expect(el.locator(".item-text").nth(1)).toHaveText("item-2");
        });

        test("should update item text in observed array", async ({ page }) => {
            const el = page.locator("array-selective-element");
            await el.locator("button:has-text('Update Item Text')").click();

            await expect(el.locator(".item-text").first()).toHaveText("updated-item-1");
        });

        test("should add items to observed array", async ({ page }) => {
            const el = page.locator("array-selective-element");

            await expect(el.locator(".item-row")).toHaveCount(2);

            await el.locator("button:has-text('Add Item')").click();

            await expect(el.locator(".item-row")).toHaveCount(3);
            await expect(el.locator(".item-text").nth(2)).toHaveText("item-3");
        });
    });
});
