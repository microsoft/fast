import { expect, test } from "@playwright/test";
import type { FASTListboxOption } from "../listbox-option/index.js";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSelect } from "./select.js";

test.describe("Select", () => {
    test("should have a role of `combobox`", async ({ page }) => {
        await page.goto(fixtureURL("select--select"));

        const element = page.locator("fast-select");

        await expect(element).toHaveAttribute("role", "combobox");
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("select--select", { disabled: true }));

        const element = page.locator("fast-select");

        await element.evaluate<void, FASTSelect>(node => {
            node.disabled = true;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate<void, FASTSelect>(node => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should have a tabindex of 0 when `disabled` is not defined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("select--select"));

        const element = page.locator("fast-select");

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should have the attribute aria-expanded set to false", async ({ page }) => {
        await page.goto(fixtureURL("select--select"));

        const element = page.locator("fast-select");

        await expect(element).toHaveAttribute("aria-expanded", "false");
    });

    test("should NOT have a tabindex when `disabled` is true", async ({ page }) => {
        await page.goto(fixtureURL("select--select", { disabled: true }));

        const element = page.locator("fast-select");

        expect(await element.getAttribute("tabindex")).toBeNull();
    });

    test("should set its value to the first enabled option", async ({ page }) => {
        await page.goto(fixtureURL("select--select"));

        const element = page.locator("fast-select");

        await expect(element).toHaveJSProperty("value", "William Hartnell");

        await expect(element).toHaveJSProperty("selectedIndex", 0);
    });

    test("should set its value to the first enabled option when disabled", async ({
        page,
    }) => {
        await page.goto(fixtureURL("select--select", { disabled: true }));

        const element = page.locator("fast-select");

        await expect(element).toHaveJSProperty("value", "William Hartnell");

        await expect(element).toHaveJSProperty("selectedIndex", 0);
    });

    test("should select the first option with a `selected` attribute", async ({
        page,
    }) => {
        await page.goto(fixtureURL("select--select", { "storyItems[2].selected": true }));

        const element = page.locator("fast-select");

        await expect(element).toHaveJSProperty("value", "Jon Pertwee");

        await expect(element).toHaveJSProperty("selectedIndex", 2);
    });

    test("should select the first option with a `selected` attribute when disabled", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("select--select", {
                disabled: true,
                "storyItems[2].selected": true,
            })
        );

        const element = page.locator("fast-select");

        await expect(element).toHaveJSProperty("value", "Jon Pertwee");

        await expect(element).toHaveJSProperty("selectedIndex", 2);
    });

    test("should return the same value when the `value` property is set before connect", async ({
        page,
    }) => {
        await page.goto(fixtureURL("select--select", { value: "Jon Pertwee" }));

        const element = page.locator("fast-select");

        await expect(element).toHaveJSProperty("value", "Jon Pertwee");
    });

    test("should return the same value when the value property is set after connect", async ({
        page,
    }) => {
        await page.goto(fixtureURL("select--select"));

        const element = page.locator("fast-select");

        await element.evaluate<void, FASTSelect>(node => {
            node.value = "Jon Pertwee";
        });

        await expect(element).toHaveJSProperty("value", "Jon Pertwee");
    });

    test("should select the next selectable option when the value is set to match a disabled option", async ({
        page,
    }) => {
        await page.goto(fixtureURL("select--select", { "storyItems[2].disabled": true }));

        const element = page.locator("fast-select");

        await expect(element).toHaveJSProperty("value", "William Hartnell");

        await expect(element).toHaveJSProperty("selectedIndex", 0);

        await element.evaluate<void, FASTSelect>(node => {
            node.value = "Jon Pertwee";
        });

        await expect(element).toHaveJSProperty("value", "Tom Baker");

        await expect(element).toHaveJSProperty("selectedIndex", 3);
    });

    test("should update the `value` property when the selected option's `value` property changes", async ({
        page,
    }) => {
        await page.goto(fixtureURL("select--select"));

        const element = page.locator("fast-select");

        const options = element.locator("fast-option");

        await expect(element).toHaveJSProperty("value", "William Hartnell");

        await options.first().evaluate<void, FASTListboxOption>(node => {
            node.value = "new value";
        });

        await expect(element).toHaveJSProperty("value", "new value");
    });

    test("should return the `value` property as a string", async ({ page }) => {
        await page.goto(
            fixtureURL("select--select", { "storyItems[2].value": 12345, value: 12345 })
        );

        const element = page.locator("fast-select");

        await expect(element).toHaveJSProperty("value", "12345");

        expect(
            await element.evaluate<string, FASTSelect>(node => typeof node.value)
        ).toBe("string");
    });

    test("should update the aria-expanded attribute when opened", async ({ page }) => {
        await page.goto(fixtureURL("select--select"));

        const element = page.locator("fast-select");

        element.click();

        await expect(element).toHaveAttribute("aria-expanded", "true");
    });

    test("should display the listbox when the `open` property is true before connecting", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("select--select", {
                open: true,
            })
        );

        const element = page.locator("fast-select");

        const listbox = element.locator(".listbox");

        expect(await element.evaluate(node => node.hasAttribute("open"))).toBeTruthy();

        await expect(listbox).toBeVisible();
    });

    test.describe("when the value changes by user input", () => {
        const eventNames = ["input", "change"];

        eventNames.forEach(eventName => {
            const testCriteria = [
                { key: "ArrowDown", expectedValue: "Tom Baker" },
                { key: "ArrowUp", expectedValue: "Patrick Troughton" },
                { key: "Home", expectedValue: "William Hartnell" },
                { key: "End", expectedValue: "Ncuti Gatwa" },
            ];

            testCriteria.forEach(({ key, expectedValue }) => {
                test.describe(`via ${key} key`, () => {
                    test(`should NOT emit \`${eventName}\` event while open`, async ({
                        page,
                    }) => {
                        await page.goto(
                            fixtureURL("select--select", {
                                "storyItems[2].selected": true,
                            })
                        );

                        const element = page.locator("fast-select");

                        await element.click();

                        expect(
                            await element.evaluate(node => node.hasAttribute("open"))
                        ).toBeTruthy();

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
                                                setTimeout(resolve)
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

                    test(`should emit \`${eventName}\` event while closed`, async ({
                        page,
                    }) => {
                        await page.goto(
                            fixtureURL("select--select", {
                                "storyItems[2].selected": true,
                            })
                        );

                        const element = page.locator("fast-select");

                        expect(
                            await element.evaluate(node => node.hasAttribute("open"))
                        ).toBeFalsy();

                        const [wasChanged] = await Promise.all([
                            element.evaluate((node, eventName) => {
                                return new Promise(resolve => {
                                    node.addEventListener(eventName, () =>
                                        resolve(eventName)
                                    );
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
        });
    });

    test.describe("when the value changes by programmatic interaction", () => {
        ["input", "change"].forEach(eventName => {
            test(`should NOT emit \`${eventName}\` event`, async ({ page }) => {
                await page.goto(fixtureURL("select--select"));

                const element = page.locator("fast-select");

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
                                    requestAnimationFrame(() => setTimeout(resolve))
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
        test("should reset the value property to the first available option", async ({
            page,
        }) => {
            await page.goto(fixtureURL("select--select-in-form"));

            const element = page.locator("fast-select");

            const form = page.locator("form");

            await expect(element).toHaveJSProperty("value", "William Hartnell");

            await element.evaluate<void, FASTSelect>(node => {
                node.value = "Jon Pertwee";
            });

            await expect(element).toHaveJSProperty("value", "Jon Pertwee");

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "William Hartnell");
        });
    });

    test("should set the `aria-activedescendant` attribute to the ID of the currently selected option", async ({
        page,
    }) => {
        await page.goto(fixtureURL("select--select"));

        const element = page.locator("fast-select");

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
        await page.goto(fixtureURL("select--select"));

        const element = page.locator("fast-select");

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
        await page.goto(fixtureURL("select--select"));

        const element = page.locator("fast-select");

        const options = element.locator("fast-option");

        await expect(element).toHaveJSProperty("displayValue", "William Hartnell");

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
