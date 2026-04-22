import { expect, test } from "@playwright/test";
import type {
    TestElement,
    TestElementEmptyArray,
    TestElementEvent,
    TestElementIntervalUpdates,
} from "./main.js";

test.describe("f-template", async () => {
    test("create a repeat directive over an array of strings with an observable decorator", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/repeat/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");
        const customElementListItems = customElement.locator("li");

        await expect(customElementListItems).toHaveCount(2);
        await expect(customElementListItems).toContainText(["Foo - Bat", "Bar - Bat"]);

        await customElement.evaluate((node: TestElement) => {
            node.list = ["A", "B", "C"];
        });

        await expect(customElementListItems).toHaveCount(3);
        await expect(customElementListItems).toContainText([
            "A - Bat",
            "B - Bat",
            "C - Bat",
        ]);
    });
    test("create a repeat directive over an array of strings with observer map", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/repeat/");
        await hydrationCompleted;

        const customElement = page.locator("test-element-with-observer-map");
        const customElementListItems = customElement.locator("li");

        await expect(customElementListItems).toHaveCount(2);
        await expect(customElementListItems).toContainText(["Foo - Bat", "Bar - Bat"]);

        await customElement.evaluate((node: TestElement) => {
            node.list = ["A", "B", "C"];
        });

        await expect(customElementListItems).toHaveCount(3);
        await expect(customElementListItems).toContainText([
            "A - Bat",
            "B - Bat",
            "C - Bat",
        ]);
    });
    test("create a repeat directive with an inner when", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/repeat/");
        await hydrationCompleted;

        const customElement = page.locator("test-element-inner-when");
        const customElementListItems = customElement.locator("li");

        await expect(customElementListItems).toHaveCount(1);
        await expect(customElementListItems).toContainText("Foo");
    });

    test("should NOT trigger updates when data is deeply merged with same values", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/repeat/");
        await hydrationCompleted;

        const element = page.locator("test-element-interval-updates");

        await expect(
            element.evaluate((node: TestElementIntervalUpdates) => {
                return new Promise((resolve, reject) => {
                    const observer = new MutationObserver(mutations => {
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

                    node.someData = {
                        list1: [{ icon: "repeat" }],
                        list2: [{ icon: "repeat" }],
                    };

                    requestAnimationFrame(() => {
                        resolve("no mutations");
                    });
                });
            }),
        ).resolves.toEqual("no mutations");
    });

    test("should trigger updates when data is deeply merged with different values", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/repeat/");
        await hydrationCompleted;

        const element = page.locator("test-element-interval-updates");

        await expect(
            element.evaluate((node: TestElementIntervalUpdates) => {
                return new Promise(resolve => {
                    const observer = new MutationObserver(mutations => {
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

                    node.someData = {
                        list1: [{ icon: "different" }],
                        list2: [{ icon: "repeat" }],
                    };

                    requestAnimationFrame(() => {
                        // In case no mutations are detected
                        resolve("no mutations");
                    });
                });
            }),
        ).resolves.toEqual("mutations detected");
    });

    test("repeat directive with no item binding should not error", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/repeat/");
        await hydrationCompleted;

        const element = page.locator("test-element-no-item-repeat-binding");
        const listItems = element.locator("li");

        await expect(listItems).toHaveCount(0);

        const commentNodeContent = await element.evaluate((node: TestElement) => {
            const walker = document.createTreeWalker(
                node.shadowRoot!,
                NodeFilter.SHOW_COMMENT,
            );

            const comments: string[] = [];
            let currentNode: Node | null = walker.nextNode();
            while (currentNode) {
                comments.push(currentNode.nodeValue!);
                currentNode = walker.nextNode();
            }

            return comments;
        });

        expect(commentNodeContent).toEqual(["", ""]);

        await element.evaluate((node: TestElement) => {
            node.list = ["A", "B", "C"];
        });

        await expect(listItems).toHaveCount(3);
        await expect(listItems).toContainText(["A", "B", "C"]);
    });

    test("should fire events inside a repeat directive", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/repeat/");
        await hydrationCompleted;
        const element = page.locator("test-element-event");
        const buttons = element.locator("button");

        // Click the pre-hydrated item's button
        await expect(buttons).toHaveCount(1);
        await buttons.nth(0).click();
        await expect(element).toHaveJSProperty("clickCount", 1);

        // Add a new item and click its button
        await element.evaluate((node: TestElementEvent) => {
            node.list = ["A", "B"];
        });
        await expect(buttons).toHaveCount(2);
        await buttons.nth(1).click();
        await expect(element).toHaveJSProperty("clickCount", 2);
    });

    test("repeat directive with an empty array should render no items", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/repeat/");
        await hydrationCompleted;

        const element = page.locator("test-element-empty-array");
        const listItems = element.locator("li");

        await expect(listItems).toHaveCount(0);

        await element.evaluate((node: TestElementEmptyArray) => {
            node.list = ["A", "B", "C"];
        });

        await expect(listItems).toHaveCount(3);
        await expect(listItems).toContainText(["A", "B", "C"]);

        await element.evaluate((node: TestElementEmptyArray) => {
            node.list = [];
        });

        await expect(listItems).toHaveCount(0);
    });
});
