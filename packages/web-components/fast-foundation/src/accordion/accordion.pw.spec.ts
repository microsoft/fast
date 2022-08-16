import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import { AccordionExpandMode } from "./accordion.options.js";

test.describe("Accordion", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-accordion");

        root = page.locator("#root");

        await page.goto(fixtureURL("accordion--accordion"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should set an expand mode of `multi` when passed to the `expand-mode` attribute", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion expand-mode="multi">
                    <fast-accordion-item>
                        <span slot="heading">Heading 1</span>
                        <div>Content 1</div>
                    </fast-accordion-item>
                    <fast-accordion-item>
                        <span slot="heading">Heading 2</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                </fast-accordion>
            `;
        });

        await expect(element).toHaveAttribute("expand-mode", AccordionExpandMode.multi);
    });

    test("should set an expand mode of `single` when passed to the `expand-mode` attribute", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion expand-mode="single">
                    <fast-accordion-item>
                        <span slot="heading">Heading 1</span>
                        <div>Content 1</div>
                    </fast-accordion-item>
                    <fast-accordion-item>
                        <span slot="heading">Heading 2</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                </fast-accordion>
            `;
        });

        await expect(element).toHaveAttribute("expand-mode", AccordionExpandMode.single);
    });

    test("should set a default expand mode of `multi` when `expand-mode` attribute is not passed", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion>
                    <fast-accordion-item>
                        <span slot="heading">Heading 1</span>
                        <div>Content 1</div>
                    </fast-accordion-item>
                    <fast-accordion-item>
                        <span slot="heading">Heading 2</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                </fast-accordion>
            `;
        });

        await expect(element).toHaveJSProperty("expandmode", AccordionExpandMode.multi);

        await expect(element).toHaveAttribute("expand-mode", AccordionExpandMode.multi);
    });

    test("should expand/collapse items when clicked in multi mode", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion expand-mode="multi">
                    <fast-accordion-item>
                        <span slot="heading">Heading 1</span>
                        <div>Content 1</div>
                    </fast-accordion-item>
                    <fast-accordion-item>
                        <span slot="heading">Heading 2</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                </fast-accordion>
            `;
        });

        const items = element.locator("fast-accordion-item");

        await items.nth(0).click();

        await items.nth(1).click();

        await expect(items.nth(0)).toHaveAttribute("expanded", "");

        await expect(items.nth(1)).toHaveAttribute("expanded", "");
    });

    test("should only have one expanded item in single mode", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion expand-mode="single">
                    <fast-accordion-item>
                        <span slot="heading">Heading 1</span>
                        <div>Content 1</div>
                    </fast-accordion-item>
                    <fast-accordion-item>
                        <span slot="heading">Heading 2</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                </fast-accordion>
            `;
        });

        const items = element.locator("fast-accordion-item");

        const firstItem = items.nth(0);

        const secondItem = items.nth(1);

        await firstItem.click();

        await expect(firstItem).toHaveBooleanAttribute("expanded");

        await expect(secondItem).not.toHaveBooleanAttribute("expanded");

        const secondItemButton = secondItem.locator(`[part="button"]`);

        await secondItemButton.click();

        await secondItemButton.evaluate(node => {
            node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        await expect(firstItem).not.toHaveBooleanAttribute("expanded");

        await expect(secondItem).toHaveBooleanAttribute("expanded");
    });

    test("should set the expanded items' button to aria-disabled when in single expand mode", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion expand-mode="single">
                    <fast-accordion-item>
                        <span slot="heading">Heading 1</span>
                        <div>Content 1</div>
                    </fast-accordion-item>
                    <fast-accordion-item>
                        <span slot="heading">Heading 2</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                </fast-accordion>
            `;
        });

        const items = element.locator("fast-accordion-item");

        const firstItem = items.nth(0);

        const secondItem = items.nth(1);

        await firstItem.click();

        await expect(firstItem).toHaveBooleanAttribute("expanded");

        await expect(firstItem.locator("button")).toHaveAttribute(
            "aria-disabled",
            "true"
        );

        await secondItem.click();

        await expect(firstItem).not.toHaveBooleanAttribute("expanded");

        await expect(firstItem.locator("button")).not.toHaveAttribute(
            "aria-disabled",
            "true"
        );
        await expect(firstItem.locator("button")).not.toHaveAttribute(
            "aria-disabled",
            "false"
        );

        await expect(secondItem).toHaveBooleanAttribute("expanded");

        await expect(secondItem.locator("button")).toHaveAttribute(
            "aria-disabled",
            "true"
        );
    });

    test("should remove an expanded items' expandbutton aria-disabled attribute when expand mode changes from single to multi", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion expand-mode="single">
                    <fast-accordion-item>
                        <span slot="heading">Heading 1</span>
                        <div>Content 1</div>
                    </fast-accordion-item>
                    <fast-accordion-item>
                        <span slot="heading">Heading 2</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                </fast-accordion>
            `;
        });

        const items = element.locator("fast-accordion-item");

        const firstItem = items.nth(0);

        await firstItem.click();

        await expect(firstItem).toHaveBooleanAttribute("expanded");

        await expect(firstItem.locator("button")).toHaveAttribute(
            "aria-disabled",
            "true"
        );

        await element.evaluate(node => {
            node.setAttribute("expand-mode", "multi");
        });

        await expect(firstItem.locator("button")).not.hasAttribute("aria-disabled");
    });

    test("should set the first item as expanded if no child is expanded by default in single mode", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion expand-mode="single">
                    <fast-accordion-item>
                        <span slot="heading">Heading 1</span>
                        <div>Content 1</div>
                    </fast-accordion-item>
                    <fast-accordion-item>
                        <span slot="heading">Heading 2</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                </fast-accordion>
            `;
        });

        const items = element.locator("fast-accordion-item");

        const firstItem = items.nth(0);

        const secondItem = items.nth(1);

        await expect(firstItem).toHaveBooleanAttribute("expanded");

        await expect(secondItem).not.toHaveBooleanAttribute("expanded");

        await secondItem.evaluate<void>(node => node.setAttribute("expanded", ""));

        await expect(firstItem).not.toHaveBooleanAttribute("expanded");

        await expect(secondItem).toHaveBooleanAttribute("expanded");
    });

    test("should set the first item with an expanded attribute to expanded in single mode", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion expand-mode="single">
                    <fast-accordion-item>
                        <span slot="heading">Heading 1</span>
                        <div>Content 1</div>
                    </fast-accordion-item>
                    <fast-accordion-item expanded>
                        <span slot="heading">Heading 2</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                    <fast-accordion-item expanded>
                        <span slot="heading">Heading 3</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                </fast-accordion>
            `;
        });

        const items = element.locator("fast-accordion-item");

        const firstItem = items.nth(0);

        const secondItem = items.nth(1);

        const thirdItem = items.nth(2);

        await expect(firstItem).not.toHaveBooleanAttribute("expanded");

        await expect(secondItem).toHaveBooleanAttribute("expanded");

        await expect(thirdItem).not.toHaveBooleanAttribute("expanded");
    });

    test("should allow disabled items to be expanded when in single mode", async () => {
        test.slow();
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion expand-mode="single">
                    <fast-accordion-item>
                        <span slot="heading">Heading 1</span>
                        <div>Content 1</div>
                    </fast-accordion-item>
                    <fast-accordion-item expanded disabled>
                        <span slot="heading">Heading 2</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                    <fast-accordion-item expanded>
                        <span slot="heading">Heading 3</span>
                        <div>Content 2</div>
                    </fast-accordion-item>
                </fast-accordion>
            `;
        });

        const items = element.locator("fast-accordion-item");

        const firstItem = items.nth(0);

        const secondItem = items.nth(1);

        const thirdItem = items.nth(2);

        await expect(firstItem).not.toHaveBooleanAttribute("expanded");

        await expect(secondItem).toHaveBooleanAttribute("expanded");

        await expect(thirdItem).toHaveBooleanAttribute("expanded");

        await secondItem.evaluate(node => {
            node.removeAttribute("disabled");
        });

        await expect(firstItem).not.toHaveBooleanAttribute("expanded");

        await expect(secondItem).toHaveBooleanAttribute("expanded");

        await expect(thirdItem).not.toHaveBooleanAttribute("expanded");
    });

    test("should ignore `change` events from components other than accordion items", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion expand-mode="single">
                    <fast-accordion-item>
                        <div slot="heading">Accordion Item 1 Heading</div>
                        Accordion Item 1 Content
                    </fast-accordion-item>
                    <fast-accordion-item>
                        <div slot="heading">Accordion Item 2 Heading</div>
                        <fast-checkbox>A checkbox as content</fast-checkbox>
                    </fast-accordion-item>
                </fast-accordion>
            `;
        });

        const item = element.locator("fast-accordion-item").nth(1);

        const button = item.locator(`button[part="button"]`);

        await button.click();

        await expect(item).toHaveAttribute("expanded", "");

        const checkbox = item.locator("fast-checkbox");

        await checkbox.click();

        await expect(item).toHaveAttribute("expanded", "");
    });
});
