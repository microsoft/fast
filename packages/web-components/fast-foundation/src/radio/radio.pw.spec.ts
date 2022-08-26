import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTRadio } from "./radio.js";

test.describe("Radio", () => {
    test("should have a role of `radio`", async ({ page }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await expect(element).toHaveAttribute("role", "radio");
    });

    test("should set the `aria-checked` attribute equal to the `checked` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await element.evaluate((node: FASTRadio) => (node.checked = true));

        await expect(element).toHaveAttribute("aria-checked", "true");

        await element.evaluate((node: FASTRadio) => (node.checked = false));

        await expect(element).toHaveAttribute("aria-checked", "false");
    });

    test("should add a class of `checked` when checked is true", async ({ page }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await element.evaluate((node: FASTRadio) => (node.checked = true));

        await expect(element).toHaveClass(/checked/);
    });

    test("should set a default `aria-checked` value when `checked` is not defined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await expect(element).toHaveAttribute("aria-checked", "false");
    });

    test("should set the `aria-required` attribute equal to the `required` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await element.evaluate((node: FASTRadio) => (node.required = true));

        await expect(element).toHaveAttribute("aria-required", "true");

        await element.evaluate((node: FASTRadio) => (node.required = false));

        await expect(element).toHaveAttribute("aria-required", "false");
    });

    test("should set a default `aria-required` value when `required` is not defined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await expect(element).toHaveAttribute("aria-required", "false");
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await element.evaluate((node: FASTRadio) => (node.disabled = true));

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate((node: FASTRadio) => (node.disabled = false));

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should set a default `aria-disabled` value when `disabled` is not defined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should set the `aria-readonly` attribute equal to the `readonly` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await element.evaluate((node: FASTRadio) => (node.readOnly = true));

        await expect(element).toHaveAttribute("aria-readonly", "true");

        await element.evaluate((node: FASTRadio) => (node.readOnly = false));

        await expect(element).toHaveAttribute("aria-readonly", "false");
    });

    test("should NOT set a default `aria-readonly` value when `readonly` is not defined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        expect(await element.getAttribute("aria-readonly")).toBeNull();
    });

    test("should add a class of `readonly` when readonly is true", async ({ page }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await element.evaluate((node: FASTRadio) => (node.readOnly = true));

        await expect(element).toHaveClass(/readonly/);
    });

    test("should set a tabindex of 0 on the element", async ({ page }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should NOT set a tabindex when disabled is `true`", async ({ page }) => {
        await page.goto(fixtureURL("radio--radio", { disabled: true }));

        const element = page.locator("fast-radio");

        await expect(element).toHaveAttribute("tabindex", "");
    });

    test("should initialize to the initial value if no value property is set", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await expect(element).toHaveJSProperty("value", "on");

        await expect(element).toHaveJSProperty("initialValue", "on");
    });

    test("should initialize to the provided value attribute if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");

        await element.evaluate((node: FASTRadio) => node.setAttribute("value", "foobar"));

        await expect(element).toHaveJSProperty("value", "foobar");
    });

    test("should initialize to the provided value attribute if set post-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio"));

        const element = page.locator("fast-radio");
        await element.evaluate((node: FASTRadio) => node.setAttribute("value", "foobar"));

        await expect(element).toHaveJSProperty("value", "foobar");
    });

    test("should initialize to the provided value property if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("radio--radio", { value: "foobar" }));

        const element = page.locator("fast-radio");

        await expect(element).toHaveJSProperty("value", "foobar");
    });

    test.describe("label", () => {
        test("should add a class of `label` to the internal label when default slotted content exists", async ({
            page,
        }) => {
            await page.goto(fixtureURL("radio--radio"));

            const element = page.locator("fast-radio");

            const label = element.locator("label");

            await expect(label).toHaveClass("label");
        });

        test("should add classes of `label` and `label__hidden` to the internal label when default slotted content exists", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("radio--radio", {
                    storyContent: "",
                })
            );

            const element = page.locator("fast-radio");

            const label = element.locator("label");

            await expect(label).toHaveClass("label label__hidden");
        });
    });

    test.describe("events", () => {
        test("should fire an event on click", async ({ page }) => {
            await page.goto(fixtureURL("radio--radio"));

            const element = page.locator("fast-radio");

            const [wasClicked] = await Promise.all([
                element.evaluate(
                    (node: FASTRadio) =>
                        new Promise(resolve =>
                            node.addEventListener("click", () => resolve(true))
                        )
                ),
                element.click(),
            ]);

            expect(wasClicked).toBeTruthy();
        });

        test("should fire an event when spacebar is invoked", async ({ page }) => {
            await page.goto(fixtureURL("radio--radio"));

            const element = page.locator("fast-radio");

            const [wasPressed] = await Promise.all([
                element.evaluate(
                    (node: FASTRadio) =>
                        new Promise(resolve =>
                            node.addEventListener("keydown", () => resolve(true))
                        )
                ),
                // FIXME: Playwright's keyboard API is not working as expected.
                element.evaluate(node =>
                    node.dispatchEvent(new KeyboardEvent("keydown", { key: " " }))
                ),
            ]);

            expect(wasPressed).toBeTruthy();
        });
    });

    test("should handle validity when the `required` attribute is present", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("radio--radio", {
                required: true,
                name: "name",
                value: "test",
            })
        );

        const element = page.locator("fast-radio");

        expect(
            await element.evaluate((node: FASTRadio) => node.validity.valueMissing)
        ).toBe(true);

        await element.click();

        expect(
            await element.evaluate((node: FASTRadio) => node.validity.valueMissing)
        ).toBe(false);
    });

    test.describe("whose parent form has its reset() method invoked", () => {
        test("should set its checked property to false if the checked attribute is unset", async ({
            page,
        }) => {
            await page.goto(fixtureURL("radio--radio-in-form"));

            const element = page.locator("fast-radio");

            const form = page.locator("form");

            await element.evaluate((node: FASTRadio) => (node.checked = true));

            await expect(element).toBeChecked();

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).not.toBeChecked();
        });

        test("should set its checked property to true if the checked attribute is set", async ({
            page,
        }) => {
            await page.goto(fixtureURL("radio--radio-in-form", { checked: true }));

            const element = page.locator("fast-radio");

            const form = page.locator("form");

            expect(
                await element.evaluate(node => node.hasAttribute("checked"))
            ).toBeTruthy();

            await expect(element).toBeChecked();

            await element.evaluate((node: FASTRadio) => (node.checked = false));

            await expect(element).not.toBeChecked();

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toBeChecked();
        });

        test("should put the control into a clean state, where `checked` attribute modifications modify the `checked` property prior to user or programmatic interaction", async ({
            page,
        }) => {
            await page.goto(fixtureURL("radio--radio-in-form"));

            const element = page.locator("fast-radio");

            const form = page.locator("form");

            await element.evaluate((node: FASTRadio) => {
                node.checked = true;
            });

            await element.evaluate(node => node.removeAttribute("checked"));

            await expect(element).toBeChecked();

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).not.toBeChecked();

            await element.evaluate(node => node.setAttribute("checked", ""));

            await expect(element).toBeChecked();
        });
    });
});
