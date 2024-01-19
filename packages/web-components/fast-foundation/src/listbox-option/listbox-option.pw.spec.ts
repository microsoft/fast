import { expect, test } from "@playwright/test";
import type { FASTListboxOption } from "./listbox-option.js";

test.describe("ListboxOption", () => {
    test("should have a role of `option`", async ({ page }) => {
        const element = page.locator("fast-option");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-option></fast-option>
            `;
        });

        await expect(element).toHaveAttribute("role", "option");
    });

    test("should set the `aria-disabled` attribute when disabled", async ({ page }) => {
        const element = page.locator("fast-option");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-option disabled></fast-option>
            `;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate(node => {
            node.toggleAttribute("disabled");
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test("should set the `aria-selected` attribute when selected", async ({ page }) => {
        const element = page.locator("fast-option");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-option selected></fast-option>
            `;
        });

        await expect(element).toHaveAttribute("aria-selected", "true");

        await element.evaluate((node: FASTListboxOption) => {
            node.selected = false;
        });

        await expect(element).toHaveAttribute("aria-selected", "false");
    });

    test("should set the `aria-checked` attribute when checked", async ({ page }) => {
        const element = page.locator("fast-option");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-option></fast-option>
            `;
        });

        await expect(element).not.hasAttribute("aria-checked");

        await element.evaluate((node: FASTListboxOption) => {
            node.checked = true;
        });

        await expect(element).toHaveAttribute("aria-checked", "true");

        await element.evaluate((node: FASTListboxOption) => {
            node.checked = false;
        });

        await expect(element).toHaveAttribute("aria-checked", "false");
    });

    test("should have an empty string `value` when the `value` attribute exists and is empty", async ({
        page,
    }) => {
        const element = page.locator("fast-option");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-option value=""></fast-option>
            `;
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
        const element = page.locator("fast-option");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-option>hello</fast-option>
            `;
        });

        await expect(element).toHaveText("hello");

        await expect(element).toHaveJSProperty("value", "hello");
    });

    test("should return the trimmed text content with the `text` property", async ({
        page,
    }) => {
        const element = page.locator("fast-option");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-option>
                    hello
                    world
                </fast-option>
            `;
        });

        await expect(element).toHaveText(/\n\s{20}hello\n\s{20}world\n\s{16}/);

        await expect(element).toHaveText("hello world");
    });

    test("should always return the `value` as a string", async ({ page }) => {
        const element = page.locator("fast-option");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-option value="1"></fast-option>
            `;
        });

        await expect(element).toHaveJSProperty("value", "1");

        expect(
            await element.evaluate((node: FASTListboxOption) => typeof node.value)
        ).toBe("string");
    });
});
