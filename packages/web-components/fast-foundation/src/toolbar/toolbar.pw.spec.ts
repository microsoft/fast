import { Orientation } from "@microsoft/fast-web-utilities";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("Toolbar", () => {
    let page: Page;
    let element: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-toolbar");

        await page.goto(fixtureURL("toolbar--toolbar"));
    });

    test("should have a role of `toolbar`", async () => {
        await expect(element).toHaveAttribute("role", "toolbar");
    });

    test("should have a default orientation of `horizontal`", async () => {
        await expect(element).toHaveAttribute("orientation", Orientation.horizontal);
    });

    test("should move focus to its first focusable element when it receives focus", async () => {
        await page.setContent(/* html */ `
            <fast-toolbar>
                <button>Button 1</button>
                <button>Button 2</button>
                <button>Button 3</button>
                <button>Button 4</button>
                <button>Button 5</button>
                <button slot="start">Start Slot Button</button>
                <button slot="end">End Slot Button</button>
            </fast-toolbar>
        `);

        const element = page.locator("fast-toolbar");

        const buttons = element.locator("button");

        const firstButton = buttons.filter({ hasText: "Start Slot Button" });

        await element.focus();

        await expect(firstButton).toBeFocused();
    });

    test("should move focus to next element when keyboard incrementer is pressed", async () => {
        await page.setContent(/* html */ `
            <fast-toolbar>
                <button slot="start">Start Slot Button</button>
                <button>Button 1</button>
                <button>Button 2</button>
                <button>Button 3</button>
                <button>Button 4</button>
                <button>Button 5</button>
                <button slot="end">End Slot Button</button>
            </fast-toolbar>
        `);

        const buttons = element.locator("button");

        await element.focus();

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

    test("should skip disabled elements when keyboard incrementer is pressed", async () => {
        await page.setContent(/* html */ `
            <fast-toolbar>
                <button slot="start">Start Slot Button</button>
                <button>Button 1</button>
                <button>Button 2</button>
                <button>Button 3</button>
                <button>Button 4</button>
                <button>Button 5</button>
                <button slot="end">End Slot Button</button>
            </fast-toolbar>
        `);

        const buttons = element.locator("button:not([slot])");

        const startSlotButton = element.locator("button", {
            hasText: "Start Slot Button",
        });

        const endSlotButton = element.locator("button", { hasText: "End Slot Button" });

        await buttons.nth(0).evaluate(node => node.setAttribute("disabled", ""));

        await buttons.nth(2).evaluate(node => node.setAttribute("disabled", ""));

        await buttons.nth(4).evaluate(node => node.setAttribute("disabled", ""));

        await element.focus();

        await expect(startSlotButton).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 2" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 4" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(endSlotButton).toBeFocused();
    });

    test("should skip hidden elements when keyboard incrementer is pressed", async () => {
        await page.setContent(/* html */ `
            <fast-toolbar>
                <button slot="start">Start Slot Button</button>
                <button>Button 1</button>
                <button>Button 2</button>
                <button>Button 3</button>
                <button>Button 4</button>
                <button>Button 5</button>
                <button slot="end">End Slot Button</button>
            </fast-toolbar>
        `);

        const buttons = element.locator("button:not([slot])");

        const startSlotButton = element.locator("button", {
            hasText: "Start Slot Button",
        });

        const endSlotButton = element.locator("button", { hasText: "End Slot Button" });

        await buttons.nth(0).evaluate(node => node.setAttribute("hidden", ""));

        await buttons.nth(2).evaluate(node => node.setAttribute("hidden", ""));

        await buttons.nth(4).evaluate(node => node.setAttribute("hidden", ""));

        await element.focus();

        await expect(startSlotButton).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 2" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(buttons.filter({ hasText: "Button 4" })).toBeFocused();

        await element.press("ArrowRight");

        await expect(endSlotButton).toBeFocused();
    });

    test("should move focus to next element when keyboard incrementer is pressed and start slot content is added after connect", async () => {
        await page.setContent(/* html */ `<fast-toolbar></fast-toolbar>`);

        const button1 = element.locator("button", { hasText: "Button 1" });

        const button2 = element.locator("button", { hasText: "Button 2" });

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

        await element.focus();

        await expect(button1).toBeFocused();

        await element.press("ArrowRight");

        await expect(button2).toBeFocused();
    });

    test("should move focus to next element when keyboard incrementer is pressed and end slot content is added after connect", async () => {
        await page.setContent(/* html */ `<fast-toolbar></fast-toolbar>`);

        const endSlotButton = element.locator("button", {
            hasText: "End Slot Button",
        });

        const button1 = element.locator("button", { hasText: "Button 1" });

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

        await element.focus();

        await expect(button1).toBeFocused();

        await element.press("ArrowRight");

        await expect(endSlotButton).toBeFocused();
    });

    test("should maintain correct activeIndex when the set of focusable children changes", async () => {
        await page.setContent(/* html */ `
            <fast-toolbar>
                <button slot="start">Start Slot Button</button>
                <button>Button 1</button>
                <button>Button 2</button>
                <button>Button 3</button>
                <button>Button 4</button>
                <button>Button 5</button>
                <button slot="end">End Slot Button</button>
            </fast-toolbar>
        `);

        const button1 = element.locator("button", { hasText: "Button 1" });

        const button2 = element.locator("button", { hasText: "Button 2" });

        const startSlotButton = element.locator("button", {
            hasText: "Start Slot Button",
        });

        await element.focus();

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

    test("should reset activeIndex to 0 when the focused item is no longer focusable", async () => {
        await page.setContent(/* html */ `
            <fast-toolbar>
                <button slot="start">Start Slot Button</button>
                <button>Button 1</button>
                <button>Button 2</button>
                <button>Button 3</button>
                <button>Button 4</button>
                <button>Button 5</button>
                <button slot="end">End Slot Button</button>
            </fast-toolbar>
        `);

        const button1 = element.locator("button", { hasText: "Button 1" });

        const startSlotButton = element.locator("button", {
            hasText: "Start Slot Button",
        });

        await element.focus();

        await expect(startSlotButton).toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 0);

        await element.press("ArrowRight");

        await expect(button1).toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 1);

        await button1.evaluate<void, HTMLButtonElement>(node => {
            node.disabled = true;
        });

        await element.focus();

        await expect(startSlotButton).toBeFocused();

        await expect(button1).not.toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 0);
    });
});
