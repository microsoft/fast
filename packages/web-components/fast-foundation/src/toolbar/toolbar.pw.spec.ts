import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import { ToolbarOrientation } from "./toolbar.options.js";

test.describe("Toolbar", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-toolbar");

        root = page.locator("#root");

        await page.goto(fixtureURL("toolbar--toolbar"));
    });

    test("should have a role of `toolbar`", async () => {
        await expect(element).toHaveAttribute("role", "toolbar");
    });

    test("should have a default orientation of `horizontal`", async () => {
        await expect(element).toHaveAttribute(
            "orientation",
            ToolbarOrientation.horizontal
        );
    });

    test("should move focus to its first focusable element when it receives focus", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar>
                    <button>Button 1</button>
                    <button>Button 2</button>
                    <button>Button 3</button>
                    <button>Button 4</button>
                    <button>Button 5</button>
                    <button slot="start">Start Slot Button</button>
                    <button slot="end">End Slot Button</button>
                </fast-toolbar>
            `;
        });

        const element = page.locator("fast-toolbar");

        const buttons = element.locator("button");

        const firstButton = buttons.filter({ hasText: "Start Slot Button" });

        await element.focus();

        await expect(firstButton).toBeFocused();
    });

    test("should move focus to next element when keyboard incrementer is pressed", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar>
                    <button slot="start">Start Slot Button</button>
                    <button>Button 1</button>
                    <button>Button 2</button>
                    <button>Button 3</button>
                    <button>Button 4</button>
                    <button>Button 5</button>
                    <button slot="end">End Slot Button</button>
                </fast-toolbar>
            `;
        });

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
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar>
                    <button slot="start">Start Slot Button</button>
                    <button>Button 1</button>
                    <button>Button 2</button>
                    <button>Button 3</button>
                    <button>Button 4</button>
                    <button>Button 5</button>
                    <button slot="end">End Slot Button</button>
                </fast-toolbar>
            `;
        });

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
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar>
                    <button slot="start">Start Slot Button</button>
                    <button>Button 1</button>
                    <button>Button 2</button>
                    <button>Button 3</button>
                    <button>Button 4</button>
                    <button>Button 5</button>
                    <button slot="end">End Slot Button</button>
                </fast-toolbar>
            `;
        });

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
        await root.evaluate(node => {
            node.innerHTML = /* html */ `<fast-toolbar></fast-toolbar>`;
        });

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
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar></fast-toolbar>
            `;
        });

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
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar>
                    <button slot="start">Start Slot Button</button>
                    <button>Button 1</button>
                    <button>Button 2</button>
                    <button>Button 3</button>
                    <button>Button 4</button>
                    <button>Button 5</button>
                    <button slot="end">End Slot Button</button>
                </fast-toolbar>
            `;
        });

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
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar>
                    <button slot="start">Start Slot Button</button>
                    <button>Button 1</button>
                    <button>Button 2</button>
                    <button>Button 3</button>
                    <button>Button 4</button>
                    <button>Button 5</button>
                    <button slot="end">End Slot Button</button>
                </fast-toolbar>
            `;
        });

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

    test("should update activeIndex when an element within the toolbar is clicked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar>
                    <button slot="start">Start Slot Button</button>
                    <button>Button 1</button>
                    <button>Button 2</button>
                    <button>Button 3</button>
                    <button slot="end">End Slot Button</button>
                </fast-toolbar>
            `;
        });

        const button2 = element.locator("button", { hasText: "Button 2" });

        const startSlotButton = element.locator("button", {
            hasText: "Start Slot Button",
        });

        await element.focus();

        await expect(startSlotButton).toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 0);

        await button2.click();

        await expect(button2).toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 2);
    });

    test("should update activeIndex when a nested element within the toolbar is clicked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar>
                    <button slot="start">Start Slot Button</button>
                    <button>Button 1</button>
                    <button>
                        Button 2
                        <div>more button content</div>
                    </button>
                    <button>Button 3</button>
                    <button slot="end">End Slot Button</button>
                </fast-toolbar>
            `;
        });

        const button2 = element.locator("button", { hasText: "Button 2" });

        const button2InnerContent = button2.locator("div");

        const startSlotButton = element.locator("button", {
            hasText: "Start Slot Button",
        });

        await element.focus();

        await expect(startSlotButton).toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 0);

        await button2InnerContent.click();

        await expect(button2).toBeFocused();

        await expect(element).toHaveJSProperty("activeIndex", 2);
    });

    test("should focus most recently focused item when toolbar receives focus", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar>
                    <button slot="start">Start Slot Button</button>
                    <button>Button 1</button>
                    <button>Button 2</button>
                    <button>Button 3</button>
                    <button>Button 4</button>
                    <button>Button 5</button>
                    <button slot="end">End Slot Button</button>
                </fast-toolbar>
                <button>Button Outside Toolbar</button>
            `;
        });
        const button2 = element.locator("button", { hasText: "Button 2" });

        const buttonOutsideToolbar = page.locator("button", { hasText: "Button Outside Toolbar"});

        await button2.click();
        await expect(button2).toBeFocused();

        await buttonOutsideToolbar.click();
        await expect(buttonOutsideToolbar).toBeFocused();

        await element.focus();

        await expect(button2).toBeFocused();
    });

    test("should focus clicked item when focus enters toolbar by clicking an item that is not the most recently focused item", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar>
                    <button slot="start">Start Slot Button</button>
                    <button>Button 1</button>
                    <button>Button 2</button>
                    <button>Button 3</button>
                    <button>Button 4</button>
                    <button>Button 5</button>
                    <button slot="end">End Slot Button</button>
                </fast-toolbar>
                <button>Button Outside Toolbar</button>
            `;
        });
        const button2 = element.locator("button", { hasText: "Button 2" });

        const button3 = element.locator("button", { hasText: "Button 3" });

        const buttonOutsideToolbar = page.locator("button", { hasText: "Button Outside Toolbar"});

        await button2.click();
        await expect(button2).toBeFocused();

        await buttonOutsideToolbar.click();
        await expect(buttonOutsideToolbar).toBeFocused();

        await button3.click();
        await expect(button3).toBeFocused();
    });

    test("should not focus clicked item when focus is moved outside of the toolbar by an event handler", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-toolbar>
                    <button slot="start">Start Slot Button</button>
                    <button id="toolbar-button-1">Button 1</button>
                    <button id="toolbar-button-1">Button 2</button>
                    <button>Button 3</button>
                    <button>Button 4</button>
                    <button>Button 5</button>
                    <button slot="end">End Slot Button</button>
                </fast-toolbar>
                <button id="outside-button">Button Outside Toolbar</button>
            `;
        });

        const buttonOutsideToolbar = page.locator("button", { hasText: "Button Outside Toolbar"});
        const button1 = element.locator("button", { hasText: "Button 1" });
        const button2 = element.locator("button", { hasText: "Button 2" });
        const button3 = element.locator("button", { hasText: "Button 3" });

        const wasButton1Clicked = await button1.evaluate(node => new Promise(resolve => {
                node.addEventListener("mousedown", (e: MouseEvent) => {
                    document.querySelector<HTMLButtonElement>('#outside-button')?.focus();
                    resolve(true)
                })

                node.dispatchEvent(new MouseEvent("mousedown", {bubbles: true, cancelable: true}))
            }))

        expect.soft(wasButton1Clicked).toEqual(true)
        await expect.soft(buttonOutsideToolbar).toBeFocused();
        buttonOutsideToolbar.evaluate(node => {node.blur()})

        const [wasButton2Clicked] = await Promise.all([
            button2.evaluate(node => new Promise(resolve => {
                node.addEventListener("click", () => {
                    document.querySelector<HTMLButtonElement>('#outside-button')?.focus();
                    resolve(true)
                })
            })),
            button2.click()
        ])

        expect.soft(wasButton2Clicked).toEqual(true)
        await expect.soft(buttonOutsideToolbar).toBeFocused();
        buttonOutsideToolbar.evaluate(node => {node.blur()})

        const [wasButton3Clicked] = await Promise.all([
            button3.evaluate(node => new Promise(resolve => {
                node.addEventListener("click", () => {
                    resolve(true)
                })
            })),
            button3.click()
        ])

        expect.soft(wasButton3Clicked).toEqual(true)
        await expect.soft(buttonOutsideToolbar).not.toBeFocused();
        await expect(button3).toBeFocused();
    });
});
