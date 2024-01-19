import type { Locator } from "@playwright/test";
import { expect, test } from "@playwright/test";
import type { FASTRadio } from "../radio/index.js";
import type { FASTRadioGroup } from "./radio-group.js";
import { RadioGroupOrientation } from "./radio-group.options.js";

test.describe("Radio Group", () => {
    test("should have a role of `radiogroup`", async ({ page }) => {
        const element = page.locator("fast-radio-group");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group></fast-radio-group>
            `;
        });

        await expect(element).toHaveAttribute("role", "radiogroup");
    });

    test("should set a default `aria-orientation` value when `orientation` is not defined", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group></fast-radio-group>
            `;
        });

        await expect(element).toHaveAttribute(
            "aria-orientation",
            `${RadioGroupOrientation.horizontal}`
        );
    });

    test("should set a matching class on the `positioning-region` when an orientation is provided", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group></fast-radio-group>
            `;
        });

        const positioningRegion = element.locator(".positioning-region");

        // Horizontal by default
        await expect(positioningRegion).toHaveClass(/horizontal/);

        await element.evaluate((node: FASTRadioGroup, RadioGroupOrientation) => {
            node.orientation = RadioGroupOrientation.vertical;
        }, RadioGroupOrientation);

        await expect(positioningRegion).toHaveClass(/vertical/);

        await element.evaluate((node: FASTRadioGroup, RadioGroupOrientation) => {
            node.orientation = RadioGroupOrientation.horizontal;
        }, RadioGroupOrientation);

        await expect(positioningRegion).toHaveClass(/horizontal/);
    });

    test("should set the `aria-orientation` attribute equal to the `orientation` value", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group></fast-radio-group>
            `;
        });

        await element.evaluate((node: FASTRadioGroup, RadioGroupOrientation) => {
            node.orientation = RadioGroupOrientation.horizontal;
        }, RadioGroupOrientation);

        await expect(element).toHaveAttribute(
            "aria-orientation",
            RadioGroupOrientation.horizontal
        );

        await element.evaluate((node: FASTRadioGroup, RadioGroupOrientation) => {
            node.orientation = RadioGroupOrientation.vertical;
        }, RadioGroupOrientation);

        await expect(element).toHaveAttribute(
            "aria-orientation",
            RadioGroupOrientation.vertical
        );
    });

    test("should set the `aria-disabled` attribute when disabled", async ({ page }) => {
        const element = page.locator("fast-radio-group");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group disabled></fast-radio-group>
            `;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` property", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should set the `aria-readonly` attribute when the `readonly` attribute is present", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group readonly></fast-radio-group>
            `;
        });

        await expect(element).toHaveAttribute("aria-readonly", "true");
    });

    test("should set the `aria-readonly` attribute equal to the `readonly` property", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should NOT set a default `aria-disabled` value when `disabled` is not defined", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group></fast-radio-group>
            `;
        });

        await expect(element).not.hasAttribute("aria-disabled");
    });

    test("should NOT modify child radio elements disabled state when the `disabled` attribute is present", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group>
                    <fast-radio></fast-radio>
                    <fast-radio disabled></fast-radio>
                    <fast-radio></fast-radio>
                </fast-radio-group>
            `;
        });

        await expect(element).not.toHaveBooleanAttribute("disabled");

        const firstRadio = radios.nth(0);
        const secondRadio = radios.nth(1);
        const thirdRadio = radios.nth(2);

        const expectedFirst = await firstRadio.evaluate<boolean, FASTRadio>(node =>
            node.hasAttribute("disabled")
        );
        const expectedSecond = await secondRadio.evaluate<boolean, FASTRadio>(node =>
            node.hasAttribute("disabled")
        );
        const expectedThird = await thirdRadio.evaluate<boolean, FASTRadio>(node =>
            node.hasAttribute("disabled")
        );

        expect(
            await firstRadio.evaluate<boolean, FASTRadio>(radio =>
                radio.hasAttribute("disabled")
            )
        ).toEqual(expectedFirst);

        expect(
            await secondRadio.evaluate<boolean, FASTRadio>(radio =>
                radio.hasAttribute("disabled")
            )
        ).toEqual(expectedSecond);

        expect(
            await thirdRadio.evaluate<boolean, FASTRadio>(radio =>
                radio.hasAttribute("disabled")
            )
        ).toEqual(expectedThird);

        element.evaluate<void, FASTRadioGroup>(node => node.setAttribute("disabled", ""));

        await expect(element).toHaveBooleanAttribute("disabled");

        expect(
            await firstRadio.evaluate<boolean, FASTRadio>(radio =>
                radio.hasAttribute("disabled")
            )
        ).toEqual(expectedFirst);

        expect(
            await secondRadio.evaluate<boolean, FASTRadio>(radio =>
                radio.hasAttribute("disabled")
            )
        ).toEqual(expectedSecond);

        expect(
            await thirdRadio.evaluate<boolean, FASTRadio>(radio =>
                radio.hasAttribute("disabled")
            )
        ).toEqual(expectedThird);
    });

    test("should NOT be focusable when disabled", async ({ page }) => {
        const first: Locator = page.locator("button", { hasText: "First" });
        const second: Locator = page.locator("button", { hasText: "Second" });

        const element = page.locator("fast-radio-group");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <button>First</button>
                <fast-radio-group disabled>
                    <fast-radio></fast-radio>
                    <fast-radio></fast-radio>
                    <fast-radio></fast-radio>
                </fast-radio-group>
                <button>Second</button>
            `;
        });

        await expect(element).toHaveBooleanAttribute("disabled");

        await first.focus();

        await expect(first).toBeFocused();

        await first.press("Tab");

        await expect(second).toBeFocused();

        expect(
            await element.evaluate<boolean, FASTRadioGroup>(
                node => node.getAttribute("tabindex") === "-1"
            )
        ).toBeTruthy();
    });

    test("should NOT be focusable via click when disabled", async ({ page }) => {
        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <button>Button</button>
                <fast-radio-group>
                    <fast-radio></fast-radio>
                    <fast-radio></fast-radio>
                    <fast-radio></fast-radio>
                </fast-radio-group>
            `;
        });

        const radioItemsCount = await radios.count();

        for (let i = 0; i < radioItemsCount; i++) {
            const item = radios.nth(i);

            await item.click();

            await expect(item).toBeFocused();
        }

        const button = page.locator("button", { hasText: "Button" });

        await button.focus();

        await expect(button).toBeFocused();

        await element.evaluate<boolean, FASTRadioGroup>(node => (node.disabled = true));

        await expect(element).toHaveBooleanAttribute("disabled");

        for (let i = 0; i < radioItemsCount; i++) {
            const item = radios.nth(i);

            await item.click();

            await expect(item).not.toBeFocused();
        }
    });

    test("should set tabindex of 0 to a child radio with a matching `value`", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should NOT set `tabindex` of 0 to a child radio if its value does not match the radiogroup `value`", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should set a child radio with a matching `value` to `checked`", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should set a child radio with a matching `value` to `checked` when value changes", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should mark only the last radio defaulted to checked as checked", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should mark radio matching value on radio-group over any checked attributes", async ({
        page,
    }) => {
        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should allow resetting of elements by the parent form", async ({ page }) => {
        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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
