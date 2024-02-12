import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("TabPanel", () => {
    test("should have a role of `tabpanel`", async ({ page }) => {
        const element = page.locator("fast-tab-panel");

        const root = page.locator("#root");

        await page.goto(fixtureURL("tabs-tab-panel--tab-panel"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-tab-panel></fast-tab-panel>
            `;
        });

        await expect(element).toHaveAttribute("role", "tabpanel");
    });

    test("should have a slot attribute of `tabpanel`", async ({ page }) => {
        const element = page.locator("fast-tab-panel");

        const root = page.locator("#root");

        await page.goto(fixtureURL("tabs-tab-panel--tab-panel"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-tab-panel></fast-tab-panel>
            `;
        });

        await expect(element).toHaveAttribute("slot", "tabpanel");
    });
});
