import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSwitch } from "./switch.js";

test.describe("Switch", () => {
    test.describe("States, attributes, and properties", () => {
        let page: Page;
        let element: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            await page.goto(fixtureURL("switch--switch"));

            element = page.locator("fast-switch");
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should have a role of `switch`", async () => {
            await expect(element).toHaveAttribute("role", "switch");
        });

        test("should set a tabindex of 0 on the element", async () => {
            await expect(element).toHaveAttribute("tabindex", "0");
        });

        test("should set a default `aria-checked` value when `checked` is not defined", async () => {
            await expect(element).toHaveAttribute("aria-checked", "false");
        });

        test("should set a default `aria-disabled` value when `disabled` is not defined", async () => {
            await expect(element).toHaveAttribute("aria-disabled", "false");
        });

        test("should NOT set a default `aria-readonly` value when `readonly` is not defined", async () => {
            await expect(element).not.hasAttribute("aria-readonly");
        });

        test("should set the `aria-checked` attribute equal to the `checked` property", async () => {
            await element.evaluate<void, FASTSwitch>(node => {
                node.checked = true;
            });

            await expect(element).toHaveAttribute("aria-checked", "true");

            await element.evaluate<void, FASTSwitch>(node => {
                node.checked = false;
            });

            await expect(element).toHaveAttribute("aria-checked", "false");
        });

        test("should set the `aria-readonly` attribute equal to the `readonly` value", async () => {
            await element.evaluate<void, FASTSwitch>(node => {
                node.readOnly = true;
            });

            await expect(element).toHaveAttribute("aria-readonly", "true");

            await element.evaluate<void, FASTSwitch>(node => {
                node.readOnly = false;
            });

            await expect(element).toHaveAttribute("aria-readonly", "false");
        });

        test('should add a class of "checked" when the `checked` property is true', async () => {
            await element.evaluate<void, FASTSwitch>(node => {
                node.checked = true;
            });

            await expect(element).toHaveClass(/checked/);

            await element.evaluate<void, FASTSwitch>(node => {
                node.checked = false;
            });

            await expect(element).not.toHaveClass(/checked/);
        });

        test("should initialize to the initial value if no value property is set", async () => {
            const initialValue = await element.evaluate<string, FASTSwitch>(
                node => node.initialValue
            );

            await expect(element).toHaveJSProperty("value", initialValue);
        });

        test.describe("label", () => {
            test("should add a class of `label` to the internal label when default slotted content exists", async () => {
                const label = element.locator(".label");

                await element.evaluate(node => {
                    node.innerHTML = "Label";
                });

                await expect(label).toHaveClass(/label/);

                await expect(label).not.toHaveClass(/label__hidden/);
            });

            test("should add classes of `label` and `label__hidden` to the internal label when default slotted content exists", async () => {
                const label = element.locator(".label");

                await element.evaluate(node => {
                    node.innerHTML = "";
                });

                await expect(label).toHaveClass(/label/);

                await expect(label).toHaveClass(/label__hidden/);
            });
        });
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("switch--switch"));

        const element = page.locator("fast-switch");

        await element.evaluate<void, FASTSwitch>(node => {
            node.disabled = true;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate<void, FASTSwitch>(node => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should NOT set a tabindex when disabled is `true`", async ({ page }) => {
        await page.goto(fixtureURL("switch--switch"));

        const element = page.locator("fast-switch");

        await element.evaluate<void, FASTSwitch>(node => {
            node.disabled = true;
        });

        await expect(element).not.hasAttribute("tabindex");

        await element.evaluate<void, FASTSwitch>(node => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should initialize to the provided value attribute if set pre-connection", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("switch--switch", {
                value: "foobar",
            })
        );

        const element = page.locator("fast-switch");

        await expect(element).toHaveJSProperty("value", "foobar");
    });

    test("should initialize to the provided value attribute if set post-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("switch--switch"));

        const element = page.locator("fast-switch");

        await element.evaluate<void, FASTSwitch>(node => {
            node.setAttribute("value", "foobar");
        });

        await expect(element).toHaveJSProperty("value", "foobar");
    });

    test("should initialize to the provided value property if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-switch");

        await page.evaluate(() => {
            const switchElement = document.createElement("fast-switch") as FASTSwitch;
            switchElement.value = "foobar";
            document.body.appendChild(switchElement);
        });

        await expect(element).toHaveJSProperty("value", "foobar");
    });

    test.describe("events", () => {
        test("should fire an event on click", async ({ page }) => {
            await page.goto(fixtureURL("switch--switch"));

            const element = page.locator("fast-switch");

            const [wasClicked] = await Promise.all([
                element.evaluate(
                    node =>
                        new Promise(resolve => {
                            node.addEventListener("click", () => resolve(true));
                        })
                ),
                element.click(),
            ]);

            expect(wasClicked).toBe(true);
        });

        test("should fire an event when spacebar is invoked", async ({ page }) => {
            await page.goto(fixtureURL("switch--switch"));

            const element = page.locator("fast-switch");

            const [wasEmitted] = await Promise.all([
                element.evaluate(
                    node =>
                        new Promise(resolve => {
                            node.addEventListener("keydown", () => resolve(true));
                        })
                ),
                element.evaluate(node => {
                    node.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
                }),
            ]);

            expect(wasEmitted).toBe(true);
        });

        test("should fire an event when enter is invoked", async ({ page }) => {
            await page.goto(fixtureURL("switch--switch"));

            const element = page.locator("fast-switch");

            const [wasEmitted] = await Promise.all([
                element.evaluate(
                    node =>
                        new Promise(resolve => {
                            node.addEventListener("keydown", () => resolve(true));
                        })
                ),
                element.evaluate(node => {
                    node.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
                }),
            ]);

            expect(wasEmitted).toBe(true);
        });
    });

    test.describe("when required", () => {
        test("should be invalid when unchecked", async ({ page }) => {
            await page.goto(fixtureURL("switch--switch-in-form", { checked: false }));

            const element = page.locator("fast-switch");

            expect(
                await element.evaluate<boolean, FASTSwitch>(
                    node => node.validity.valueMissing
                )
            ).toBe(true);
        });

        test("should be valid when checked", async ({ page }) => {
            await page.goto(fixtureURL("switch--switch-in-form", { checked: true }));

            const element = page.locator("fast-switch");

            expect(
                await element.evaluate<boolean, FASTSwitch>(
                    node => node.validity.valueMissing
                )
            ).toBe(false);
        });
    });

    test.describe("who's parent form has it's reset() method invoked", () => {
        test("should set its checked property to false if the checked attribute is unset", async ({
            page,
        }) => {
            await page.goto(fixtureURL("switch--switch-in-form", { checked: false }));

            const element = page.locator("fast-switch");

            const form = page.locator("form");

            await expect(element).not.toHaveBooleanAttribute("checked");

            await element.evaluate<void, FASTSwitch>(node => {
                node.checked = true;
            });

            await expect(element).toHaveJSProperty("checked", true);

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("checked", false);
        });

        test("should set its checked property to true if the checked attribute is set", async ({
            page,
        }) => {
            await page.goto(fixtureURL("switch--switch-in-form", { checked: true }));

            const element = page.locator("fast-switch");

            const form = page.locator("form");

            await expect(element).toHaveBooleanAttribute("checked");

            await element.evaluate<void, FASTSwitch>(node => {
                node.checked = false;
            });

            await expect(element).toHaveJSProperty("checked", false);

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("checked", true);
        });

        test("should put the control into a clean state, where `checked` attribute modifications update the `checked` property prior to user or programmatic interaction", async ({
            page,
        }) => {
            await page.goto(fixtureURL("debug--blank"));

            const element = page.locator("fast-switch");

            const form = page.locator("form");

            await page.evaluate(() => {
                const switchElement = document.createElement("fast-switch") as FASTSwitch;

                const form = document.createElement("form");
                document.getElementById("root")?.appendChild(form);
                form.appendChild(switchElement);
            });

            await element.evaluate<void, FASTSwitch>(node => {
                node.checked = true;
                node.removeAttribute("checked");
            });

            await expect(element).toHaveJSProperty("checked", true);

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("checked", false);

            await element.evaluate<void, FASTSwitch>(node => {
                node.setAttribute("checked", "");
            });

            await expect(element).toHaveJSProperty("checked", true);
        });
    });
});
