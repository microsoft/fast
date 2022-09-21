import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import type { FASTRadio } from "../radio/index.js";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTRadioGroup } from "./index.js";

test.describe("Radio Group", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let radios: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-radio-group");

        root = page.locator("#root");

        radios = element.locator("fast-radio");

        await page.goto(fixtureURL("radio-group--radio-group"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should have a role of `radiogroup`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group></fast-radio-group>
            `;
        });

        await expect(element).toHaveAttribute("role", "radiogroup");
    });

    test("should set the `aria-disabled` attribute when disabled", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group disabled></fast-radio-group>
            `;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group></fast-radio-group>
            `;
        });

        await expect(element).not.hasAttribute("aria-disabled");

        await element.evaluate<void, FASTRadioGroup>(node => {
            node.disabled = true;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate<void, FASTRadioGroup>(node => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should set the `aria-readonly` attribute when the `readonly` attribute is present", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group readonly></fast-radio-group>
            `;
        });

        await expect(element).toHaveAttribute("aria-readonly", "true");
    });

    test("should set the `aria-readonly` attribute equal to the `readonly` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group></fast-radio-group>
            `;
        });

        await expect(element).not.hasAttribute("aria-readonly");

        await element.evaluate<void, FASTRadioGroup>(node => {
            node.readOnly = true;
        });

        await expect(element).toHaveAttribute("aria-readonly", "true");

        await element.evaluate<void, FASTRadioGroup>(node => {
            node.readOnly = false;
        });

        await expect(element).toHaveAttribute("aria-readonly", "false");
    });

    test("should NOT set a default `aria-disabled` value when `disabled` is not defined", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group></fast-radio-group>
            `;
        });

        await expect(element).not.hasAttribute("aria-disabled");
    });

    test("should set all child radio elements to disabled when the `disabled` attribute is present", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group disabled>
                    <fast-radio></fast-radio>
                    <fast-radio></fast-radio>
                    <fast-radio></fast-radio>
                </fast-radio-group>
            `;
        });

        await expect(element).toHaveBooleanAttribute("disabled");

        expect(
            await radios.evaluateAll<boolean, FASTRadio>(radios =>
                radios.every(radio => radio.disabled)
            )
        ).toBeTruthy();

        expect(
            await radios.evaluateAll(radios =>
                radios.every(radio => radio.getAttribute("aria-disabled") === "true")
            )
        ).toBeTruthy();
    });

    test("should set all child radio elements to readonly when the `readonly` property is true", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group readonly>
                    <fast-radio></fast-radio>
                    <fast-radio></fast-radio>
                    <fast-radio></fast-radio>
                </fast-radio-group>
            `;
        });

        await expect(element).toHaveBooleanAttribute("readonly");

        expect(
            await radios.evaluateAll(radios =>
                radios.every(radio => radio.hasAttribute("readonly"))
            )
        ).toBeTruthy();

        expect(
            await radios.evaluateAll(radios =>
                radios.every(radio => radio.getAttribute("aria-readonly") === "true")
            )
        ).toBeTruthy();
    });

    test("should set tabindex of 0 to a child radio with a matching `value`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group value="foo">
                    <fast-radio value="foo"></fast-radio>
                    <fast-radio value="bar"></fast-radio>
                    <fast-radio value="baz"></fast-radio>
                </fast-radio-group>
            `;
        });

        await expect(radios.nth(0)).toHaveAttribute("tabindex", "0");
    });

    test("should NOT set `tabindex` of 0 to a child radio if its value does not match the radiogroup `value`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group value="foo">
                    <fast-radio value="bar"></fast-radio>
                    <fast-radio value="baz"></fast-radio>
                    <fast-radio value="qux"></fast-radio>
                </fast-radio-group>
            `;
        });

        expect(
            await radios.evaluateAll(radios =>
                radios.every(radio => radio.getAttribute("tabindex") === "-1")
            )
        ).toBeTruthy();
    });

    test("should set a child radio with a matching `value` to `checked`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group value="bar">
                    <fast-radio value="foo"></fast-radio>
                    <fast-radio value="bar"></fast-radio>
                    <fast-radio value="baz"></fast-radio>
                </fast-radio-group>
            `;
        });

        await expect(radios.nth(0)).not.toBeChecked();

        await expect(radios.nth(1)).toBeChecked();

        await expect(radios.nth(2)).not.toBeChecked();
    });

    test("should set a child radio with a matching `value` to `checked` when value changes", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group value="foo">
                    <fast-radio value="foo"></fast-radio>
                    <fast-radio value="bar"></fast-radio>
                    <fast-radio value="baz"></fast-radio>
                </fast-radio-group>
            `;
        });

        await element.evaluate((node: FASTRadioGroup) => {
            node.value = "bar";
        });

        await expect(radios.nth(0)).not.toBeChecked();

        await expect(radios.nth(1)).toBeChecked();

        await expect(radios.nth(2)).not.toBeChecked();
    });

    test("should mark only the last radio defaulted to checked as checked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group>
                    <fast-radio value="foo" checked></fast-radio>
                    <fast-radio value="bar" checked></fast-radio>
                    <fast-radio value="baz" checked></fast-radio>
                </fast-radio-group>
            `;
        });

        expect(
            await radios.evaluateAll<number, FASTRadio>(
                radios => radios.filter(radio => radio.checked).length
            )
        ).toBe(1);

        await expect(radios.nth(0)).not.toBeChecked();

        await expect(radios.nth(1)).not.toBeChecked();

        await expect(radios.nth(2)).toBeChecked();
    });

    test("should mark radio matching value on radio-group over any checked attributes", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group value="foo">
                    <fast-radio value="foo"></fast-radio>
                    <fast-radio value="bar" checked></fast-radio>
                    <fast-radio value="baz"></fast-radio>
                </fast-radio-group>
            `;
        });

        expect(
            await radios.evaluateAll<number, FASTRadio>(
                radios => radios.filter(radio => radio.checked).length
            )
        ).toBe(1);

        await expect(radios.nth(0)).toBeChecked();

        await expect(radios.nth(1)).not.toBeChecked();

        // radio-group explicitly sets non-matching radio's checked to false if
        // a value match was found, but the attribute should still persist.
        expect(
            await radios.nth(1).evaluate(node => node.hasAttribute("checked"))
        ).toBeTruthy();

        await expect(radios.nth(2)).not.toBeChecked();
    });

    test("should allow resetting of elements by the parent form", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <form>
                    <fast-radio-group>
                        <fast-radio value="foo"></fast-radio>
                        <fast-radio value="bar" checked></fast-radio>
                        <fast-radio value="baz"></fast-radio>
                    </fast-radio-group>
                </form>
            `;
        });

        const form = page.locator("form");

        await radios.nth(2).evaluate<void, FASTRadio>(node => {
            node.checked = true;
        });

        await expect(radios.nth(0)).not.toBeChecked();

        await expect(radios.nth(1)).not.toBeChecked();

        await expect(radios.nth(2)).toBeChecked();

        await form.evaluate<void, HTMLFormElement>(node => {
            node.reset();
        });

        await expect(radios.nth(0)).not.toBeChecked();

        await expect(radios.nth(1)).toBeChecked();

        await expect(radios.nth(2)).not.toBeChecked();
    });
});
