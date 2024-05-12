import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTCheckbox } from "./checkbox.js";

test.describe("Checkbox", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let form: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-checkbox");

        root = page.locator("#root");

        form = page.locator("form");

        await page.goto(fixtureURL("checkbox--checkbox"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should have a role of `checkbox`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });
        await expect(element).toHaveAttribute("role", "checkbox");
    });

    test("should set a tabindex of 0 on the element", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });

        await expect(element).toHaveJSProperty("tabIndex", 0);

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should set a default `aria-checked` value when `checked` is not defined", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });

        await expect(element).not.toHaveAttribute("checked");

        await expect(element).toHaveAttribute("aria-checked", "false");
    });

    test("should set the `aria-checked` attribute equal to the `checked` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox checked></fast-checkbox>
            `;
        });

        await expect(element).toHaveAttribute("aria-checked", "true");

        await element.evaluate((node: FASTCheckbox) => {
            node.checked = false;
        });

        await expect(element).toHaveAttribute("aria-checked", "false");
    });

    test("should NOT set a default `aria-required` value when `required` is not defined", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });

        await expect(element).not.toHaveAttribute("required");

        await expect(element).toHaveAttribute("aria-required", "false");
    });

    test("should set the `aria-required` attribute equal to the `required` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });

        await element.evaluate((node: FASTCheckbox) => {
            node.required = true;
        });

        await expect(element).toHaveAttribute("aria-required", "true");

        await element.evaluate((node: FASTCheckbox) => {
            node.required = false;
        });

        await expect(element).toHaveAttribute("aria-required", "false");
    });

    test("should set a default `aria-disabled` value when `disabled` is not defined", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });

        await expect(element).not.toHaveAttribute("disabled");

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });

        await element.evaluate((node: FASTCheckbox) => {
            node.disabled = true;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate((node: FASTCheckbox) => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should NOT set a tabindex when `disabled` is true", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox disabled></fast-checkbox>
            `;
        });

        await expect(element).not.toHaveJSProperty("tabIndex", 0);

        await expect(element).not.toHaveAttribute("tabindex", "0");
    });

    test("should set the aria-checked value to 'mixed' when indeterminate property is true", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });

        await element.evaluate((node: FASTCheckbox) => {
            node.indeterminate = true;
        });

        await expect(element).toHaveAttribute("aria-checked", "mixed");

        await element.evaluate((node: FASTCheckbox) => {
            node.indeterminate = false;
        });

        await expect(element).toHaveAttribute("aria-checked", "false");
    });

    test("should set off `indeterminate` on `checked` change by user click", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox>checkbox</fast-checkbox>
            `;
        });

        await element.evaluate((node: FASTCheckbox) => {
            node.indeterminate = true;
        });

        await expect(element).toHaveJSProperty("indeterminate", true);

        await element.click();

        await expect(element).toHaveJSProperty("indeterminate", false);
    });

    test("should set off `indeterminate` on `checked` change by user keypress", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });

        await element.evaluate((node: FASTCheckbox) => {
            node.indeterminate = true;
        });

        await expect(element).toHaveJSProperty("indeterminate", true);

        await element.press(" ");

        await expect(element).toHaveJSProperty("indeterminate", false);
    });

    test("should add a class of `label` to the internal label when default slotted content exists", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox>
                    <span>Label</span>
                </fast-checkbox>
            `;
        });

        const label = element.locator("label");

        await expect(label).toHaveClass(/label/);
    });

    test("should add classes of `label` and `label__hidden` to the internal label when default slotted content exists", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox>
                    <span>Label</span>
                </fast-checkbox>
            `;
        });

        const label = element.locator("label");

        await element.evaluate((node: FASTCheckbox) => {
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        });

        await expect(label).toHaveClass(/label label__hidden/);
    });

    test("should initialize to the initial value if no value property is set", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });

        const initialValue = await element.evaluate(
            (node: FASTCheckbox) => node.initialValue
        );

        // Playwright doesn't yet see our components as input elements
        await expect(element).toHaveJSProperty("value", initialValue);
    });

    test("should initialize to the provided `value` attribute when set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox value="foo"></fast-checkbox>
            `;
        });

        const element = page.locator("fast-checkbox");

        const value = await element.evaluate((node: FASTCheckbox) => node.value);

        expect(value).toBe("foo");
    });

    test("should initialize to the provided `value` attribute when set post-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });

        const element = page.locator("fast-checkbox");

        const expectedValue = "foobar";

        await element.evaluate((node: FASTCheckbox, expectedValue) => {
            node.setAttribute("value", expectedValue);
        }, expectedValue);

        await expect(element).toHaveJSProperty("value", expectedValue);
    });

    test("should initialize to the provided `value` property when set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-checkbox></fast-checkbox>
            `;
        });

        const expectedValue = "foobar";

        const value = await page.evaluate(expectedValue => {
            const node = document.createElement("fast-checkbox") as FASTCheckbox;

            node.value = expectedValue;

            return Promise.resolve(node.value);
        }, expectedValue);

        expect(value).toBe(expectedValue);
    });

    test("should be invalid when unchecked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <form>
                    <fast-checkbox required></fast-checkbox>
                </form>
            `;
        });

        expect(
            await element.evaluate((node: FASTCheckbox) => node.validity.valueMissing)
        ).toBe(true);
    });

    test("should be valid when checked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <form>
                    <fast-checkbox required>checkbox</fast-checkbox>
                </form>
            `;
        });

        await element.click();

        await expect(element).toHaveJSProperty("checked", true);

        expect(
            await element.evaluate((node: FASTCheckbox) => node.validity.valueMissing)
        ).toBe(false);
    });

    test("should set the `checked` property to false if the `checked` attribute is unset", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <form>
                    <fast-checkbox></fast-checkbox>
                </form>
            `;
        });

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
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <form>
                    <fast-checkbox></fast-checkbox>
                </form>
            `;
        });

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
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <form>
                    <fast-checkbox required></fast-checkbox>
                </form>
            `;
        });

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

        expect(await element.evaluate((node: FASTCheckbox) => node.value)).toBeTruthy();
    });
});
