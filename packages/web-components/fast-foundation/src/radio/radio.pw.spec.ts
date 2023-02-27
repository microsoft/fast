import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTRadio } from "./radio.js";

test.describe("Radio", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-radio");

        root = page.locator("#root");

        await page.goto(fixtureURL("radio--radio"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should have a role of `radio`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio>Radio</fast-radio>
            `;
        });

        await expect(element).toHaveAttribute("role", "radio");
    });

    test("should set ARIA attributes to match the state", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio>Radio</fast-radio>
            `;
        });

        // Checked
        await expect(element).toHaveAttribute("aria-checked", "false");

        await element.evaluate((node: FASTRadio) => (node.checked = true));

        await expect(element).toHaveAttribute("aria-checked", "true");

        await element.evaluate((node: FASTRadio) => (node.checked = false));

        await expect(element).toHaveAttribute("aria-checked", "false");

        // Required
        await expect(element).toHaveAttribute("aria-required", "false");

        await element.evaluate((node: FASTRadio) => (node.required = true));

        await expect(element).toHaveAttribute("aria-required", "true");

        await element.evaluate((node: FASTRadio) => (node.required = false));

        await expect(element).toHaveAttribute("aria-required", "false");

        // Disabled
        await expect(element).toHaveAttribute("aria-disabled", "false");

        await element.evaluate((node: FASTRadio) => (node.disabled = true));

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate((node: FASTRadio) => (node.disabled = false));

        await expect(element).toHaveAttribute("aria-disabled", "false");

        // Readonly
        await expect(element).not.hasAttribute("aria-readonly");

        await element.evaluate((node: FASTRadio) => (node.readOnly = true));

        await expect(element).toHaveAttribute("aria-readonly", "true");

        await element.evaluate((node: FASTRadio) => (node.readOnly = false));

        await expect(element).toHaveAttribute("aria-readonly", "false");
    });

    test("should set a tabindex of 0 on the element", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio>Radio</fast-radio>
            `;
        });

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should NOT set a tabindex when disabled is `true`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio disabled></fast-radio>
            `;
        });

        await expect(element).toHaveAttribute("tabindex", "");
    });

    test("should initialize to the initial value if no value property is set", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio>Radio</fast-radio>
            `;
        });

        await expect(element).toHaveJSProperty("value", "on");

        await expect(element).toHaveJSProperty("initialValue", "on");
    });

    test("should initialize to the provided value attribute if set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio>Radio</fast-radio>
            `;
        });

        await element.evaluate((node: FASTRadio) => node.setAttribute("value", "foo"));

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value attribute if set post-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio>Radio</fast-radio>
            `;
        });

        await element.evaluate((node: FASTRadio) => node.setAttribute("value", "foo"));

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value property if set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio value="foo"></fast-radio>
            `;
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should set the `label__hidden` class on the internal label when default slotted content does not exist", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio>label</fast-radio>
            `;
        });

        const label = element.locator("label");

        await expect(label).toHaveClass(/^label$/);

        await element.evaluate(node => {
            node.textContent = "";
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should fire an event when spacebar is pressed", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio>Radio</fast-radio>
            `;
        });

        const [wasPressed] = await Promise.all([
            element.evaluate(
                (node: FASTRadio) =>
                    new Promise(resolve =>
                        node.addEventListener("keydown", () => resolve(true), {
                            once: true,
                        })
                    )
            ),
            // FIXME: Playwright's keyboard API is not working as expected.
            element.evaluate(node =>
                node.dispatchEvent(new KeyboardEvent("keydown", { key: " " }))
            ),
        ]);

        expect(wasPressed).toBeTruthy();
    });

    test("should NOT fire events when clicked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio>Radio</fast-radio>
            `;
        });

        const [wasClicked] = await Promise.all([
            element.evaluate(
                (node: FASTRadio) =>
                    new Promise(resolve =>
                        node.addEventListener("click", () => resolve(false), {
                            once: true,
                        })
                    )
            ),
            element.evaluate(node => {
                node.dispatchEvent(new MouseEvent("click"));
            }),
        ]);

        expect(wasClicked).toBeFalsy();
    });

    test("should handle validity when the `required` attribute is present", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-radio-group>
                    <fast-radio required name="name" value="test">Radio</fast-radio>
                <fast-radio-group>
            `;
        });

        expect(
            await element.evaluate((node: FASTRadio) => node.validity.valueMissing)
        ).toBe(true);

        await element.click();

        expect(
            await element.evaluate((node: FASTRadio) => node.validity.valueMissing)
        ).toBe(false);
    });

    test.describe("whose parent form has its reset() method invoked", () => {
        test("should set its checked property to false if the checked attribute is unset", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-radio>Radio</fast-radio>
                    </form>
                `;
            });

            const form = page.locator("form");

            await element.evaluate((node: FASTRadio) => (node.checked = true));

            await expect(element).toBeChecked();

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).not.toBeChecked();
        });

        test("should set its checked property to true if the checked attribute is set", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-radio checked></fast-radio>
                    </form>
                `;
            });

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

        test("should put the control into a clean state, where `checked` attribute modifications modify the `checked` property prior to user or programmatic interaction", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-radio>Radio</fast-radio>
                    </form>
                `;
            });

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
