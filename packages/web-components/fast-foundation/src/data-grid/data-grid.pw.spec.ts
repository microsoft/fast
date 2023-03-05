import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDataGridRow } from "./data-grid-row.js";
import type { FASTDataGrid } from "./data-grid.js";
import { DataGridRowTypes } from "./data-grid.options.js";

test.describe("Data grid", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    const selectedRowQueryString = '[aria-selected="true"]';
    const rowQueryString = "fast-data-grid-row";

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-data-grid");

        root = page.locator("#root");

        await page.goto(fixtureURL("data-grid--data-grid"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should set role to 'grid'", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid></fast-data-grid>
            `;
        });

        await expect(element).toHaveAttribute("role", "grid");
    });

    test("should have a tabIndex of 0 by default", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid></fast-data-grid>
            `;
        });

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should have a tabIndex of -1 when no-tabbing is true", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
            <fast-data-grid no-tabbing></fast-data-grid>
        `;
        });

        await expect(element).toHaveAttribute("tabindex", "-1");
    });

    test("should have a tabIndex of -1 when a cell is focused", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid>
                    <fast-data-grid-row>
                        <fast-data-grid-cell>Cell 1</fast-data-grid-cell>
                        <fast-data-grid-cell>Cell 2</fast-data-grid-cell>
                    </fast-data-grid-row>
                </fast-data-grid>
            `;
        });

        await element.locator("fast-data-grid-cell").first().focus();

        await expect(element).toHaveAttribute("tabindex", "-1");
    });

    test("should generate a basic grid with a row header based on rowsData only", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid></fast-data-grid>
            `;
        });

        element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "Person 1" },
                { id: "2", name: "Person 2" },
            ];
        });

        const rows = element.locator(rowQueryString);

        await expect(rows).toHaveCount(3);

        const row1 = rows.nth(0);

        await expect(row1).toHaveAttribute("row-type", DataGridRowTypes.header);

        const row1Cells = row1.locator("fast-data-grid-cell");

        await expect(row1Cells).toHaveCount(2);

        await expect(row1Cells.nth(0)).toHaveText("id");

        await expect(row1Cells.nth(1)).toHaveText("name");

        const row2 = rows.nth(1);

        await expect(row2).toHaveAttribute("row-type", DataGridRowTypes.default);

        const row2Cells = row2.locator("fast-data-grid-cell");

        await expect(row2Cells).toHaveCount(2);

        await expect(row2Cells.nth(0)).toHaveText("1");

        await expect(row2Cells.nth(1)).toHaveText("Person 1");

        const row3 = rows.nth(2);

        await expect(row3).toHaveAttribute("row-type", DataGridRowTypes.default);

        const row3Cells = row3.locator("fast-data-grid-cell");

        await expect(row3Cells).toHaveCount(2);

        await expect(row3Cells.nth(0)).toHaveText("2");

        await expect(row3Cells.nth(1)).toHaveText("Person 2");
    });

    test("should not generate a header when `generateHeader` is `none`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none"></fast-data-grid>
            `;
        });

        element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "Person 1" },
                { id: "2", name: "Person 2" },
            ];
        });

        const rows = element.locator(rowQueryString);

        await expect(rows).toHaveCount(2);

        const row1 = rows.nth(0);

        await expect(row1).toHaveAttribute("row-type", DataGridRowTypes.default);

        const row1Cells = row1.locator("fast-data-grid-cell");

        await expect(row1Cells).toHaveCount(2);

        await expect(row1Cells.nth(0)).toHaveText("1");

        await expect(row1Cells.nth(1)).toHaveText("Person 1");

        const row2 = rows.nth(1);

        await expect(row2).toHaveAttribute("row-type", DataGridRowTypes.default);

        const row2Cells = row2.locator("fast-data-grid-cell");

        await expect(row2Cells).toHaveCount(2);

        await expect(row2Cells.nth(0)).toHaveText("2");

        await expect(row2Cells.nth(1)).toHaveText("Person 2");
    });

    test("should not generate a header when rowsData is empty", async () => {
        await root.evaluate(node => {
            node.innerHTML = "";

            const dataGrid = document.createElement("fast-data-grid") as FASTDataGrid;

            dataGrid.rowsData = [];

            node.append(dataGrid);
        });

        const rows = element.locator(rowQueryString);

        await expect(rows).toHaveCount(0);
    });

    test("should generate a sticky header when generateHeader is set to 'sticky'", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="sticky"></fast-data-grid>
            `;
        });

        element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "Person 1" },
                { id: "2", name: "Person 2" },
            ];
        });

        const rows = element.locator(rowQueryString);

        await expect(rows).toHaveCount(3);

        const row1 = rows.nth(0);

        await expect(row1).toHaveAttribute("row-type", DataGridRowTypes.stickyHeader);

        const row1Cells = row1.locator("fast-data-grid-cell");

        await expect(row1Cells).toHaveCount(2);

        await expect(row1Cells.nth(0)).toHaveText("id");

        await expect(row1Cells.nth(1)).toHaveText("name");

        const row2 = rows.nth(1);

        await expect(row2).toHaveAttribute("row-type", DataGridRowTypes.default);

        const row2Cells = row2.locator("fast-data-grid-cell");

        await expect(row2Cells).toHaveCount(2);

        await expect(row2Cells.nth(0)).toHaveText("1");

        await expect(row2Cells.nth(1)).toHaveText("Person 1");

        const row3 = rows.nth(2);

        await expect(row3).toHaveAttribute("row-type", DataGridRowTypes.default);

        const row3Cells = row3.locator("fast-data-grid-cell");

        await expect(row3Cells).toHaveCount(2);

        await expect(row3Cells.nth(0)).toHaveText("2");

        await expect(row3Cells.nth(1)).toHaveText("Person 2");
    });

    test("should set the row index attribute of child rows'", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="sticky"></fast-data-grid>
            `;
        });

        element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "Person 1" },
                { id: "2", name: "Person 2" },
            ];
        });

        const rows = element.locator(rowQueryString);

        await expect(rows).toHaveCount(3);

        const rowsCount = await rows.count();
        for (let i = 0; i < rowsCount; i++) {
            expect(
                await rows.nth(i).evaluate((node: FASTDataGridRow) => node.rowIndex)
            ).toBe(i);
        }
    });

    test("should move focus with up/down arrow key strokes", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none"></fast-data-grid>
            `;
        });

        element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "Person 1" },
                { id: "2", name: "Person 2" },
                { id: "3", name: "Person 3" },
            ];
        });

        const rows = element.locator(rowQueryString);

        await expect(rows).toHaveCount(3);

        const row1 = rows.nth(0);

        const row2 = rows.nth(1);

        const row3 = rows.nth(2);

        const row1Cells = row1.locator("fast-data-grid-cell");

        const row2Cells = row2.locator("fast-data-grid-cell");

        const row3Cells = row3.locator("fast-data-grid-cell");

        await row1Cells.nth(0).click();

        await expect(row1Cells.nth(0)).toBeFocused();

        await row1Cells.nth(0).press("ArrowDown");

        await expect(row2Cells.nth(0)).toBeFocused();

        await row2Cells.nth(0).press("ArrowDown");

        await expect(row3Cells.nth(0)).toBeFocused();

        await row3Cells.nth(0).press("ArrowUp");

        await expect(row2Cells.nth(0)).toBeFocused();
    });

    test("should move focus to first/last cells with ctrl + home/end key strokes", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none"></fast-data-grid>
            `;
        });

        element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "item 1", shape: "circle" },
                { id: "2", name: "item 2", shape: "square" },
                { id: "3", name: "item 3", shape: "triangle" },
            ];
        });

        const rows = element.locator(rowQueryString);

        const firstCell = rows.nth(0).locator("fast-data-grid-cell").nth(0);

        const lastCell = rows.nth(2).locator("fast-data-grid-cell").nth(2);

        await firstCell.focus();

        await expect(firstCell).toBeFocused();

        await page.keyboard.press("Control+End");

        await expect(lastCell).toBeFocused();

        await page.keyboard.press("Control+Home");

        await expect(firstCell).toBeFocused();
    });

    test("should move focus by setting the `focusRowIndex` property", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none"></fast-data-grid>
            `;
        });

        element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "item 1", shape: "circle" },
                { id: "2", name: "item 2", shape: "square" },
                { id: "3", name: "item 3", shape: "triangle" },
            ];
        });

        const cells = element.locator("fast-data-grid-cell");

        await expect(cells).toHaveCount(9);

        await cells.nth(0).focus();

        await expect(cells.nth(0)).toBeFocused();

        await element.evaluate((node: FASTDataGrid) => {
            node.focusRowIndex = 1;
        });

        await expect(cells.nth(3)).toBeFocused();

        await element.evaluate((node: FASTDataGrid) => {
            node.focusRowIndex = 2;
        });

        await expect(cells.nth(6)).toBeFocused();

        await element.evaluate((node: FASTDataGrid) => {
            node.focusRowIndex = 0;
        });

        await expect(cells.nth(0)).toBeFocused();
    });

    test("should move focus by setting `focusColumnIndex`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none"></fast-data-grid>
            `;
        });

        element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "item 1", shape: "circle" },
                { id: "2", name: "item 2", shape: "square" },
                { id: "3", name: "item 3", shape: "triangle" },
            ];
        });

        const cells = element.locator("fast-data-grid-cell");

        await expect(cells).toHaveCount(9);

        await cells.nth(0).focus();

        await expect(cells.nth(0)).toBeFocused();

        await element.evaluate((node: FASTDataGrid) => {
            node.focusColumnIndex = 1;
        });

        await expect(cells.nth(1)).toBeFocused();

        await element.evaluate((node: FASTDataGrid) => {
            node.focusColumnIndex = 2;
        });

        await expect(cells.nth(2)).toBeFocused();

        await element.evaluate((node: FASTDataGrid) => {
            node.focusColumnIndex = 0;
        });

        await expect(cells.nth(0)).toBeFocused();
    });

    test("should scroll into view on focus", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none" style="height:100px; overflow-y: scroll;">
                    <fast-data-grid-row style="height:100px;">
                        <fast-data-grid-cell>1</fast-data-grid-cell>
                    </fast-data-grid-row>
                    <fast-data-grid-row style="height:100px;">
                        <fast-data-grid-cell>2</fast-data-grid-cell>
                    </fast-data-grid-row>
                    <fast-data-grid-row style="height:100px;">
                        <fast-data-grid-cell>3</fast-data-grid-cell>
                    </fast-data-grid-row>
                    <fast-data-grid-row style="height:100px;">
                        <fast-data-grid-cell>3</fast-data-grid-cell>
                    </fast-data-grid-row>
                </fast-data-grid>
            `;
        });

        const cells = element.locator("fast-data-grid-cell");
        await expect(cells).toHaveCount(4);
        await expect(element).toHaveJSProperty("scrollTop", 0);
        await cells.nth(0).focus();
        await expect(element).toHaveJSProperty("scrollTop", 0);
        await cells.nth(1).focus();
        await expect(element).toHaveJSProperty("scrollTop", 100);
        await cells.nth(2).focus();
        await expect(element).toHaveJSProperty("scrollTop", 200);
    });

    test("should not apply initial selection in default 'none' selection mode", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none" initial-row-selection="0" selection-mode="none">
                    <fast-data-grid-row>
                        <fast-data-grid-cell>1</fast-data-grid-cell>
                    </fast-data-grid-row>
                    <fast-data-grid-row>
                        <fast-data-grid-cell>2</fast-data-grid-cell>
                    </fast-data-grid-row>
                    <fast-data-grid-row>
                        <fast-data-grid-cell>2</fast-data-grid-cell>
                    </fast-data-grid-row>
                </fast-data-grid>
            `;
        });

        await expect(element).toHaveJSProperty("selectedRowIndexes", []);
    });

    test("should apply initial selection in 'single-row' selection mode", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
            <fast-data-grid generate-header="none" initial-row-selection="0" selection-mode="single-row">
                <fast-data-grid-row>
                    <fast-data-grid-cell>1</fast-data-grid-cell>
                </fast-data-grid-row>
                <fast-data-grid-row>
                    <fast-data-grid-cell>2</fast-data-grid-cell>
                </fast-data-grid-row>
                <fast-data-grid-row>
                    <fast-data-grid-cell>2</fast-data-grid-cell>
                </fast-data-grid-row>
            </fast-data-grid>
            `;
        });

        await expect(element).toHaveJSProperty("selectedRowIndexes", [0]);
    });

    test("should apply initial selection in 'multi-row' selection mode", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
            <fast-data-grid generate-header="none" initial-row-selection="0,1" selection-mode="multi-row">
                <fast-data-grid-row>
                    <fast-data-grid-cell>1</fast-data-grid-cell>
                </fast-data-grid-row>
                <fast-data-grid-row>
                    <fast-data-grid-cell>2</fast-data-grid-cell>
                </fast-data-grid-row>
                <fast-data-grid-row>
                    <fast-data-grid-cell>2</fast-data-grid-cell>
                </fast-data-grid-row>
            </fast-data-grid>
            `;
        });

        await expect(element).toHaveJSProperty("selectedRowIndexes", [0, 1]);
    });

    test("should apply user set selection in 'single-row' selection mode", async () => {
        const selectedRows = element.locator(selectedRowQueryString);

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
            <fast-data-grid generate-header="none" initial-row-selection="0" selection-mode="single-row">
                <fast-data-grid-row>
                    <fast-data-grid-cell>1</fast-data-grid-cell>
                </fast-data-grid-row>
                <fast-data-grid-row>
                    <fast-data-grid-cell>2</fast-data-grid-cell>
                </fast-data-grid-row>
                <fast-data-grid-row>
                    <fast-data-grid-cell>2</fast-data-grid-cell>
                </fast-data-grid-row>
            </fast-data-grid>
            `;
        });

        await expect(element).toHaveJSProperty("selectedRowIndexes", [0]);
        await expect(selectedRows).toHaveCount(1);

        await element.evaluate((node: FASTDataGrid) => {
            node.selectedRowIndexes = [];
        });

        await expect(selectedRows).toHaveCount(0);

        await element.evaluate((node: FASTDataGrid) => {
            node.selectedRowIndexes = [2];
        });

        await expect(selectedRows).toHaveCount(1);
    });

    test("should apply user set selection in 'multi-row' selection mode", async () => {
        const selectedRows = element.locator(selectedRowQueryString);

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
            <fast-data-grid generate-header="none" initial-row-selection="0" selection-mode="multi-row">
                <fast-data-grid-row>
                    <fast-data-grid-cell>1</fast-data-grid-cell>
                </fast-data-grid-row>
                <fast-data-grid-row>
                    <fast-data-grid-cell>2</fast-data-grid-cell>
                </fast-data-grid-row>
                <fast-data-grid-row>
                    <fast-data-grid-cell>2</fast-data-grid-cell>
                </fast-data-grid-row>
            </fast-data-grid>
            `;
        });

        await expect(element).toHaveJSProperty("selectedRowIndexes", [0]);
        await expect(selectedRows).toHaveCount(1);

        await element.evaluate((node: FASTDataGrid) => {
            node.selectedRowIndexes = [];
        });

        await expect(selectedRows).toHaveCount(0);

        await element.evaluate((node: FASTDataGrid) => {
            node.selectedRowIndexes = [0, 1, 2];
        });

        await expect(selectedRows).toHaveCount(3);
    });

    test("should not allow selection of header row by default", async () => {
        const selectedRows = element.locator(selectedRowQueryString);

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
            <fast-data-grid generate-header="none" initial-row-selection="0" selection-mode="single-row">
                <fast-data-grid-row row-type="header">
                    <fast-data-grid-cell>1</fast-data-grid-cell>
                </fast-data-grid-row>
                <fast-data-grid-row>
                    <fast-data-grid-cell>2</fast-data-grid-cell>
                </fast-data-grid-row>
                <fast-data-grid-row>
                    <fast-data-grid-cell>2</fast-data-grid-cell>
                </fast-data-grid-row>
            </fast-data-grid>
            `;
        });

        await expect(element).toHaveJSProperty("selectedRowIndexes", []);
        await expect(selectedRows).toHaveCount(0);
    });

    test("should select and deselect rows with space bar + shift keys", async () => {
        const rows = element.locator(rowQueryString);
        const selectedRows = element.locator(selectedRowQueryString);
        const firstCell = rows.nth(0).locator("fast-data-grid-cell").nth(0);
        const lastCell = rows.nth(2).locator("fast-data-grid-cell").nth(2);

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none" selection-mode="single-row"></fast-data-grid>
            `;
        });

        await element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "item 1", shape: "circle" },
                { id: "2", name: "item 2", shape: "square" },
                { id: "3", name: "item 3", shape: "triangle" },
            ];
        });

        await firstCell.focus();
        await expect(selectedRows).toHaveCount(0);
        await page.keyboard.press("Shift+Space");
        await expect(selectedRows).toHaveCount(1);
        await expect(element).toHaveJSProperty("selectedRowIndexes", [0]);
        expect;
        await page.keyboard.press("Shift+Space");
        await expect(selectedRows).toHaveCount(0);
        await lastCell.focus();
        await page.keyboard.press("Shift+Space");
        await expect(selectedRows).toHaveCount(1);
        await expect(element).toHaveJSProperty("selectedRowIndexes", [2]);
    });

    test("should select and deselect rows with a click", async () => {
        const rows = element.locator(rowQueryString);
        const selectedRows = element.locator(selectedRowQueryString);
        const firstCell = rows.nth(0).locator("fast-data-grid-cell").nth(0);
        const lastCell = rows.nth(2).locator("fast-data-grid-cell").nth(2);

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none" selection-mode="single-row"></fast-data-grid>
            `;
        });

        await element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "item 1", shape: "circle" },
                { id: "2", name: "item 2", shape: "square" },
                { id: "3", name: "item 3", shape: "triangle" },
            ];
        });

        await expect(selectedRows).toHaveCount(0);
        await firstCell.click();
        await expect(selectedRows).toHaveCount(1);
        await expect(element).toHaveJSProperty("selectedRowIndexes", [0]);
        await firstCell.click();
        await expect(selectedRows).toHaveCount(0);
        await expect(element).toHaveJSProperty("selectedRowIndexes", []);
        await lastCell.click();
        await expect(selectedRows).toHaveCount(1);
        await expect(element).toHaveJSProperty("selectedRowIndexes", [2]);
    });

    test("should select/deselect all in row multi-select with a ctrl + a", async () => {
        const selectedRows = element.locator(selectedRowQueryString);
        const rows = element.locator(rowQueryString);
        const firstCell = rows.nth(0).locator("fast-data-grid-cell").nth(0);
        await firstCell.focus();

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none" selection-mode="multi-row"></fast-data-grid>
            `;
        });

        await element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "item 1", shape: "circle" },
                { id: "2", name: "item 2", shape: "square" },
                { id: "3", name: "item 3", shape: "triangle" },
            ];
        });

        await firstCell.focus();
        await expect(selectedRows).toHaveCount(0);
        await page.keyboard.press("Control+a");
        await expect(selectedRows).toHaveCount(3);
        await page.keyboard.press("Control+a");
        await expect(selectedRows).toHaveCount(0);
    });

    test("should select/deselect multiple rows with shift key in multi-select mode", async () => {
        const selectedRows = element.locator(selectedRowQueryString);
        const rows = element.locator(rowQueryString);
        const firstCell = rows.nth(0).locator("fast-data-grid-cell").nth(0);
        const lastCell = rows.nth(2).locator("fast-data-grid-cell").nth(2);
        await firstCell.focus();

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none" selection-mode="multi-row"></fast-data-grid>
            `;
        });

        await element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "item 1", shape: "circle" },
                { id: "2", name: "item 2", shape: "square" },
                { id: "3", name: "item 3", shape: "triangle" },
            ];
        });

        await firstCell.focus();
        await page.keyboard.press("Shift+Space");
        await expect(selectedRows).toHaveCount(1);
        await lastCell.focus();
        await page.keyboard.press("Shift+Space");
        await expect(selectedRows).toHaveCount(2);
    });

    test("should emit an event when row selection changes", async () => {
        const rows = element.locator(rowQueryString);
        const firstCell = rows.nth(0).locator("fast-data-grid-cell").nth(0);
        await firstCell.focus();

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid generate-header="none" selection-mode="multi-row"></fast-data-grid>
            `;
        });

        await element.evaluate((node: FASTDataGrid) => {
            node.rowsData = [
                { id: "1", name: "item 1", shape: "circle" },
                { id: "2", name: "item 2", shape: "square" },
                { id: "3", name: "item 3", shape: "triangle" },
            ];
        });

        const wasInvoked = await Promise.all([
            element.evaluate(node =>
                node.addEventListener("selectionchange", () => true)
            ),
            firstCell.click(),
        ]);

        expect(wasInvoked).toBeTruthy;
    });
});
