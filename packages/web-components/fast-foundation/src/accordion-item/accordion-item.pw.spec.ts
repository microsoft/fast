import { expect, test } from "@playwright/test";
import type { FASTAccordionItem } from "./accordion-item.js";

test.describe("Accordion item", () => {
    test("should set a default heading level of 2 when `headinglevel` is not provided", async ({
        page,
    }) => {
        await page.goto("http://localhost:6006");

        const element = page.locator("fast-accordion-item");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion-item>
                    <span slot="heading">Heading 1</span>
                    <div>Content 1</div>
                </fast-accordion-item>
            `;
        });

        await expect(element).not.hasAttribute("headinglevel");

        await expect(element).toHaveJSProperty("headinglevel", 2);
    });

    test("should set the `aria-level` attribute on the internal heading element equal to the heading level", async ({
        page,
    }) => {
        await page.goto("http://localhost:6006");

        const element = page.locator("fast-accordion-item");

        const heading = element.locator(`[role="heading"]`);

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion-item>
                    <span slot="heading">Heading 1</span>
                    <div>Content 1</div>
                </fast-accordion-item>
            `;
        });

        await element.evaluate<void, FASTAccordionItem>(node => {
            node.headinglevel = 3;
        });

        await expect(heading).toHaveAttribute("aria-level", "3");
    });

    test("should set `aria-expanded` property on the internal control equal to the `expanded` property", async ({
        page,
    }) => {
        await page.goto("http://localhost:6006");

        const element = page.locator("fast-accordion-item");

        const button = element.locator("button");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion-item expanded></fast-accordion-item>
            `;
        });

        await expect(button).toHaveAttribute("aria-expanded", "true");

        await element.evaluate<void, FASTAccordionItem>(node => {
            node.expanded = false;
        });

        await expect(button).toHaveAttribute("aria-expanded", "false");
    });

    test("should set `disabled` attribute on the internal control equal to the `disabled` property", async ({
        page,
    }) => {
        await page.goto("http://localhost:6006");

        const element = page.locator("fast-accordion-item");

        const button = element.locator("button");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion-item disabled></fast-accordion-item>
            `;
        });

        await expect(button).toHaveBooleanAttribute("disabled");

        await element.evaluate<void, FASTAccordionItem>(node => {
            node.disabled = false;
        });

        await expect(button).not.toHaveBooleanAttribute("disabled");
    });

    test("should set internal properties to match the id when provided", async ({
        page,
    }) => {
        await page.goto("http://localhost:6006");

        const element = page.locator("fast-accordion-item");

        const button = element.locator("button");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion-item id="foo"></fast-accordion-item>
            `;
        });

        await expect(element.locator(`[role="region"]`)).toHaveAttribute(
            "aria-labelledby",
            "foo"
        );

        await expect(button).toHaveId("foo");
    });
});
