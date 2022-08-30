import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTCombobox } from "./combobox.js";

test.describe("Combobox", () => {
    test.describe("States, Attributes, and Properties", () => {
        let page: Page;
        let element: Locator;
        let field: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-combobox");

            field = element.locator(`input[role="combobox"]`);

            await page.goto(fixtureURL("combobox--combobox"));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test('should include a control with a `role` attribute equal to "combobox"', async () => {
            await expect(field).toHaveCount(1);
        });

        test("should set the `aria-disabled` attribute equal to the `disabled` property", async () => {
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
            await element.evaluate((node: FASTCombobox) => {
                node.disabled = true;
            });

            await expect(element).not.hasAttribute("tabindex");

            await element.evaluate((node: FASTCombobox) => {
                node.disabled = false;
            });

            await expect(element).toHaveAttribute("tabindex", "0");
        });

        test("should NOT set the `value` property to the first available option", async () => {
            await expect(element).toHaveJSProperty("value", "");

            await expect(field).toHaveValue("");
        });

        test("should set the `placeholder` attribute on the internal control equal to the `placeholder` attribute", async () => {
            await element.evaluate((node: FASTCombobox) => {
                node.placeholder = "placeholder text";
            });

            await expect(element).toHaveJSProperty("placeholder", "placeholder text");

            await expect(field).toHaveAttribute("placeholder", "placeholder text");
        });

        test("should set the control's `aria-controls` attribute to the ID of the internal listbox element while open", async () => {
            const listbox = element.locator(".listbox");

            const listboxId = (await listbox.getAttribute("id")) as string;

            await expect(field).toHaveAttribute("aria-controls", "");

            await element.evaluate((node: FASTCombobox) => (node.open = true));

            await expect(field).toHaveAttribute("aria-controls", listboxId);

            await element.evaluate((node: FASTCombobox) => (node.open = false));

            await expect(field).toHaveAttribute("aria-controls", "");
        });

        test("should set the control's `aria-activedescendant` property to the ID of the currently selected option while open", async () => {
            const options = element.locator("fast-option");

            await expect(field).not.hasAttribute("aria-activedescendant");

            await element.evaluate((node: FASTCombobox) => {
                node.open = true;
            });

            await expect(element).toHaveAttribute("aria-activedescendant", "");

            const optionsCount = await options.count();

            for (let i = 0; i < optionsCount; i++) {
                const option = options.nth(i);

                await element.evaluate((node: FASTCombobox) => {
                    node.selectNextOption();
                });

                const optionId = await option.evaluate(node => node.id);

                await expect(field).toHaveAttribute("aria-activedescendant", optionId);
            }

            await element.evaluate((node: FASTCombobox) => {
                node.value = "other";
            });

            await expect(field).hasAttribute("aria-activedescendant");

            await expect(element).toHaveAttribute("aria-activedescendant", "");
        });
    });

    test("should set its value to the first option with the `selected` attribute present", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        await page.evaluate(() => {
            const combobox = document.createElement("fast-combobox");
            const options = ["one", "two", "three"].map(s => {
                const option = document.createElement("fast-option");
                option.textContent = s;
                return option;
            });

            options[1].setAttribute("selected", "");

            combobox.append(...options);

            document.getElementById("root")?.append(combobox);
        });

        const element = page.locator("fast-combobox");

        const option2 = element.locator("fast-option:nth-of-type(2)");

        expect(await option2.getAttribute("selected")).toBe("");

        await expect(element).toHaveJSProperty("value", "two");
    });

    test("should return the same value when the `value` property is set before connecting", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        await page.evaluate(() => {
            const combobox = document.createElement("fast-combobox") as FASTCombobox;
            combobox.value = "test";
            document.getElementById("root")?.append(combobox);
        });

        const element = page.locator("fast-combobox");

        expect(await element.evaluate((node: FASTCombobox) => node.value)).toBe("test");
    });

    test("should return the same value when the `value` property is set after connecting", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        await page.evaluate(() => {
            const combobox = document.createElement("fast-combobox") as FASTCombobox;
            document.getElementById("root")?.append(combobox);
        });

        const element = page.locator("fast-combobox");

        await element.evaluate((node: FASTCombobox) => (node.value = "test"));

        await expect(element).toHaveJSProperty("value", "test");
    });

    test("should display the listbox when the `open` property is true before connecting", async ({
        page,
    }) => {
        await page.goto(fixtureURL("combobox--combobox"));

        const element = page.locator("fast-combobox");

        const listbox = element.locator(".listbox");

        await expect(listbox).not.toBeVisible();

        await element.evaluate((node: FASTCombobox) => {
            node.open = true;
        });

        expect(await element.getAttribute("open")).toBeFalsy();

        await expect(listbox).toBeVisible();
    });

    test.describe(
        "should NOT emit a 'change' event when the value changes by user input while open",
        () => {
            test("via arrow down key", async ({ page }) => {
                await page.goto(fixtureURL("combobox--combobox"));

                const element = page.locator("fast-combobox");

                await element.click();

                await element.locator(".listbox").waitFor({ state: "visible" });

                expect(await element.getAttribute("open")).toBe("");

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

            test("via arrow up key", async ({ page }) => {
                await page.goto(fixtureURL("combobox--combobox"));

                const element = page.locator("fast-combobox");

                await element.evaluate((node: FASTCombobox) => (node.value = "two"));

                await element.click();

                await element.locator(".listbox").waitFor({ state: "visible" });

                expect(
                    await element.evaluate(node => node.hasAttribute("open"))
                ).toBeTruthy();

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
        }
    );

    test.describe(
        "should NOT emit a 'change' event when the value changes by programmatic interaction",
        () => {
            test("via end key", async ({ page }) => {
                await page.goto(fixtureURL("combobox--combobox"));

                const element = page.locator("fast-combobox");

                await element.evaluate((node: FASTCombobox) => (node.value = "two"));

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
        }
    );

    test.describe("when the owning form's reset() function is invoked", () => {
        test("should reset the value property to its initial value", async ({ page }) => {
            await page.goto(
                fixtureURL("combobox--combobox-in-form", {
                    value: "one",
                })
            );

            const element = page.locator("fast-combobox");

            const form = page.locator("form");

            await expect(element).toHaveJSProperty("value", "one");

            await element.evaluate((node: FASTCombobox) => (node.value = "two"));

            await expect(element).toHaveJSProperty("value", "two");

            await form.evaluate((node: HTMLFormElement) => node.reset());

            await expect(element).toHaveJSProperty("value", "one");
        });

        test("should reset its value property to the first option with the `selected` attribute present", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("combobox--combobox-in-form", {
                    "storyItems[9].selected": true,
                })
            );

            const element = page.locator("fast-combobox");

            const form = page.locator("form");

            await expect(element).toHaveJSProperty("value", "David Tenant");

            await element.evaluate((node: FASTCombobox) => (node.value = "two"));

            await expect(element).toHaveJSProperty("value", "two");

            await form.evaluate((node: HTMLFormElement) => node.reset());

            await expect(element).toHaveJSProperty("value", "David Tenant");
        });
    });

    test("should focus the control when an associated label is clicked", async ({
        page,
    }) => {
        await page.goto(fixtureURL("combobox--combobox"));

        // Skip this test if the browser if ElementInternals isn't supported
        if (!(await page.evaluate(() => window.hasOwnProperty("ElementInternals")))) {
            test.skip();
        }

        const element = page.locator("fast-combobox");

        const label = page.locator("label");

        await element.evaluate(node => {
            const label = document.createElement("label");
            label.setAttribute("for", "test-combobox");
            label.textContent = "label";
            node.id = "test-combobox";
            document.body.append(label);
        });

        await label.click();

        await expect(element).toBeFocused();
    });
});
