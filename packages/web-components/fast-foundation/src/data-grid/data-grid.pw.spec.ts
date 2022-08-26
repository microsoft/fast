import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDataGridRow } from "./data-grid-row.js";
import type { FASTDataGrid } from "./data-grid.js";
import { DataGridRowTypes } from "./data-grid.options.js";

test.describe("Data grid", () => {
    test("should set role to 'grid'", async ({ page }) => {
        await page.goto(fixtureURL("data-grid--data-grid"));

        const element = page.locator("fast-data-grid");

        await expect(element).toHaveAttribute("role", "grid");
    });

    test("should have a tabIndex of 0 by default", async ({ page }) => {
        await page.goto(fixtureURL("data-grid--data-grid"));

        const element = page.locator("fast-data-grid");

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should have a tabIndex of -1 when no-tabbing is true", async ({ page }) => {
        await page.goto(fixtureURL("data-grid--data-grid", { noTabbing: true }));

        const element = page.locator("fast-data-grid");

        await expect(element).toHaveAttribute("tabindex", "-1");
    });

    test("should have a tabIndex of -1 when a cell is focused", async ({ page }) => {
        await page.goto(fixtureURL("debug--blank"));

        await page.evaluate(() => {
            const node = document.createElement("fast-data-grid") as FASTDataGrid;
            node.generateHeader = "none";
            node.rowsData = [
                {
                    item1: "value 1-1",
                    item2: "value 2-1",
                    item3: "value 3-1",
                    item4: "value 4-1",
                },
                {
                    item1: "value 1-2",
                    item2: "value 2-2",
                    item3: "value 3-2",
                    item4: "value 4-2",
                },
                {
                    item1: "value 1-3",
                    item2: "value 2-3",
                    item3: "value 3-3",
                    item4: "value 4-3",
                },
            ];

            document.getElementById("root")?.append(node);
        });

        const element = page.locator("fast-data-grid");

        const rows = element.locator("fast-data-grid-row");

        await expect(rows).toHaveCount(3);

        const cells = rows.nth(0).locator("fast-data-grid-cell");

        await expect(cells).toHaveCount(4);

        await cells.nth(0).focus();

        await expect(element).toHaveAttribute("tabindex", "-1");
    });

    test("should generate a basic grid with a row header based on rowsdata only", async ({
        page,
    }) => {
        await page.goto(fixtureURL("data-grid--data-grid"));

        const element = page.locator("fast-data-grid");

        await element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                {
                    item1: "value 1-1",
                    item2: "value 2-1",
                    item3: "value 3-1",
                    item4: "value 4-1",
                },
                {
                    item1: "value 1-2",
                    item2: "value 2-2",
                    item3: "value 3-2",
                    item4: "value 4-2",
                },
                {
                    item1: "value 1-3",
                    item2: "value 2-3",
                    item3: "value 3-3",
                    item4: "value 4-3",
                },
            ];
        });

        const rows = element.locator("fast-data-grid-row");

        await expect(rows).toHaveCount(4);

        expect(await rows.nth(0).evaluate((node: FASTDataGridRow) => node.rowType)).toBe(
            DataGridRowTypes.header
        );
    });

    test("should not generate a header when `generateHeader` is `none`", async ({
        page,
    }) => {
        await page.goto(fixtureURL("data-grid--data-grid", { generateHeader: "none" }));

        const element = page.locator("fast-data-grid");

        await element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                {
                    item1: "value 1-1",
                    item2: "value 2-1",
                    item3: "value 3-1",
                    item4: "value 4-1",
                },
                {
                    item1: "value 1-2",
                    item2: "value 2-2",
                    item3: "value 3-2",
                    item4: "value 4-2",
                },
                {
                    item1: "value 1-3",
                    item2: "value 2-3",
                    item3: "value 3-3",
                    item4: "value 4-3",
                },
            ];
        });

        const rows = element.locator("fast-data-grid-row");

        await expect(rows).toHaveCount(3);

        expect(await rows.nth(0).evaluate((node: FASTDataGridRow) => node.rowType)).toBe(
            DataGridRowTypes.default
        );
    });

    test("should not generate a header when rowsData is empty", async ({ page }) => {
        await page.goto(fixtureURL("debug--blank"));

        await page.evaluate(() => {
            const node = document.createElement("fast-data-grid") as FASTDataGrid;
            node.rowsData = [];
            document.getElementById("root")?.append(node);
        });

        const element = page.locator("fast-data-grid");

        const rows = element.locator("fast-data-grid-row");

        await expect(rows).toHaveCount(0);
    });

    test("should generate a sticky header when generateHeader is set to 'sticky'", async ({
        page,
    }) => {
        await page.goto(fixtureURL("data-grid--data-grid", { generateHeader: "sticky" }));

        const rows = page.locator("fast-data-grid fast-data-grid-row").nth(0);

        expect(await rows.nth(0).evaluate((node: FASTDataGridRow) => node.rowType)).toBe(
            DataGridRowTypes.stickyHeader
        );
    });

    test("should set the row index attribute of child rows'", async ({ page }) => {
        await page.goto(fixtureURL("data-grid--data-grid", { generateHeader: "sticky" }));

        const element = page.locator("fast-data-grid");

        const rows = element.locator("fast-data-grid-row");

        expect(rows).toHaveCount(6);

        const rowsCount = await rows.count();
        for (let i = 0; i < rowsCount; i++) {
            expect(
                await rows.nth(i).evaluate((node: FASTDataGridRow) => node.rowIndex)
            ).toBe(i);
        }
    });

    test("should move focus with up/down arrow key strokes", async ({ page }) => {
        await page.goto(fixtureURL("data-grid--data-grid", { generateHeader: "none" }));

        const element = page.locator("fast-data-grid");

        const rows = element.locator("fast-data-grid-row");

        const cells = rows.nth(0).locator("fast-data-grid-cell");

        await expect(cells).toHaveCount(5);

        await cells.nth(0).focus();

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-1"
        );

        await page.keyboard.press("ArrowDown");

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-2"
        );

        await page.keyboard.press("ArrowDown");

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-3"
        );

        await page.keyboard.press("ArrowDown");

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-4"
        );

        await page.keyboard.press("ArrowUp");

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-3"
        );

        await page.keyboard.press("ArrowUp");

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-2"
        );
    });

    test("should move focus to first/last cells with ctrl + home/end key strokes", async ({
        page,
    }) => {
        await page.goto(fixtureURL("data-grid--data-grid", { generateHeader: "none" }));

        const element = page.locator("fast-data-grid");

        const rows = element.locator("fast-data-grid-row");

        const cells = rows.nth(0).locator("fast-data-grid-cell");

        await expect(cells).toHaveCount(5);

        await cells.nth(0).focus();

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-1"
        );

        await page.keyboard.press("Control+End");

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 5-5"
        );

        await page.keyboard.press("Control+Home");

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-1"
        );
    });

    test("should move focus by setting `focusRowIndex`", async ({ page }) => {
        await page.goto(fixtureURL("data-grid--data-grid", { generateHeader: "none" }));

        const element = page.locator("fast-data-grid");

        const rows = element.locator("fast-data-grid-row");

        const cells = rows.nth(0).locator("fast-data-grid-cell");

        await expect(cells).toHaveCount(5);

        await cells.nth(0).focus();

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-1"
        );

        await element.evaluate((node: FASTDataGrid) => (node.focusRowIndex = 1));

        await page.evaluate(() => new Promise(requestAnimationFrame));

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-2"
        );

        await element.evaluate((node: FASTDataGrid) => (node.focusRowIndex = 2));

        await page.evaluate(() => new Promise(requestAnimationFrame));

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-3"
        );
    });

    test("should move focus by setting `focusColumnIndex`", async ({ page }) => {
        await page.goto(fixtureURL("data-grid--data-grid", { generateHeader: "none" }));

        const element = page.locator("fast-data-grid");

        const rows = element.locator("fast-data-grid-row");

        const cells = rows.nth(0).locator("fast-data-grid-cell");

        await expect(cells).toHaveCount(5);

        await cells.nth(0).focus();

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 1-1"
        );

        await element.evaluate((node: FASTDataGrid) => (node.focusColumnIndex = 1));

        await page.evaluate(() => new Promise(requestAnimationFrame));

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 2-1"
        );

        await element.evaluate((node: FASTDataGrid) => (node.focusColumnIndex = 2));

        await page.evaluate(() => new Promise(requestAnimationFrame));

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 3-1"
        );

        await element.evaluate((node: FASTDataGrid) => (node.focusColumnIndex = 3));

        await page.evaluate(() => new Promise(requestAnimationFrame));

        expect(await page.evaluate(() => document.activeElement?.textContent)).toContain(
            "value 4-1"
        );
    });

    test("should auto generate grid-columns from a manual row", async ({ page }) => {
        await page.goto(fixtureURL("debug--blank"));

        page.evaluate(() => {
            const node = document.createElement("fast-data-grid");
            const row = document.createElement("fast-data-grid-row");
            row.append(
                document.createElement("fast-data-grid-cell"),
                document.createElement("fast-data-grid-cell")
            );

            node.append(row);
            document.getElementById("root")?.append(node);
        });

        const element = page.locator("fast-data-grid");

        const lastRow = element.locator("fast-data-grid-row").last();

        await expect(lastRow).toHaveJSProperty("gridTemplateColumns", "1fr 1fr");
    });
});
