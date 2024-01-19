import { expect, test } from "@playwright/test";

test.describe("TabPanel", () => {
    test("should have a role of `tabpanel`", async ({ page }) => {
        const element = page.locator("fast-tab-panel");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-tab-panel></fast-tab-panel>
            `;
        });

        await expect(element).toHaveAttribute("role", "tabpanel");
    });

    test("should have a slot attribute of `tabpanel`", async ({ page }) => {
        const element = page.locator("fast-tab-panel");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-tab-panel></fast-tab-panel>
            `;
        });

        await expect(element).toHaveAttribute("slot", "tabpanel");
    });
});
