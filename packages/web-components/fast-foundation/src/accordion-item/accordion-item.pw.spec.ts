import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTAccordionItem } from "./accordion-item.js";

test.describe("Accordion item", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let heading: Locator;
    let button: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-accordion-item");

        root = page.locator("#root");

        heading = page.locator(`[role="heading"]`);

        button = element.locator("button");

        await page.goto(fixtureURL("accordion-item--accordion-item"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should set a default heading level of 2 when `headinglevel` is not provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion-item>
                    <span slot="heading">Heading 1</span>
                    <div>Content 1</div>
                </fast-accordion-item>
            `;
        });

        await expect(element).not.toHaveAttribute("headinglevel");

        await expect(element).toHaveJSProperty("headinglevel", 2);
    });

    test("should set the `aria-level` attribute on the internal heading element equal to the heading level", async () => {
        await root.evaluate(node => {
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

    test("should set `aria-expanded` property on the internal control equal to the `expanded` property", async () => {
        await root.evaluate(node => {
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

    test("should set `disabled` attribute on the internal control equal to the `disabled` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-accordion-item disabled></fast-accordion-item>
            `;
        });

        await expect(button).toHaveAttribute("disabled");

        await element.evaluate<void, FASTAccordionItem>(node => {
            node.disabled = false;
        });

        await expect(button).not.toHaveAttribute("disabled");
    });

    test("should set internal properties to match the id when provided", async () => {
        await root.evaluate(node => {
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
