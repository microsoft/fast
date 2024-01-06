import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import type { FASTListboxOption } from "../listbox-option/index.js";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSelect } from "./select.js";

test.describe("Select", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let placeholder: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-select");

        root = page.locator("#root");

        placeholder = element.locator(".placeholder");

        await page.goto(fixtureURL("select--select"), {
            waitUntil: "load",
        });
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should have a role of `combobox`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select></fast-select>
            `;
        });

        await expect(element).toHaveAttribute("role", "combobox");
    });

    test("should have a tabindex of 0 when `disabled` is not defined", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` value", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select disabled></fast-select>
            `;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate<void, FASTSelect>(node => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should have the attribute aria-expanded set to false", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select></fast-select>
            `;
        });

        await expect(element).toHaveAttribute("aria-expanded", "false");
    });

    test("should set the attribute aria-required to true when required attribute is present", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select required></fast-select>
            `;
        });

        await expect(element).toHaveAttribute("aria-required", "true");
    });

    test("should render placeholder option when select is collapsible", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select placeholder="my placeholder">
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(placeholder).toContainText("my placeholder");
    });

    test("should not render placeholder option when the multiple attribute is present", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select multiple placeholder="placeholder">
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(placeholder).toHaveCount(0);
    });

    test("should not render placeholder option when the size attribute is present", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select size="3" placeholder="placeholder">
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(placeholder).toHaveCount(0);
    });

    test("should set its value to the first enabled option", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(element).toHaveJSProperty("value", "Option 1");

        await expect(element).toHaveJSProperty("selectedIndex", 0);
    });

    test("should not set default value when placeholder is set", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select placeholder="my placeholder">
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(element).not.hasAttribute("value");
        await expect(element).toHaveJSProperty("currentIndex", undefined);
        await expect(element).not.hasAttribute("currentIndex");
        await expect(element).not.toHaveJSProperty("selectedIndex", 0);
    });

    test("should handle validity when the `required` attribute is present", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select required placeholder="my placeholder">
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await element.evaluate<void, FASTSelect>(node => {
            node.open = true;
        });

        const options = element.locator("fast-option");
        const option = options.nth(0);

        expect(
            await element.evaluate((node: FASTSelect) => node.validity.valueMissing)
        ).toBe(true);

        await option.click();

        expect(
            await element.evaluate((node: FASTSelect) => node.validity.valueMissing)
        ).toBe(false);
    });

    test("should NOT have a tabindex when `disabled` is true", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select disabled></fast-select>
            `;
        });

        await expect(element).not.hasAttribute("tabindex");
    });

    test("should set its value to the first enabled option when disabled", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select disabled>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(element).toHaveJSProperty("value", "Option 1");

        await expect(element).toHaveJSProperty("selectedIndex", 0);
    });

    test("should select the first option with a `selected` attribute", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select>
                    <fast-option>Option 1</fast-option>
                    <fast-option selected>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(element).toHaveJSProperty("value", "Option 2");

        await expect(element).toHaveJSProperty("selectedIndex", 1);
    });

    test("should select the first option with a `selected` attribute when disabled", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select disabled>
                    <fast-option>Option 1</fast-option>
                    <fast-option selected>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(element).toHaveJSProperty("value", "Option 2");

        await expect(element).toHaveJSProperty("selectedIndex", 1);
    });

    test("should return the same value when the `value` property is set before connect", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select value="Option 2">
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(element).toHaveJSProperty("value", "Option 2");
    });

    test("should return the same value when the value property is set after connect", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await element.evaluate<void, FASTSelect>(node => {
            node.value = "Option 3";
        });

        await expect(element).toHaveJSProperty("value", "Option 3");
    });

    test("should select the next selectable option when the value is set to match a disabled option", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select>
                    <fast-option>Option 1</fast-option>
                    <fast-option disabled>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(element).toHaveJSProperty("value", "Option 1");

        await expect(element).toHaveJSProperty("selectedIndex", 0);

        await element.evaluate<void, FASTSelect>(node => {
            node.value = "Option 2";
        });

        await expect(element).toHaveJSProperty("value", "Option 3");

        await expect(element).toHaveJSProperty("selectedIndex", 2);
    });

    test("should update the `value` property when the selected option's `value` property changes", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        const options = element.locator("fast-option");

        await expect(element).toHaveJSProperty("value", "Option 1");

        await options.first().evaluate<void, FASTListboxOption>(node => {
            node.value = "new value";
        });

        await expect(element).toHaveJSProperty("value", "new value");
    });

    test("should return the `value` property as a string", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select>
                    <fast-option value="1">Option 1</fast-option>
                    <fast-option value="2">Option 2</fast-option>
                    <fast-option value="3">Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(element).toHaveJSProperty("value", "1");

        expect(
            await element.evaluate<string, FASTSelect>(node => typeof node.value)
        ).toBe("string");
    });

    test("should update the aria-expanded attribute when opened", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        await element.evaluate(node =>
            Promise.all(node.getAnimations({ subtree: true }).map(a => a.finished))
        );

        element.click();

        await expect(element).toHaveAttribute("aria-expanded", "true");
    });

    test("should display the listbox when the `open` property is true before connecting", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select open>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        const listbox = element.locator(".listbox");

        await expect(element).toHaveBooleanAttribute("open");

        await expect(listbox).toBeVisible();
    });

    ["input", "change"].forEach(eventName => {
        [
            { expectedValue: "Option 2", key: "ArrowDown" },
            { expectedValue: "Option 1", key: "ArrowUp" },
            { expectedValue: "Option 3", key: "End" },
            { expectedValue: "Option 1", key: "Home" },
        ].forEach(({ expectedValue, key }) => {
            test(`should NOT emit \`${eventName}\` event while open when the value changes by user input via ${key} key`, async () => {
                await root.evaluate(node => {
                    node.innerHTML = /* html */ `
                        <fast-select open>
                            <fast-option>Option 1</fast-option>
                            <fast-option>Option 2</fast-option>
                            <fast-option>Option 3</fast-option>
                        </fast-select>
                    `;
                });

                const [wasChanged] = await Promise.all([
                    element.evaluate(
                        (node, eventName) =>
                            Promise.race([
                                new Promise(resolve =>
                                    node.addEventListener(eventName, () =>
                                        resolve(eventName)
                                    )
                                ),
                                new Promise(resolve =>
                                    requestAnimationFrame(() =>
                                        setTimeout(() => resolve(false))
                                    )
                                ),
                            ]),
                        eventName
                    ),

                    element.evaluate((node, key) => {
                        node.dispatchEvent(new KeyboardEvent("keydown", { key }));
                    }, key),
                ]);

                expect(wasChanged).not.toBe(eventName);

                await expect(element).toHaveJSProperty("value", expectedValue);
            });

            test(`should emit \`${eventName}\` event while closed when the value changes by user input via ${key} key`, async () => {
                await root.evaluate(node => {
                    node.innerHTML = /* html */ `
                        <fast-select>
                            <fast-option>Option 1</fast-option>
                            <fast-option>Option 2</fast-option>
                            <fast-option>Option 3</fast-option>
                        </fast-select>
                    `;
                });

                const [wasChanged] = await Promise.all([
                    element.evaluate((node, eventName) => {
                        return new Promise(resolve => {
                            node.addEventListener(eventName, () => resolve(eventName));
                        });
                    }, eventName),

                    element.evaluate((node, key) => {
                        node.dispatchEvent(new KeyboardEvent("keydown", { key }));
                    }, key),
                ]);

                expect(wasChanged).toBe(eventName);

                await expect(element).toHaveJSProperty("value", expectedValue);
            });
        });
    });

    test.describe("when the value changes by programmatic interaction", () => {
        ["input", "change"].forEach(eventName => {
            test(`should NOT emit \`${eventName}\` event`, async () => {
                await page.goto(fixtureURL("select--select"));

                const [wasChanged] = await Promise.all([
                    element.evaluate(
                        (node, eventName) =>
                            Promise.race([
                                new Promise(resolve =>
                                    node.addEventListener(eventName, () =>
                                        resolve(eventName)
                                    )
                                ),
                                new Promise(resolve =>
                                    requestAnimationFrame(() =>
                                        setTimeout(() => resolve(false))
                                    )
                                ),
                            ]),
                        eventName
                    ),

                    element.evaluate<void, FASTSelect>(node => {
                        node.value = "Tom Baker";
                    }),
                ]);

                expect(wasChanged).not.toBe(eventName);
            });
        });
    });

    test.describe("when the owning form's reset() function is invoked", () => {
        test("should reset the value property to the first available option", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-select>
                            <fast-option>Option 1</fast-option>
                            <fast-option>Option 2</fast-option>
                            <fast-option>Option 3</fast-option>
                        </fast-select>
                    </form>
                `;
            });

            const form = page.locator("form");

            await expect(element).toHaveJSProperty("value", "Option 1");

            await element.evaluate<void, FASTSelect>(node => {
                node.value = "Option 2";
            });

            await expect(element).toHaveJSProperty("value", "Option 2");

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "Option 1");
        });
    });

    test("should set the `aria-activedescendant` attribute to the ID of the currently selected option", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select>
                    <fast-option id="option-1">Option 1</fast-option>
                    <fast-option id="option-2">Option 2</fast-option>
                    <fast-option id="option-3">Option 3</fast-option>
                </fast-select>
            `;
        });

        await expect(element).toHaveAttribute("aria-activedescendant", "option-1");

        await element.evaluate<void, FASTSelect>(node => {
            node.selectNextOption();
        });

        await expect(element).toHaveAttribute("aria-activedescendant", "option-2");

        await element.evaluate<void, FASTSelect>(node => {
            node.selectNextOption();
        });

        await expect(element).toHaveAttribute("aria-activedescendant", "option-3");
    });

    test("should set the `aria-controls` attribute to the ID of the internal listbox element while open", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        const listbox = element.locator(".listbox");

        const listboxId = await listbox.evaluate(node => node.id);

        await expect(element).toHaveAttribute("aria-controls", "");

        await element.evaluate<void, FASTSelect>(node => {
            node.open = true;
        });

        await expect(element).toHaveAttribute("aria-controls", listboxId);

        await element.evaluate<void, FASTSelect>(node => {
            node.open = false;
        });

        await expect(element).toHaveAttribute("aria-controls", "");
    });

    test("should update the `displayValue` when the selected option's content changes", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-select>
            `;
        });

        const options = element.locator("fast-option");

        await expect(element).toHaveJSProperty("displayValue", "Option 1");

        options.first().evaluate(node => {
            node.innerHTML = "innerHTML value";
        });

        await expect(element).toHaveJSProperty("displayValue", "innerHTML value");

        options.first().evaluate<void, FASTSelect>(node => {
            node.innerText = "innerText value";
        });

        await expect(element).toHaveJSProperty("displayValue", "innerText value");

        options.first().evaluate<void, FASTSelect>(node => {
            node.textContent = "textContent value";
        });

        await expect(element).toHaveJSProperty("displayValue", "textContent value");
    });
});
