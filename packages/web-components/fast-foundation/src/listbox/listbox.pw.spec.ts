import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTListboxElement } from "./listbox.element.js";

test.describe("Listbox", () => {
    test("should have a tabindex of 0 when `disabled` is not defined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("listbox--listbox", { disabled: "!undefined" }));

        const element = page.locator("fast-listbox");

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should NOT have a tabindex when `disabled` is true", async ({ page }) => {
        await page.goto(fixtureURL("listbox--listbox", { disabled: true }));

        const element = page.locator("fast-listbox");

        expect(await element.getAttribute("tabindex")).toBeNull();
    });

    test("should select nothing when no options have the `selected` attribute", async ({
        page,
    }) => {
        await page.goto(fixtureURL("listbox--listbox"));

        const element = page.locator("fast-listbox");

        const options = element.locator("fast-option");

        expect(
            await options.evaluateAll(options =>
                options.some(option => option.hasAttribute("selected"))
            )
        ).toBe(false);

        expect(await element.getAttribute("value")).toBeNull();

        await expect(element).toHaveJSProperty("selectedIndex", -1);
    });

    test("should select the option with a `selected` attribute", async ({ page }) => {
        await page.goto(fixtureURL("listbox--listbox"));

        const element = page.locator("fast-listbox");

        const options = element.locator("fast-option");

        const option2 = options.nth(1);

        await option2.evaluate(option => option.setAttribute("selected", ""));

        await expect(element).toHaveJSProperty("selectedIndex", 1);

        await expect(element).toHaveJSProperty("selectedOptions", [
            await option2.elementHandle(),
        ]);
    });

    test("should set the `size` property to match the `size` attribute", async ({
        page,
    }) => {
        await page.goto(fixtureURL("listbox--listbox"));

        const element = page.locator("fast-listbox");

        await element.evaluate((node: FASTListboxElement) =>
            node.setAttribute("size", "4")
        );

        await expect(element).toHaveJSProperty("size", 4);
    });

    test("should set the `size` attribute to match the `size` property", async ({
        page,
    }) => {
        await page.goto(fixtureURL("listbox--listbox"));

        const element = page.locator("fast-listbox");

        await element.evaluate((node: FASTListboxElement) => (node.size = 4));

        await expect(element).toHaveAttribute("size", "4");
    });

    test.describe(
        "should set the `size` property to 0 when a negative value is set",
        () => {
            test("via the `size` property", async ({ page }) => {
                await page.goto(fixtureURL("listbox--listbox"));

                const element = page.locator("fast-listbox");

                await element.evaluate((node: FASTListboxElement) => (node.size = 1));

                await expect(element).toHaveJSProperty("size", 1);
                await expect(element).toHaveAttribute("size", "1");

                await element.evaluate((node: FASTListboxElement) => (node.size = -1));

                await expect(element).toHaveJSProperty("size", 0);
                await expect(element).toHaveAttribute("size", "0");
            });

            test("via the `size` attribute", async ({ page }) => {
                await page.goto(fixtureURL("listbox--listbox"));

                const element = page.locator("fast-listbox");

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
        }
    );

    test("should set the `aria-setsize` and `aria-posinset` properties on slotted options", async ({
        page,
    }) => {
        await page.goto(fixtureURL("listbox--listbox"));

        const element = page.locator("fast-listbox");

        const options = element.locator("fast-option");

        const optionsCount = await options.count();

        for (let i = 0; i < optionsCount; i++) {
            await expect(options.nth(i)).toHaveAttribute("aria-posinset", `${i + 1}`);

            await expect(options.nth(i)).toHaveAttribute(
                "aria-setsize",
                `${optionsCount}`
            );
        }
    });

    test("should set a unique ID for each slotted option without an ID", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("listbox--listbox", { "storyItems[9].id": "test-id" })
        );

        const element = page.locator("fast-listbox");

        const options = element.locator("fast-option");

        const optionsCount = await options.count();

        for (let i = 0; i < optionsCount; i++) {
            if (i === 9) {
                await expect(options.nth(i)).toHaveId("test-id");
                continue;
            }

            await expect(options.nth(i)).toHaveId(/option-\d+/);
        }
    });

    test("should set the `aria-activedescendant` property to the ID of the currently selected option", async ({
        page,
    }) => {
        await page.goto(fixtureURL("listbox--listbox"));

        const element = page.locator("fast-listbox");

        const options = element.locator("fast-option");

        const optionsCount = await options.count();

        for (let i = 0; i < optionsCount; i++) {
            const optionId = (await options.nth(i).getAttribute("id")) as string;

            await element.evaluate((node: FASTListboxElement) => {
                node.selectNextOption();
            });

            await expect(element).toHaveAttribute("aria-activedescendant", optionId);
        }
    });

    test("should set the `aria-multiselectable` attribute to match the `multiple` attribute", async ({
        page,
    }) => {
        await page.goto(fixtureURL("listbox--listbox"));

        const element = page.locator("fast-listbox");

        await element.evaluate((node: FASTListboxElement) => (node.multiple = true));

        await expect(element).toHaveAttribute("aria-multiselectable", "true");

        await element.evaluate((node: FASTListboxElement) => (node.multiple = false));

        await page.evaluate(() => new Promise(requestAnimationFrame));

        expect(await element.getAttribute("aria-multiselectable")).toBeNull();
    });
});
