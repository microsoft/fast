import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTListboxOption } from "./listbox-option.js";

test.describe("ListboxOption", () => {
    test("should have a role of `option`", async ({ page }) => {
        await page.goto(fixtureURL("listbox-option--listbox-option"));

        const element = page.locator("fast-option");

        await expect(element).toHaveAttribute("role", "option");
    });

    test("should set the `aria-selected` attribute equal to the `selected` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("listbox-option--listbox-option"));

        const element = page.locator("fast-option");

        await element.evaluate((node: FASTListboxOption) => (node.selected = true));

        await expect(element).toHaveAttribute("aria-selected", "true");

        await element.evaluate((node: FASTListboxOption) => (node.selected = false));

        await expect(element).toHaveAttribute("aria-selected", "false");
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("listbox-option--listbox-option"));

        const element = page.locator("fast-option");

        await element.evaluate((node: FASTListboxOption) => (node.disabled = true));

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate((node: FASTListboxOption) => (node.disabled = false));

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should set the `aria-checked` attribute to match the `checked` property", async ({
        page,
    }) => {
        await page.goto(fixtureURL("listbox-option--listbox-option"));

        const element = page.locator("fast-option");

        expect(await element.getAttribute("aria-checked")).toBeNull();

        await element.evaluate((node: FASTListboxOption) => (node.checked = true));

        await expect(element).toHaveAttribute("aria-checked", "true");

        await element.evaluate((node: FASTListboxOption) => (node.checked = false));

        await expect(element).toHaveAttribute("aria-checked", "false");

        await element.evaluate((node: FASTListboxOption) => (node.checked = undefined));

        await page.evaluate(() => new Promise(requestAnimationFrame));

        expect(await element.getAttribute("aria-checked")).toBeNull();
    });

    test("should have an empty string `value` when the `value` attribute exists and is empty", async ({
        page,
    }) => {
        await page.goto(fixtureURL("listbox-option--listbox-option"));

        const element = page.locator("fast-option");

        await element.evaluate(node => {
            node.setAttribute("value", "");
        });

        await element.evaluate((node: FASTListboxOption) => {
            node.innerText = "hello";
        });

        await expect(element).toHaveText("hello");

        await expect(element).toHaveAttribute("value", "");
    });

    test("should return the text content when the `value` attribute does not exist", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("listbox-option--listbox-option", { value: "!undefined" })
        );

        const element = page.locator("fast-option");

        await expect(element).toHaveText("Listbox option");

        await expect(element).toHaveJSProperty("value", "Listbox option");
    });

    test("should return the trimmed text content with the `text` property", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("listbox-option--listbox-option", { value: "!undefined" })
        );

        const element = page.locator("fast-option");

        await element.evaluate(node => {
            node.textContent = `
                hello
                world
            `;
        });

        await expect(element).toHaveText("hello world");
    });

    test("should always return the `value` as a string", async ({ page }) => {
        await page.goto(fixtureURL("listbox-option--listbox-option"));

        const element = page.locator("fast-option");

        await element.evaluate((node: FASTListboxOption) => (node.value = 12345 as any));

        await expect(element).toHaveJSProperty("value", "12345");

        expect(
            await element.evaluate((node: FASTListboxOption) => typeof node.value)
        ).toBe("string");
    });
});
