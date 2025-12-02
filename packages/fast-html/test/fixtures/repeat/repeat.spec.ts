import { expect, test } from "@playwright/test";
import type { TestElement, TestElementIntervalUpdates } from "./main.js";

test.describe("f-template", async () => {
    test("create a repeat directive", async ({ page }) => {
        await page.goto("/fixtures/repeat/");

        const customElement = page.locator("test-element");
        let customElementListItems = customElement.locator("li");

        await expect(customElementListItems).toHaveCount(2);
        await expect(customElementListItems).toContainText(["Foo - Bat", "Bar - Bat"]);

        await customElement.evaluate((node: TestElement) => {
            node.list = [
                "A",
                "B",
                "C"
            ];
        });

        await expect(customElementListItems).toHaveCount(3);
        await expect(customElementListItems).toContainText(["A - Bat", "B - Bat", "C - Bat"]);
    });
    test("create a repeat directive with an inner when", async ({ page }) => {
        await page.goto("/fixtures/repeat/");

        const customElement = page.locator("test-element-inner-when");
        const  customElementListItems = customElement.locator("li");

        await expect(customElementListItems).toHaveCount(1);
        await expect(customElementListItems).toContainText("Foo");
    });

    test("should NOT trigger updates when data is deeply merged with same values", async ({ page }) => {
        await page.goto("/fixtures/repeat/");

        const element = page.locator("test-element-interval-updates");

        await expect(element.evaluate((node: TestElementIntervalUpdates) => {
            return new Promise((resolve, reject) => {
                const observer = new MutationObserver((mutations) => {
                    if (mutations.length > 0) {
                        reject("Mutation detected");
                    }
                });

                observer.observe(node.shadowRoot!, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    characterDataOldValue: true,
                    subtree: true,
                });

                node.someData = { list1: [{ icon: "repeat" }], list2: [{ icon: "repeat" }] };

                requestAnimationFrame(() => {
                    resolve("no mutations");
                });
            });
        })).resolves.toEqual("no mutations");
    });

    test("should trigger updates when data is deeply merged with different values", async ({ page }) => {
        await page.goto("/fixtures/repeat/");

        const element = page.locator("test-element-interval-updates");

        await expect(element.evaluate((node: TestElementIntervalUpdates) => {
            return new Promise((resolve) => {
                const observer = new MutationObserver((mutations) => {
                    if (mutations.length > 0) {
                        resolve("mutations detected");
                    }
                });

                observer.observe(node.shadowRoot!, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    characterDataOldValue: true,
                    subtree: true,
                });

                node.someData = { list1: [{ icon: "different" }], list2: [{ icon: "repeat" }] };

                requestAnimationFrame(() => {
                    // In case no mutations are detected
                    resolve("no mutations");
                });
            });
        })).resolves.toEqual("mutations detected");
    });
});
