import { Orientation } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("Toolbar", () => {
    test("should have a role of `toolbar`", async ({ page }) => {
        await page.goto(fixtureURL("toolbar--toolbar"));

        const element = page.locator("fast-toolbar");

        await expect(element).toHaveAttribute("role", "toolbar");
    });

    test("should have a default orientation of `horizontal`", async ({ page }) => {
        await page.goto(fixtureURL("toolbar--toolbar"));

        const element = page.locator("fast-toolbar");

        await expect(element).toHaveAttribute("orientation", Orientation.horizontal);
    });

    test("should move focus to its first focusable element when it receives focus", async ({
        page,
    }) => {
        await page.goto(fixtureURL("toolbar--toolbar-button-focus-test"));

        const element = page.locator("fast-toolbar");

        const buttons = element.locator("button");

        const startSlotButton = buttons.filter({ hasText: "Start Slot Button" });

        await page.keyboard.press("Tab");

        await expect(startSlotButton).toBeFocused();
    });

    test("should move focus to next element when keyboard incrementer is pressed", async ({
        page,
    }) => {
        await page.goto(fixtureURL("toolbar--toolbar-button-focus-test"));

        const element = page.locator("fast-toolbar");

        const buttons = element.locator("button");

        await page.keyboard.press("Tab");

        await expect(buttons.filter({ hasText: "Start Slot Button" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 1" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 2" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 3" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 4" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 5" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "End Slot Button" })).toBeFocused();
    });

    test("should skip disabled elements when keyboard incrementer is pressed", async ({
        page,
    }) => {
        await page.goto(fixtureURL("toolbar--toolbar-button-focus-test"));

        const element = page.locator("fast-toolbar");

        const buttons = element.locator("button:not([slot])");

        const startSlotButton = element.locator("button", {
            hasText: "Start Slot Button",
        });

        const endSlotButton = element.locator("button", { hasText: "End Slot Button" });

        await buttons.nth(0).evaluate(node => node.setAttribute("disabled", ""));

        await buttons.nth(2).evaluate(node => node.setAttribute("disabled", ""));

        await buttons.nth(4).evaluate(node => node.setAttribute("disabled", ""));

        await page.keyboard.press("Tab");

        await expect(startSlotButton).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 2" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 4" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(endSlotButton).toBeFocused();
    });

    test("should skip hidden elements when keyboard incrementer is pressed", async ({
        page,
    }) => {
        await page.goto(fixtureURL("toolbar--toolbar-button-focus-test"));

        const element = page.locator("fast-toolbar");

        const buttons = element.locator("button:not([slot])");

        const startSlotButton = element.locator("button", {
            hasText: "Start Slot Button",
        });

        const endSlotButton = element.locator("button", { hasText: "End Slot Button" });

        await buttons.nth(0).evaluate(node => node.setAttribute("hidden", ""));

        await buttons.nth(2).evaluate(node => node.setAttribute("hidden", ""));

        await buttons.nth(4).evaluate(node => node.setAttribute("hidden", ""));

        await page.keyboard.press("Tab");

        await expect(startSlotButton).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 2" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 4" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(endSlotButton).toBeFocused();
    });

    test("should move focus to next element when keyboard incrementer is pressed and start slot content is added after connect", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-toolbar");

        const button1 = element.locator("button", { hasText: "Button 1" });

        const button2 = element.locator("button", { hasText: "Button 2" });

        await page.evaluate(() => {
            const toolbar = document.createElement("fast-toolbar");
            document.getElementById("root")?.append(toolbar);
        });

        await element.evaluate(node => {
            const button = document.createElement("button");
            button.textContent = "Button 1";
            button.slot = "start";
            node.append(button);
        });

        await element.evaluate(node => {
            const button = document.createElement("button");
            button.textContent = "Button 2";
            button.slot = "start";
            node.append(button);
        });

        await page.keyboard.press("Tab");

        await expect(button1).toBeFocused();

        await element.press("ArrowRight");

        await expect(button2).toBeFocused();
    });

    test("should move focus to next element when keyboard incrementer is pressed and end slot content is added after connect", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-toolbar");

        const endSlotButton = element.locator("button", {
            hasText: "End Slot Button",
        });

        const button1 = element.locator("button", { hasText: "Button 1" });

        await page.evaluate(() => {
            const toolbar = document.createElement("fast-toolbar");
            document.getElementById("root")?.append(toolbar);
        });

        await element.evaluate(node => {
            const button = document.createElement("button");
            button.textContent = "Button 1";
            node.append(button);
        });

        await element.evaluate(node => {
            const endSlotButton = document.createElement("button");
            endSlotButton.textContent = "End Slot Button";
            endSlotButton.slot = "end";
            node.append(endSlotButton);
        });

        await page.keyboard.press("Tab");

        await expect(button1).toBeFocused();

        await element.press("ArrowRight");

        await expect(endSlotButton).toBeFocused();
    });

    test("should maintain correct activeIndex when the set of focusable children changes", async ({
        page,
    }) => {
        await page.goto(fixtureURL("toolbar--toolbar-button-focus-test"));

        const element = page.locator("fast-toolbar");

        const button1 = element.locator("button", { hasText: "Button 1" });

        const button2 = element.locator("button", { hasText: "Button 2" });

        const startSlotButton = element.locator("button", {
            hasText: "Start Slot Button",
        });

        await page.keyboard.press("Tab");

        await expect(startSlotButton).toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 0);

        await element.press("ArrowRight");

        await expect(button1).toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 1);

        await button2.evaluate(node => {
            node.setAttribute("disabled", "");
        });

        await expect(button1).toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 1);
    });

    test("should reset activeIndex to 0 when the focused item is no longer focusable", async ({
        page,
    }) => {
        await page.goto(fixtureURL("toolbar--toolbar-button-focus-test"));

        const element = page.locator("fast-toolbar");

        const button1 = element.locator("button", { hasText: "Button 1" });

        const startSlotButton = element.locator("button", {
            hasText: "Start Slot Button",
        });

        await page.keyboard.press("Tab");

        await expect(startSlotButton).toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 0);

        await element.press("ArrowRight");

        await expect(button1).toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 1);

        await button1.evaluate<void, HTMLButtonElement>(node => {
            node.disabled = true;
        });

        // Firefox does not remove focus from the element when it is disabled.
        await page.click("body", { position: { x: 0, y: 0 } });

        await page.keyboard.press("Tab");

        await expect(startSlotButton).toBeFocused();

        await expect(button1).not.toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 0);
    });
});
