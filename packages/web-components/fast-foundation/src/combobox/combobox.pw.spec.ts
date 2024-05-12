import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTCombobox } from "./combobox.js";

test.describe("Combobox", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let control: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-combobox");

        root = page.locator("#root");

        control = element.locator(`input[role="combobox"]`);

        await page.goto(fixtureURL("combobox--combobox"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('should include a control with a `role` attribute equal to "combobox"', async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-combobox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-combobox>
            `;
        });

        await expect(control).toHaveCount(1);
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-combobox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-combobox>
            `;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");

        await element.evaluate((node: FASTCombobox) => {
            node.disabled = true;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate((node: FASTCombobox) => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should set and remove the `tabindex` attribute based on the value of the `disabled` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-combobox disabled>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-combobox>
            `;
        });

        await expect(element).not.toHaveAttribute("tabindex");

        await element.evaluate((node: FASTCombobox) => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should NOT set the `value` property to the first available option", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-combobox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-combobox>
            `;
        });

        await expect(element).toHaveJSProperty("value", "");

        await expect(control).toHaveValue("");
    });

    test("should set the `placeholder` attribute on the internal control equal to the `placeholder` attribute", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-combobox placeholder="placeholder text">
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-combobox>
            `;
        });

        await expect(element).toHaveJSProperty("placeholder", "placeholder text");

        await expect(control).toHaveAttribute("placeholder", "placeholder text");
    });

    test("should set the control's `aria-controls` attribute to the ID of the internal listbox element while open", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-combobox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-combobox>
            `;
        });

        const listbox = element.locator(".listbox");

        const listboxId = (await listbox.getAttribute("id")) as string;

        await expect(control).toHaveAttribute("aria-controls", "");

        await element.evaluate((node: FASTCombobox) => {
            node.open = true;
        });

        await expect(control).toHaveAttribute("aria-controls", listboxId);

        await element.evaluate((node: FASTCombobox) => {
            node.open = false;
        });

        await expect(control).toHaveAttribute("aria-controls", "");
    });

    test("should set the control's `aria-activedescendant` property to the ID of the currently selected option while open", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-combobox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-combobox>
            `;
        });

        const options = element.locator("fast-option");

        await expect(control).not.toHaveAttribute("aria-activedescendant");

        await element.evaluate((node: FASTCombobox) => {
            node.open = true;
        });

        await expect(element).not.toHaveAttribute("aria-activedescendant");

        const optionsCount = await options.count();

        for (let i = 0; i < optionsCount; i++) {
            const option = options.nth(i);

            await element.evaluate((node: FASTCombobox) => {
                node.selectNextOption();
            });

            const optionId = await option.evaluate(node => node.id);

            await expect(control).toHaveAttribute("aria-activedescendant", optionId);
        }

        await element.evaluate((node: FASTCombobox) => {
            node.value = "other";
        });

        await expect(control).toHaveAttribute("aria-activedescendant");

        await expect(element).not.toHaveAttribute("aria-activedescendant");
    });

    test("should set its value to the first option with the `selected` attribute present", async () => {
        await root.evaluate(node => {
            node.innerHTML = "";

            const combobox = document.createElement("fast-combobox");
            const options = ["one", "two", "three"].map(s => {
                const option = document.createElement("fast-option");
                option.textContent = s;
                return option;
            });

            options[1].setAttribute("selected", "");

            combobox.append(...options);

            node.append(combobox);
        });

        const option2 = element.locator("fast-option:nth-of-type(2)");

        expect(await option2.getAttribute("selected")).toBe("");

        await expect(element).toHaveJSProperty("value", "two");
    });

    test("should return the same value when the `value` property is set before connecting", async () => {
        await root.evaluate(node => {
            node.innerHTML = "";

            const combobox = document.createElement("fast-combobox") as FASTCombobox;
            combobox.value = "test";
            node.append(combobox);
        });

        expect(await element.evaluate((node: FASTCombobox) => node.value)).toBe("test");
    });

    test("should return the same value when the `value` property is set after connecting", async () => {
        await root.evaluate(node => {
            node.innerHTML = "";

            const combobox = document.createElement("fast-combobox") as FASTCombobox;
            node.append(combobox);
        });

        await element.evaluate((node: FASTCombobox) => {
            node.value = "test";
        });

        await expect(element).toHaveJSProperty("value", "test");
    });

    test("should display the listbox when the `open` property is true before connecting", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-combobox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-combobox>
            `;
        });

        const listbox = element.locator(".listbox");

        await expect(listbox).not.toBeVisible();

        await element.evaluate((node: FASTCombobox) => {
            node.open = true;
        });

        await expect(element).toHaveAttribute("open");

        await expect(listbox).toBeVisible();
    });

    test.describe("should NOT emit a 'change' event when the value changes by user input while open", () => {
        test("via arrow down key", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                        <fast-combobox>
                            <fast-option>Option 1</fast-option>
                            <fast-option>Option 2</fast-option>
                            <fast-option>Option 3</fast-option>
                        </fast-combobox>
                    `;
            });

            await element.click();

            await element.locator(".listbox").waitFor({ state: "visible" });

            await expect(element).toHaveAttribute("open");

            const [wasChanged] = await Promise.all([
                element.evaluate(node =>
                    Promise.race<boolean>([
                        new Promise(resolve => {
                            node.addEventListener("change", () => resolve(true));
                        }),
                        new Promise(resolve => setTimeout(() => resolve(false), 100)),
                    ])
                ),
                element.press("ArrowDown"),
            ]);

            expect(wasChanged).toBeFalsy();
        });

        test("via arrow up key", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                        <fast-combobox>
                            <fast-option>Option 1</fast-option>
                            <fast-option>Option 2</fast-option>
                            <fast-option>Option 3</fast-option>
                        </fast-combobox>
                    `;
            });

            await element.evaluate((node: FASTCombobox) => {
                node.value = "two";
            });

            await element.click();

            await element.locator(".listbox").waitFor({ state: "visible" });

            await expect(element).toHaveAttribute("open");

            const [wasChanged] = await Promise.all([
                element.evaluate(node =>
                    Promise.race<boolean>([
                        new Promise(resolve => {
                            node.addEventListener("change", () => resolve(true));
                        }),
                        new Promise(resolve => setTimeout(() => resolve(false), 100)),
                    ])
                ),
                element.press("ArrowUp"),
            ]);

            expect(wasChanged).toBeFalsy();
        });
    });

    test.describe("should NOT emit a 'change' event when the value changes by programmatic interaction", () => {
        test("via end key", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                        <fast-combobox>
                            <fast-option>Option 1</fast-option>
                            <fast-option>Option 2</fast-option>
                            <fast-option>Option 3</fast-option>
                        </fast-combobox>
                    `;
            });

            await element.evaluate((node: FASTCombobox) => {
                node.value = "two";
            });

            const [wasChanged] = await Promise.all([
                element.evaluate(node =>
                    Promise.race<boolean>([
                        new Promise(resolve => {
                            node.addEventListener("change", () => resolve(true));
                        }),
                        new Promise(resolve => setTimeout(() => resolve(false), 50)),
                    ])
                ),
                element.press("End"),
            ]);

            expect(wasChanged).toBeFalsy();

            await expect(element).toHaveJSProperty("value", "two");
        });
    });

    test.describe("when the owning form's reset() function is invoked", () => {
        test("should reset the value property to its initial value", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-combobox value="one">
                            <fast-option>Option 1</fast-option>
                            <fast-option>Option 2</fast-option>
                            <fast-option>Option 3</fast-option>
                        </fast-combobox>
                    </form>
                `;
            });

            const form = page.locator("form");

            await expect(element).toHaveJSProperty("value", "one");

            await element.evaluate((node: FASTCombobox) => {
                node.value = "two";
            });

            await expect(element).toHaveJSProperty("value", "two");

            await form.evaluate((node: HTMLFormElement) => node.reset());

            await expect(element).toHaveJSProperty("value", "one");
        });

        test("should reset its value property to the first option with the `selected` attribute present", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-combobox>
                            <fast-option>Option 1</fast-option>
                            <fast-option selected>Option 2</fast-option>
                            <fast-option>Option 3</fast-option>
                        </fast-combobox>
                    </form>
                `;
            });

            const form = page.locator("form");

            await expect(element).toHaveJSProperty("value", "Option 2");

            await element.evaluate((node: FASTCombobox) => {
                node.value = "two";
            });

            await expect(element).toHaveJSProperty("value", "two");

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "Option 2");
        });
    });

    test("should focus the control when an associated label is clicked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-combobox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-combobox>
            `;
        });

        // Skip this test if the browser if ElementInternals isn't supported
        if (!(await page.evaluate(() => window.hasOwnProperty("ElementInternals")))) {
            test.skip();
        }

        const label = page.locator("label");

        await root.evaluate(
            (node, { element }) => {
                const label = document.createElement("label");
                label.setAttribute("for", "test-combobox");
                label.textContent = "label";

                element.id = "test-combobox";

                node.append(label);
            },
            { element: await element.evaluateHandle((node: FASTCombobox) => node) }
        );

        await label.click();

        await expect(element).toBeFocused();
    });

    test("should close the listbox when the indicator is clicked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-combobox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-combobox>
            `;
        });

        const indicator = element.locator(".indicator");

        await element.evaluate((node: FASTCombobox) => {
            node.open = true;
        });

        await expect(element).toHaveAttribute("open");

        await indicator.click();

        await expect(element).not.toHaveAttribute("open");
    });

    test("should not close the listbox when a disabled option is clicked", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-combobox>
                    <fast-option>Option 1</fast-option>
                    <fast-option disabled>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-combobox>
            `;
        });

        const options = element.locator("fast-option");

        await element.evaluate((node: FASTCombobox) => {
            node.open = true;
        });

        await expect(element).toHaveAttribute("open");

        await options.nth(1).click({
            force: true,
        });

        await expect(element).toHaveAttribute("open");

        await options.nth(2).click();

        await expect(element).not.toHaveAttribute("open");
    });
});
