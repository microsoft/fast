import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTCheckbox } from "./checkbox.js";

test.describe("Checkbox", () => {
    test("should have a role of `checkbox`", async ({ page }) => {
        await page.goto(fixtureURL("checkbox--checkbox"));

        const element = page.locator("fast-checkbox");

        await expect(element).toHaveAttribute("role", "checkbox");
    });

    test("should set the `aria-checked` attribute equal to the `checked` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("checkbox--checkbox"));

        const element = page.locator("fast-checkbox");

        await element.click();

        await expect(element).toHaveAttribute("aria-checked", "true");

        await expect(element).toHaveClass("checked");

        await element.click();

        await expect(element).toHaveAttribute("aria-checked", "false");

        await expect(element).not.toHaveClass("checked");
    });

    test("should set a default `aria-checked` value when `checked` is not defined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("checkbox--checkbox"));

        const element = page.locator("fast-checkbox");

        await expect(element).toHaveAttribute("aria-checked", "false");
    });

    test("should set the `aria-required` attribute equal to the `required` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("checkbox--checkbox"));

        const element = page.locator("fast-checkbox");

        await expect(element).toHaveAttribute("aria-required", "false");

        await element.evaluate((node: FASTCheckbox) => {
            node.required = true;
        });

        await expect(element).toHaveAttribute("aria-required", "true");
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("checkbox--checkbox"));

        const element = page.locator("fast-checkbox");

        await expect(element).toHaveAttribute("aria-disabled", "false");

        await element.evaluate((node: FASTCheckbox) => {
            node.disabled = true;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");
    });

    test("should NOT set a default `aria-readonly` value when `readonly` is not defined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("checkbox--checkbox"));

        const element = page.locator("fast-checkbox");

        expect(
            await element.evaluate(node => node.hasAttribute("aria-readonly"))
        ).toBeFalsy();
    });

    test("should set the `aria-readonly` attribute equal to the `readonly` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("checkbox--checkbox"));

        const element = page.locator("fast-checkbox");

        await element.evaluate((node: FASTCheckbox) => {
            node.readOnly = true;
        });

        await expect(element).toHaveAttribute("aria-readonly", "true");

        await element.evaluate((node: FASTCheckbox) => {
            node.readOnly = false;
        });

        await expect(element).toHaveAttribute("aria-readonly", "false");
    });

    test("should add a class of `readonly` when readonly is true", async ({ page }) => {
        await page.goto(fixtureURL("checkbox--checkbox"));

        const element = page.locator("fast-checkbox");

        await element.evaluate((node: FASTCheckbox) => {
            node.readOnly = true;
        });

        await expect(element).toHaveClass("readonly");
    });

    test("should set a tabindex of 0 on the element", async ({ page }) => {
        await page.goto(fixtureURL("checkbox--checkbox"));

        const element = page.locator("fast-checkbox");

        await expect(element).toHaveJSProperty("tabIndex", 0);

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should NOT set a tabindex when disabled is `true`", async ({ page }) => {
        await page.goto(fixtureURL("checkbox--checkbox", { disabled: true }));

        const element = page.locator("fast-checkbox");

        await element.evaluate((node: FASTCheckbox) => {
            node.disabled = true;
        });

        await expect(element).not.toHaveJSProperty("tabIndex", 0);

        await expect(element).not.toHaveAttribute("tabindex", "0");
    });

    test("should add a class of `indeterminate` when indeterminate is true", async ({
        page,
    }) => {
        await page.goto(fixtureURL("checkbox--checkbox", { indeterminate: true }));

        const element = page.locator("fast-checkbox");

        await element.evaluate((node: FASTCheckbox) => {
            node.indeterminate = true;
        });

        await expect(element).toHaveClass("indeterminate");
    });

    test("should set off `indeterminate` on `checked` change by user click", async ({
        page,
    }) => {
        await page.goto(fixtureURL("checkbox--checkbox", { indeterminate: true }));

        const element = page.locator("fast-checkbox");

        await element.evaluate((node: FASTCheckbox) => {
            node.indeterminate = true;
        });

        await expect(element).toHaveJSProperty("indeterminate", true);

        await element.click();

        await expect(element).toHaveJSProperty("indeterminate", false);
    });

    test("should set off `indeterminate` on `checked` change by user keypress", async ({
        page,
    }) => {
        await page.goto(fixtureURL("checkbox--checkbox", { indeterminate: true }));

        const element = page.locator("fast-checkbox");

        await element.evaluate((node: FASTCheckbox) => {
            node.indeterminate = true;
        });

        await expect(element).toHaveJSProperty("indeterminate", true);

        await element.press(" ");

        await expect(element).toHaveJSProperty("indeterminate", false);
    });

    test("should initialize to the initial value if no value property is set", async ({
        page,
    }) => {
        await page.goto(fixtureURL("checkbox--checkbox"));

        const element = page.locator("fast-checkbox");

        const initialValue = await element.evaluate(
            (node: FASTCheckbox) => node.initialValue
        );

        // Playwright doesn't yet see our components as input elements
        await expect(element).toHaveJSProperty("value", initialValue);
    });

    test("should initialize to the provided value attribute if set pre-connection", async ({
        page,
    }) => {
        const expectedValue = "foobar";

        await page.goto(fixtureURL("checkbox--checkbox", { value: expectedValue }));

        const element = page.locator("fast-checkbox");

        const value = await element.evaluate((node: FASTCheckbox) => node.value);

        expect(value).toBe(expectedValue);
    });

    test("should initialize to the provided value attribute if set post-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("checkbox--checkbox"));

        const element = page.locator("fast-checkbox");

        const expectedValue = "foobar";

        await element.evaluate((node: FASTCheckbox, expectedValue) => {
            node.setAttribute("value", expectedValue);
        }, expectedValue);

        await expect(element).toHaveJSProperty("value", expectedValue);
    });

    test("should initialize to the provided value property if set pre-connection", async ({
        page,
    }) => {
        const expectedValue = "foobar";

        const value = await page.evaluate(expectedValue => {
            const node = document.createElement("fast-checkbox") as FASTCheckbox;

            node.value = expectedValue;

            return Promise.resolve(node.value);
        }, expectedValue);

        expect(value).toBe(expectedValue);
    });

    test.describe("label", () => {
        test("should add a class of `label` to the internal label when default slotted content exists", async ({
            page,
        }) => {
            await page.goto(fixtureURL("checkbox--checkbox"));

            const element = page.locator("fast-checkbox");

            const label = element.locator("label");

            await expect(label).toHaveClass("label");
        });

        test("should add classes of `label` and `label__hidden` to the internal label when default slotted content exists", async ({
            page,
        }) => {
            await page.goto(fixtureURL("checkbox--checkbox"));

            const element = page.locator("fast-checkbox");

            const label = element.locator("label");

            await element.evaluate((node: FASTCheckbox) => {
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
            });

            await expect(label).toHaveClass("label label__hidden");
        });
    });

    test.describe("events", () => {
        test("should fire an event on click", async ({ page }) => {
            await page.goto(fixtureURL("checkbox--checkbox"));

            const element = page.locator("fast-checkbox");

            const [wasClicked] = await Promise.all([
                element.evaluate(node => {
                    return new Promise(resolve => {
                        node.addEventListener("click", () => resolve(true));
                    });
                }),

                element.click(),
            ]);

            await expect(wasClicked).toBe(true);
        });

        test("should fire an event when spacebar is invoked", async ({ page }) => {
            await page.goto(fixtureURL("checkbox--checkbox"));

            const element = page.locator("fast-checkbox");

            const wasPressed = await element.evaluate(node => {
                return new Promise(resolve => {
                    node.addEventListener("keydown", () => resolve(true));

                    node.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            key: " ",
                        })
                    );
                });
            });

            await expect(wasPressed).toBe(true);
        });
    });

    test.describe("when required", () => {
        test("should be invalid when unchecked", async ({ page }) => {
            await page.goto(fixtureURL("checkbox--checkbox-in-form", { required: true }));

            const element = page.locator("fast-checkbox");

            expect(
                await element.evaluate((node: FASTCheckbox) => node.validity.valueMissing)
            ).toBe(true);
        });

        test("should be valid when checked", async ({ page }) => {
            await page.goto(
                fixtureURL("checkbox--checkbox-in-form", {
                    checked: true,
                    required: true,
                })
            );

            const element = page.locator("fast-checkbox");

            expect(
                await element.evaluate((node: FASTCheckbox) => node.validity.valueMissing)
            ).toBe(false);
        });
    });

    test.describe("whose parent form has its reset() method invoked", () => {
        test("should set its checked property to false if the checked attribute is unset", async ({
            page,
        }) => {
            await page.goto(fixtureURL("checkbox--checkbox-in-form", { required: true }));

            const element = page.locator("fast-checkbox");

            await expect(element).toHaveJSProperty("checked", false);

            await element.evaluate((node: FASTCheckbox) => {
                node.checked = true;
            });

            await expect(element).toHaveJSProperty("checked", true);

            const form = page.locator("form");

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("checked", false);
        });
    });

    test.describe("whose parent form has its reset() method invoked", () => {
        test("should set its checked property to true if the checked attribute is set", async ({
            page,
        }) => {
            await page.goto(fixtureURL("checkbox--checkbox-in-form", { required: true }));

            const element = page.locator("fast-checkbox");

            await expect(element).toHaveJSProperty("checked", false);

            await element.evaluate((node: FASTCheckbox) => {
                node.setAttribute("checked", "");
            });

            await expect(element).toHaveJSProperty("checked", true);

            const form = page.locator("form");

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("checked", true);
        });

        test("should put the control into a clean state, where checked attribute modifications change the checked property prior to user or programmatic interaction", async ({
            page,
        }) => {
            await page.goto(fixtureURL("checkbox--checkbox-in-form", { required: true }));

            const element = page.locator("fast-checkbox");

            const form = page.locator("form");

            await element.evaluate((node: FASTCheckbox) => {
                node.checked = true;
                node.removeAttribute("checked");
            });

            await expect(element).toHaveJSProperty("checked", true);

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("checked", false);

            await element.evaluate((node: FASTCheckbox) => {
                node.setAttribute("checked", "");
            });

            expect(
                await element.evaluate((node: FASTCheckbox) => node.value)
            ).toBeTruthy();
        });
    });
});
