import { expect, test } from "@playwright/test";
import type { FASTListboxOption } from "../listbox-option/index.js";
import type { FASTSelect } from "./select.js";

test.describe("Select", () => {
    test("should have a role of `combobox`", async ({ page }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select></fast-select>
            `;
        });

        await expect(element).toHaveAttribute("role", "combobox");
    });

    test("should have a tabindex of 0 when `disabled` is not defined", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should set the `aria-disabled` attribute equal to the `disabled` value", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should have the attribute aria-expanded set to false", async ({ page }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select></fast-select>
            `;
        });

        await expect(element).toHaveAttribute("aria-expanded", "false");
    });

    test("should set its value to the first enabled option", async ({ page }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should NOT have a tabindex when `disabled` is true", async ({ page }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-select disabled></fast-select>
            `;
        });

        await expect(element).not.hasAttribute("tabindex");
    });

    test("should set its value to the first enabled option when disabled", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should select the first option with a `selected` attribute", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should select the first option with a `selected` attribute when disabled", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should return the same value when the `value` property is set before connect", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should return the same value when the value property is set after connect", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should select the next selectable option when the value is set to match a disabled option", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should update the `value` property when the selected option's `value` property changes", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should return the `value` property as a string", async ({ page }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should update the aria-expanded attribute when opened", async ({ page }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should display the listbox when the `open` property is true before connecting", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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
            test(`should NOT emit \`${eventName}\` event while open when the value changes by user input via ${key} key`, async ({
                page,
            }) => {
                const element = page.locator("fast-select");

                await page.goto("http://localhost:6006");

                await page.locator("#root").evaluate(node => {
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

            test(`should emit \`${eventName}\` event while closed when the value changes by user input via ${key} key`, async ({
                page,
            }) => {
                const element = page.locator("fast-select");

                await page.goto("http://localhost:6006");

                await page.locator("#root").evaluate(node => {
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
            test(`should NOT emit \`${eventName}\` event`, async ({ page }) => {
                const element = page.locator("fast-select");

                await page.goto("http://localhost:6006");

                await page.locator("#root").evaluate(node => {
                    node.innerHTML = /* html */ `
                        <fast-select>
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

                    element.evaluate<void, FASTSelect>(node => {
                        node.value = "Option 2";
                    }),
                ]);

                expect(wasChanged).not.toBe(eventName);
            });
        });
    });

    test.describe("when the owning form's reset() function is invoked", () => {
        test("should reset the value property to the first available option", async ({
            page,
        }) => {
            const element = page.locator("fast-select");

            await page.goto("http://localhost:6006");

            await page.locator("#root").evaluate(node => {
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

    test("should set the `aria-activedescendant` attribute to the ID of the currently selected option", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should set the `aria-controls` attribute to the ID of the internal listbox element while open", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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

    test("should update the `displayValue` when the selected option's content changes", async ({
        page,
    }) => {
        const element = page.locator("fast-select");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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
