import { Orientation } from "@microsoft/fast-web-utilities";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import type { FASTRadio } from "../radio/index.js";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTRadioGroup } from "./index.js";

test.describe("Radio Group", () => {
    test("should have a role of `radiogroup`", async ({ page }) => {
        await page.goto(fixtureURL("radio-group--radio-group"));

        const element = page.locator("fast-radio-group");

        await expect(element).toHaveAttribute("role", "radiogroup");
    });

    test("should set a matching class on the `positioning-region` when an orientation is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio-group--radio-group"));

        const element = page.locator("fast-radio-group");

        const positioningRegion = element.locator(".positioning-region");

        // Horizontal by default
        await expect(positioningRegion).toHaveClass(/horizontal/);

        await element.evaluate<void, typeof Orientation, FASTRadioGroup>(
            (node, Orientation) => {
                node.orientation = Orientation.vertical;
            },
            Orientation
        );

        await expect(positioningRegion).toHaveClass(/vertical/);

        await element.evaluate<void, typeof Orientation, FASTRadioGroup>(
            (node, Orientation) => {
                node.orientation = Orientation.horizontal;
            },
            Orientation
        );

        await expect(positioningRegion).toHaveClass(/horizontal/);
    });

    test.describe("should set an ARIA attribute to match the state", () => {
        let page: Page;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();
            await page.goto(fixtureURL("radio-group--radio-group"));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("disabled", async () => {
            const element = page.locator("fast-radio-group");

            await expect(element).not.hasAttribute("aria-disabled");

            await element.evaluate((node: FASTRadioGroup) => (node.disabled = true));

            await expect(element).toHaveAttribute("aria-disabled", "true");

            await element.evaluate((node: FASTRadioGroup) => (node.disabled = false));

            await expect(element).toHaveAttribute("aria-disabled", "false");
        });

        test("readonly", async () => {
            const element = page.locator("fast-radio-group");

            await expect(element).not.hasAttribute("aria-disabled");

            await element.evaluate((node: FASTRadioGroup) => (node.disabled = true));

            await expect(element).toHaveAttribute("aria-disabled", "true");

            await element.evaluate((node: FASTRadioGroup) => (node.disabled = false));

            await expect(element).toHaveAttribute("aria-disabled", "false");
        });
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio-group--radio-group"));

        const element = page.locator("fast-radio-group");

        await element.evaluate((node: FASTRadioGroup) => (node.disabled = true));

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate((node: FASTRadioGroup) => (node.disabled = false));

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should NOT set a default `aria-disabled` value when `disabled` is not defined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio-group--radio-group"));

        const element = page.locator("fast-radio-group");

        expect(await element.getAttribute("aria-disabled")).toBeNull();
    });

    test("should set all child radio elements to disabled when the `disabled` attribute is present", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("radio-group--radio-group", {
                disabled: true,
            })
        );

        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        await element.evaluate<void, FASTRadioGroup>(node => {
            node.disabled = true;
        });

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

    test("should set the `aria-readonly` attribute equal to the `readonly` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio-group--radio-group"));

        const element = page.locator("fast-radio-group");

        expect(await element.getAttribute("aria-readonly")).toBeNull();

        await element.evaluate<void, FASTRadioGroup>(node => {
            node.readOnly = true;
        });

        await expect(element).toHaveAttribute("aria-readonly", "true");

        await element.evaluate<void, FASTRadioGroup>(node => {
            node.readOnly = false;
        });

        await expect(element).toHaveAttribute("aria-readonly", "false");
    });

    test("should set all child radio elements to readonly when the `readonly` property is true", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio-group--radio-group", { readOnly: true }));

        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

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

    test("should set tabindex of 0 to a child radio with a matching `value`", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio-group--radio-group", { value: "blueberries" }));

        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        const blueberry = radios.filter({ hasText: "Blueberries" });

        await expect(blueberry).toHaveAttribute("tabindex", "0");
    });

    test("should NOT set `tabindex` of 0 to a child radio if its value does not match the radiogroup `value`", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio-group--radio-group", { value: "guava" }));

        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        expect(
            await radios.evaluateAll(radios =>
                radios.every(radio => radio.getAttribute("tabindex") === "-1")
            )
        ).toBeTruthy();
    });

    test("should set a child radio with a matching `value` to `checked`", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio-group--radio-group", { value: "blueberries" }));

        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio:not(:has-text('Blueberries'))");

        const blueberry = element.locator("fast-radio", { hasText: "Blueberries" });

        await expect(blueberry).toBeChecked();

        expect(
            await radios.evaluateAll<boolean, FASTRadio>(radios =>
                radios.every(radio => !radio.checked)
            )
        ).toBeTruthy();
    });

    test("should set a child radio with a matching `value` to `checked` when value changes", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio-group--radio-group"));

        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio:not(:has-text('Blueberries'))");

        const blueberry = element.locator("fast-radio", { hasText: "Blueberries" });

        await element.evaluate<void, FASTRadioGroup>(node => {
            node.value = "blueberries";
        });

        await expect(blueberry).toBeChecked();

        expect(
            await radios.evaluateAll<boolean, FASTRadio>(radios =>
                radios.every(radio => !radio.checked)
            )
        ).toBeTruthy();
    });

    test("should mark only the last radio defaulted to checked as checked", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("radio-group--radio-group", {
                "storyItems[0].checked": true,
                "storyItems[1].checked": true,
                "storyItems[2].checked": true,
            })
        );

        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        expect(
            await radios.evaluateAll<number, FASTRadio>(
                radios => radios.filter(radio => radio.checked).length
            )
        ).toBe(1);

        await expect(radios.first()).not.toBeChecked();
        await expect(radios.nth(1)).not.toBeChecked();
        await expect(radios.nth(2)).toBeChecked();
    });

    test("should mark radio matching value on radio-group over any checked attributes", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("radio-group--radio-group", {
                "storyItems[4].checked": true,
                value: "blueberries",
            })
        );

        const element = page.locator("fast-radio-group");

        const radios = element.locator("fast-radio");

        expect(
            await radios.evaluateAll<number, FASTRadio>(
                radios => radios.filter(radio => radio.checked).length
            )
        ).toBe(1);

        await expect(radios.first()).not.toBeChecked();
        await expect(radios.nth(3)).not.toBeChecked();
        await expect(radios.nth(4)).not.toBeChecked();
        await expect(radios.nth(5)).not.toBeChecked();
        await expect(radios.nth(6)).not.toBeChecked();
        await expect(radios.nth(7)).not.toBeChecked();
        await expect(radios.nth(8)).not.toBeChecked();

        // radio-group explicitly sets non-matching radio's checked to false if
        // a value match was found, but the attribute should still persist.
        expect(
            await radios.nth(4).evaluate(node => node.hasAttribute("checked"))
        ).toBeTruthy();

        await expect(radios.nth(2)).toBeChecked();

        expect(
            await radios.nth(2).evaluate(node => node.hasAttribute("checked"))
        ).toBeFalsy();
    });

    test("should allow resetting of elements by the parent form", async ({ page }) => {
        await page.goto(
            fixtureURL("radio-group--radio-group-in-form", {
                "storyItems[2].checked": true,
            })
        );

        const element = page.locator("fast-radio-group");

        const form = page.locator("form");

        const radios = element.locator("fast-radio");

        const radiosCount = await radios.count();

        await radios.nth(4).evaluate<void, FASTRadio>(node => {
            node.checked = true;
        });

        for (let i = 0; i < radiosCount; i++) {
            const thisRadio = radios.nth(i);
            if (i === 4) {
                await expect(thisRadio).toBeChecked();
            } else {
                await expect(thisRadio).not.toBeChecked();
            }
        }

        await form.evaluate<void, HTMLFormElement>(node => {
            node.reset();
        });

        for (let i = 0; i < radiosCount; i++) {
            const thisRadio = radios.nth(i);
            if (i === 2) {
                await expect(thisRadio).toBeChecked();
            } else {
                await expect(thisRadio).not.toBeChecked();
            }
        }
    });
});
