import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTListboxElement } from "./listbox.element.js";

test.describe("Listbox", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let options: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-listbox");

        root = page.locator("#root");

        options = element.locator("fast-option");

        await page.goto(fixtureURL("listbox--listbox"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should have a tabindex of 0 when `disabled` is not defined", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-listbox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-listbox>
            `;
        });

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should NOT have a tabindex when `disabled` is true", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-listbox disabled></fast-listbox>
            `;
        });

        await expect(element).not.toHaveAttribute("tabindex");
    });

    test("should select nothing when no options have the `selected` attribute", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-listbox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-listbox>
            `;
        });

        expect(
            await options.evaluateAll(options =>
                options.some(option => option.hasAttribute("selected"))
            )
        ).toBe(false);

        await expect(element).not.toHaveAttribute("value");

        await expect(element).toHaveJSProperty("selectedIndex", -1);
    });

    test("should select the option with a `selected` attribute", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-listbox>
                    <fast-option>Option 1</fast-option>
                    <fast-option selected>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-listbox>
            `;
        });

        await expect(element).toHaveJSProperty("selectedIndex", 1);

        await expect(element).toHaveJSProperty("selectedOptions", [
            await options.nth(1).elementHandle(),
        ]);
    });

    test("should set the `size` property to match the `size` attribute", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-listbox size="5"></fast-listbox>
            `;
        });

        await expect(element).toHaveJSProperty("size", 5);
    });

    test("should set the `size` attribute to match the `size` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-listbox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-listbox>
            `;
        });

        await element.evaluate((node: FASTListboxElement) => {
            node.size = 5;
        });

        await expect(element).toHaveAttribute("size", "5");
    });

    test.describe("should set the `size` property to 0 when a negative value is set", () => {
        test("via the `size` property", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                        <fast-listbox>
                            <fast-option>Option 1</fast-option>
                            <fast-option>Option 2</fast-option>
                            <fast-option>Option 3</fast-option>
                        </fast-listbox>
                    `;
            });

            await element.evaluate((node: FASTListboxElement) => {
                node.size = 1;
            });

            await expect(element).toHaveJSProperty("size", 1);
            await expect(element).toHaveAttribute("size", "1");

            await element.evaluate((node: FASTListboxElement) => {
                node.size = -1;
            });

            await expect(element).toHaveJSProperty("size", 0);
            await expect(element).toHaveAttribute("size", "0");
        });

        test("via the `size` attribute", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                        <fast-listbox>
                            <fast-option>Option 1</fast-option>
                            <fast-option>Option 2</fast-option>
                            <fast-option>Option 3</fast-option>
                        </fast-listbox>
                    `;
            });

            await element.evaluate((node: FASTListboxElement) =>
                node.setAttribute("size", "1")
            );

            await expect(element).toHaveJSProperty("size", 1);
            await expect(element).toHaveAttribute("size", "1");

            await element.evaluate((node: FASTListboxElement) =>
                node.setAttribute("size", "-1")
            );

            await expect(element).toHaveJSProperty("size", 0);
            await expect(element).toHaveAttribute("size", "0");
        });
    });

    test("should set the `aria-setsize` and `aria-posinset` properties on slotted options", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-listbox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-listbox>
            `;
        });

        const optionsCount = await options.count();

        for (let i = 0; i < optionsCount; i++) {
            await expect(options.nth(i)).toHaveAttribute("aria-posinset", `${i + 1}`);

            await expect(options.nth(i)).toHaveAttribute(
                "aria-setsize",
                `${optionsCount}`
            );
        }
    });

    test("should set a unique ID for each slotted option without an ID", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-listbox>
                    <fast-option>Option 1</fast-option>
                    <fast-option id="second-option">Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-listbox>
            `;
        });

        await expect(options.nth(0)).toHaveAttribute("id", /option-\d+/);

        await expect(options.nth(1)).toHaveAttribute("id", "second-option");

        await expect(options.nth(2)).toHaveAttribute("id", /option-\d+/);
    });

    test("should set the `aria-activedescendant` property to the ID of the currently selected option", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-listbox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-listbox>
            `;
        });

        const optionsCount = await options.count();

        for (let i = 0; i < optionsCount; i++) {
            const optionId = (await options.nth(i).getAttribute("id")) as string;

            await element.evaluate((node: FASTListboxElement) => {
                node.selectNextOption();
            });

            await expect(element).toHaveAttribute("aria-activedescendant", optionId);
        }
    });

    test("should set the `aria-multiselectable` attribute to match the `multiple` attribute", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-listbox>
                    <fast-option>Option 1</fast-option>
                    <fast-option>Option 2</fast-option>
                    <fast-option>Option 3</fast-option>
                </fast-listbox>
            `;
        });

        await element.evaluate((node: FASTListboxElement) => {
            node.multiple = true;
        });

        await expect(element).toHaveAttribute("aria-multiselectable", "true");

        await element.evaluate((node: FASTListboxElement) => {
            node.multiple = false;
        });

        await expect(element).not.toHaveAttribute("aria-multiselectable");
    });
});
