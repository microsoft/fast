import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDataGridCell } from "./data-grid-cell.js";
import { DataGridCellTypes } from "./data-grid.options.js";

test.describe("Data grid cell", () => {
    test.describe("States, Attributes, and Properties", () => {
        let page: Page;
        let element: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-data-grid-cell");

            await page.goto(fixtureURL("data-grid-data-grid-cell--data-grid-cell"));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test('should set the `role` attribute to "gridcell" by default', async () => {
            await expect(element).toHaveAttribute("role", "gridcell");
        });

        test("should have a tabIndex of -1 by default", async () => {
            await expect(element).toHaveAttribute("tabindex", "-1");
        });

        test('should set the `role` attribute to "columnheader" when the `cell-type` attribute is "columnheader"', async () => {
            await element.evaluate(node => {
                node.setAttribute("cell-type", "columnheader");
            });

            await expect(element).toHaveAttribute("role", "columnheader");
        });

        test('should add the "column-header" class when the `cell-type` attribute is "columnheader"', async () => {
            await element.evaluate(node => {
                node.setAttribute("cell-type", "columnheader");
            });

            await expect(element).toHaveClass(/column-header/);
        });

        test('should set the `role` attribute to "rowheader" when the `cell-type` attribute is "rowheader"', async () => {
            await element.evaluate(node => {
                node.setAttribute("cell-type", "rowheader");
            });

            await expect(element).toHaveAttribute("role", "rowheader");
        });

        test('should add the "row-header" class when the `cell-type` attribute is "rowheader"', async () => {
            await element.evaluate(node => {
                node.setAttribute("cell-type", "rowheader");
            });

            await expect(element).toHaveClass(/row-header/);
        });

        test("should set the `grid-column` CSS property to match the `grid-column` attribute", async () => {
            await element.evaluate(node => {
                node.setAttribute("grid-column", "2");
            });

            await expect(element).toHaveCSS("grid-column-start", "2");

            await expect(element).toHaveCSS("grid-column-end", "auto");
        });
    });

    test("should not render data if no columndefinition provided", async ({ page }) => {
        await page.goto(
            fixtureURL("data-grid-data-grid-cell--data-grid-cell", {
                columnDefinition: "!undefined",
            })
        );

        const element = page.locator("fast-data-grid-cell");

        await expect(element).toBeEmpty();
    });

    test("should render data when a column definition is provided", async ({ page }) => {
        await page.goto(
            fixtureURL("data-grid-data-grid-cell--data-grid-cell", {
                columnDefinition: {
                    columnDataKey: "item2",
                },
            })
        );

        const element = page.locator("fast-data-grid-cell");

        await expect(element).toHaveText("data grid cell value 2");
    });

    test("should render a custom cell template when provided", async ({ page }) => {
        await page.goto(fixtureURL("data-grid-data-grid-cell--data-grid-cell"));

        const element = page.locator("fast-data-grid-cell");

        await element.evaluate((node: FASTDataGridCell) => {
            node.columnDefinition = {
                columnDataKey: "item2",
                cellTemplate: /* html */ `<template>custom cell template</template>`,
            };
        });

        await expect(element).toHaveText("custom cell template");
    });

    test("should render a custom header cell template if provided", async ({ page }) => {
        await page.goto(fixtureURL("data-grid-data-grid-cell--data-grid-cell"));

        const element = page.locator("fast-data-grid-cell");

        await element.evaluate((node: FASTDataGridCell, DataGridCellTypes) => {
            node.cellType = DataGridCellTypes.columnHeader;
            node.columnDefinition = {
                columnDataKey: "item2",
                headerCellTemplate: /* html */ `<template>custom header cell template</template>`,
            };
        }, DataGridCellTypes);

        await expect(element).toHaveText("custom header cell template");
    });

    test("should fire an event when focused", async ({ page }) => {
        await page.goto(fixtureURL("data-grid-data-grid-cell--data-grid-cell"));

        const element = page.locator("fast-data-grid-cell");

        const wasInvoked = await Promise.all([
            element.evaluate(node => node.addEventListener("cell-focused", () => true)),
            element.focus(),
        ]);

        expect(wasInvoked).toBeTruthy();

        expect(
            await element.evaluate(node => document.activeElement?.isSameNode(node))
        ).toBeTruthy();
    });

    test("should focus on custom cell template when a focus target callback is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("data-grid-data-grid-cell--data-grid-cell"));

        const element = page.locator("fast-data-grid-cell");

        await element.evaluate((node: FASTDataGridCell) => {
            node.columnDefinition = {
                columnDataKey: "item2",
                cellFocusTargetCallback: cell =>
                    cell.querySelector("button") as HTMLButtonElement,
                cellTemplate: /* html */ `<template><button>test button</button></template>`,
            };
        });

        await element.focus();

        expect(await page.evaluate(() => document.activeElement?.textContent)).toBe(
            "test button"
        );
    });

    test("should focus on custom header cell template when a focus target callback is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("data-grid-data-grid-cell--data-grid-cell"));

        const element = page.locator("fast-data-grid-cell");

        await element.evaluate((node: FASTDataGridCell, DataGridCellTypes) => {
            node.cellType = DataGridCellTypes.columnHeader;
            node.columnDefinition = {
                columnDataKey: "item2",
                headerCellTemplate: /* html */ `<template><button>test header button</button></template>`,
                headerCellFocusTargetCallback: cell =>
                    cell.querySelector("button") as HTMLButtonElement,
            };
        }, DataGridCellTypes);

        await element.focus();

        expect(await page.evaluate(() => document.activeElement?.textContent)).toBe(
            "test header button"
        );
    });
});
