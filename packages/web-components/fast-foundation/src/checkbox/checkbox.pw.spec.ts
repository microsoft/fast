import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTCheckbox } from "./checkbox.js";

test.describe("Checkbox", () => {
    test.describe("States, attributes, and classes", () => {
        test.describe.configure({ mode: "serial" });

        // Syncronous tests all run on the same page instance
        let page: Page;
        let element: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-checkbox");

            await page.goto(fixtureURL("checkbox--checkbox"));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should have a role of `checkbox`", async () => {
            await expect(element).toHaveAttribute("role", "checkbox");
        });

        test("should set a tabindex of 0 on the element", async () => {
            await expect(element).toHaveJSProperty("tabIndex", 0);

            await expect(element).toHaveAttribute("tabindex", "0");
        });

        test("should set a default `aria-checked` value when `checked` is not defined", async () => {
            await expect(element).not.toHaveBooleanAttribute("checked");

            await expect(element).toHaveAttribute("aria-checked", "false");
        });

        test("should set the `aria-checked` attribute equal to the `checked` property", async () => {
            await element.evaluate((node: FASTCheckbox) => {
                node.checked = true;
            });

            await expect(element).toHaveAttribute("aria-checked", "true");

            await expect(element).toHaveClass("checked");

            await element.evaluate((node: FASTCheckbox) => {
                node.checked = false;
            });

            await expect(element).toHaveAttribute("aria-checked", "false");

            await expect(element).not.toHaveClass("checked");
        });

        test("should NOT set a default `aria-required` value when `required` is not defined", async () => {
            await expect(element).not.toHaveBooleanAttribute("required");

            await expect(element).toHaveAttribute("aria-required", "false");
        });

        test("should set the `aria-required` attribute equal to the `required` property", async () => {
            await element.evaluate((node: FASTCheckbox) => {
                node.required = true;
            });

            await expect(element).toHaveAttribute("aria-required", "true");

            await expect(element).toHaveClass(/required/);

            await element.evaluate((node: FASTCheckbox) => {
                node.required = false;
            });

            await expect(element).toHaveAttribute("aria-required", "false");

            await expect(element).not.toHaveClass(/required/);
        });

        test("should set a default `aria-disabled` value when `disabled` is not defined", async () => {
            await expect(element).not.toHaveBooleanAttribute("disabled");

            await expect(element).toHaveAttribute("aria-disabled", "false");
        });

        test("should set the `aria-disabled` attribute equal to the `disabled` property", async () => {
            await element.evaluate((node: FASTCheckbox) => {
                node.disabled = true;
            });

            await expect(element).toHaveAttribute("aria-disabled", "true");

            await expect(element).toHaveClass(/disabled/);

            await element.evaluate((node: FASTCheckbox) => {
                node.disabled = false;
            });

            await expect(element).toHaveAttribute("aria-disabled", "false");

            await expect(element).not.toHaveClass(/disabled/);
        });

        test("should NOT set a tabindex when `disabled` is true", async () => {
            await element.evaluate((node: FASTCheckbox) => {
                node.disabled = true;
            });

            await expect(element).not.toHaveJSProperty("tabIndex", 0);

            await expect(element).not.toHaveAttribute("tabindex", "0");
        });

        test("should NOT set a default `aria-readonly` value when `readonly` is not defined", async () => {
            await expect(element).not.toHaveBooleanAttribute("readonly");

            await expect(element).not.hasAttribute("aria-readonly");
        });

        test("should set the `aria-readonly` attribute equal to the `readonly` property", async () => {
            await element.evaluate((node: FASTCheckbox) => {
                node.readOnly = true;
            });

            await expect(element).toHaveAttribute("aria-readonly", "true");

            await element.evaluate((node: FASTCheckbox) => {
                node.readOnly = false;
            });

            await expect(element).toHaveAttribute("aria-readonly", "false");
        });

        test("should add a class of `readonly` when `readonly` is true", async () => {
            await element.evaluate((node: FASTCheckbox) => {
                node.readOnly = true;
            });

            await expect(element).toHaveClass(/readonly/);

            await element.evaluate((node: FASTCheckbox) => {
                node.readOnly = false;
            });

            await expect(element).not.toHaveClass(/readonly/);
        });

        test("should add a class of `indeterminate` when indeterminate is true", async () => {
            await element.evaluate((node: FASTCheckbox) => {
                node.indeterminate = true;
            });

            await expect(element).toHaveClass(/indeterminate/);

            await element.evaluate((node: FASTCheckbox) => {
                node.indeterminate = false;
            });

            await expect(element).not.toHaveClass(/indeterminate/);
        });

        test("should set off `indeterminate` on `checked` change by user click", async () => {
            await page.reload();

            await element.evaluate((node: FASTCheckbox) => {
                node.indeterminate = true;
            });

            await expect(element).toHaveJSProperty("indeterminate", true);

            await element.click();

            await expect(element).toHaveJSProperty("indeterminate", false);
        });

        test("should set off `indeterminate` on `checked` change by user keypress", async () => {
            await page.reload();

            await element.evaluate((node: FASTCheckbox) => {
                node.indeterminate = true;
            });

            await expect(element).toHaveJSProperty("indeterminate", true);

            await element.press(" ");

            await expect(element).toHaveJSProperty("indeterminate", false);
        });

        test("should add a class of `label` to the internal label when default slotted content exists", async () => {
            const label = element.locator("label");

            await expect(label).toHaveClass(/label/);
        });

        test("should add classes of `label` and `label__hidden` to the internal label when default slotted content exists", async () => {
            const label = element.locator("label");

            await element.evaluate((node: FASTCheckbox) => {
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
            });

            await expect(label).toHaveClass(/label label__hidden/);
        });

        test("should initialize to the initial value if no value property is set", async () => {
            const initialValue = await element.evaluate(
                (node: FASTCheckbox) => node.initialValue
            );

            // Playwright doesn't yet see our components as input elements
            await expect(element).toHaveJSProperty("value", initialValue);
        });
    });

    test.describe("initial value", () => {
        test("should initialize to the provided `value` attribute when set pre-connection", async ({
            page,
        }) => {
            await page.goto(fixtureURL("checkbox--checkbox", { value: "foo" }));

            const element = page.locator("fast-checkbox");

            const value = await element.evaluate((node: FASTCheckbox) => node.value);

            expect(value).toBe("foo");
        });

        test("should initialize to the provided `value` attribute when set post-connection", async ({
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

        test("should initialize to the provided `value` property when set pre-connection", async ({
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
    });

    test.describe("when the `required` property is true", () => {
        let page: Page;
        let element: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-checkbox");

            await page.goto(fixtureURL("checkbox--checkbox-in-form", { required: true }));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should be invalid when unchecked", async () => {
            expect(
                await element.evaluate((node: FASTCheckbox) => node.validity.valueMissing)
            ).toBe(true);
        });

        test("should be valid when checked", async () => {
            await element.click();

            await expect(element).toHaveJSProperty("checked", true);

            expect(
                await element.evaluate((node: FASTCheckbox) => node.validity.valueMissing)
            ).toBe(false);
        });
    });

    test.describe("whose parent form has its reset() method invoked", () => {
        let page: Page;
        let element: Locator;
        let form: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-checkbox");

            form = page.locator("form");

            await page.goto(fixtureURL("checkbox--checkbox-in-form", { required: true }));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should set the `checked` property to false if the `checked` attribute is unset", async () => {
            await expect(element).toHaveJSProperty("checked", false);

            await element.evaluate((node: FASTCheckbox) => {
                node.checked = true;
            });

            await expect(element).toHaveJSProperty("checked", true);

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("checked", false);
        });

        test("should set its checked property to true if the checked attribute is set", async () => {
            await expect(element).toHaveJSProperty("checked", false);

            await element.evaluate((node: FASTCheckbox) => {
                node.setAttribute("checked", "");
            });

            await expect(element).toHaveJSProperty("checked", true);

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("checked", true);
        });

        test("should put the control into a clean state, where checked attribute modifications change the checked property prior to user or programmatic interaction", async () => {
            page.goto(fixtureURL("checkbox--checkbox-in-form", { required: true }));

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
