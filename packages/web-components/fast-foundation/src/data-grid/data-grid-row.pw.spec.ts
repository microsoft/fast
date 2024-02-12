import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDataGridRow } from "./data-grid-row.js";

test.describe("DataGridRow", () => {
    const cellQueryString = "fast-data-grid-cell";

    test('should set the `role` attribute to "row" by default', async ({ page }) => {
        const element = page.locator("fast-data-grid-row");

        const root = page.locator("#root");

        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid-row></fast-data-grid-row>
            `;
        });

        await expect(element).toHaveAttribute("role", "row");
    });

    test("should set `grid-template-columns` style to match attribute", async ({
        page,
    }) => {
        const element = page.locator("fast-data-grid-row");

        const root = page.locator("#root");

        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid-row grid-template-columns="1fr 2fr 3fr"></fast-data-grid-row>
            `;
        });

        await expect(element).toHaveAttribute(
            "style",
            "grid-template-columns: 1fr 2fr 3fr;"
        );
    });

    test("should fire an event when a child cell is focused", async ({ page }) => {
        const element = page.locator("fast-data-grid-row");

        const root = page.locator("#root");

        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid-row>
                    <fast-data-grid-cell></fast-data-grid-cell>
                </fast-data-grid-row>
            `;
        });

        const cell = page.locator(cellQueryString).first();

        const [wasFocused] = await Promise.all([
            element.evaluate(node => {
                return new Promise(resolve => {
                    node.addEventListener("row-focused", () => {
                        resolve(true);
                    });
                });
            }),
            cell.evaluate(node => {
                node.focus();
            }),
        ]);

        expect(wasFocused).toBeTruthy();
    });

    test("should move focus with left/right arrow key strokes", async ({ page }) => {
        const element = page.locator("fast-data-grid-row");

        const root = page.locator("#root");

        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid-row>
                    <fast-data-grid-cell></fast-data-grid-cell>
                    <fast-data-grid-cell></fast-data-grid-cell>
                    <fast-data-grid-cell></fast-data-grid-cell>
                </fast-data-grid-row>
            `;
        });

        await element.locator(cellQueryString).first().focus();

        await expect(element).toHaveJSProperty("focusColumnIndex", 0);

        await page.keyboard.press("ArrowRight");

        await expect(element).toHaveJSProperty("focusColumnIndex", 1);

        await page.keyboard.press("ArrowLeft");

        await expect(element).toHaveJSProperty("focusColumnIndex", 0);
    });

    test("should move focus to the start/end of the row with home/end keystrokes", async ({
        page,
    }) => {
        const element = page.locator("fast-data-grid-row");

        const root = page.locator("#root");

        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid-row>
                    <fast-data-grid-cell></fast-data-grid-cell>
                    <fast-data-grid-cell></fast-data-grid-cell>
                    <fast-data-grid-cell></fast-data-grid-cell>
                </fast-data-grid-row>
            `;
        });

        await element.locator(cellQueryString).first().focus();

        await expect(element).toHaveJSProperty("focusColumnIndex", 0);

        await page.keyboard.press("End");

        await expect(element).toHaveJSProperty("focusColumnIndex", 2);

        await page.keyboard.press("Home");

        await expect(element).toHaveJSProperty("focusColumnIndex", 0);
    });

    test("should render no cells if provided no column definitions", async ({ page }) => {
        const element = page.locator("fast-data-grid-row");

        const root = page.locator("#root");

        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));

        const cells = element.locator("fast-data-grid-cell");

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid-row></fast-data-grid-row>
            `;
        });

        await element.evaluate((node: FASTDataGridRow) => {
            node.rowData = {
                name: "row 1",
                value1: "value 1",
            };
        });

        await expect(cells).toHaveCount(0);
    });

    test("should render as many column header cells as specified in column definitions", async ({
        page,
    }) => {
        const element = page.locator("fast-data-grid-row");

        const root = page.locator("#root");

        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));

        const cells = element.locator(cellQueryString);

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid-row></fast-data-grid-row>
            `;
        });

        await element.evaluate((node: FASTDataGridRow) => {
            node.columnDefinitions = [{ columnDataKey: "item1" }];
        });

        await expect(cells).toHaveCount(1);

        await element.evaluate((node: FASTDataGridRow) => {
            node.columnDefinitions = [
                { columnDataKey: "item1" },
                { columnDataKey: "item2" },
            ];
        });

        await expect(cells).toHaveCount(2);

        await element.evaluate((node: FASTDataGridRow) => {
            node.columnDefinitions = [
                { columnDataKey: "item1" },
                { columnDataKey: "item2" },
                { columnDataKey: "item3" },
            ];
        });

        await expect(cells).toHaveCount(3);
    });
});
