import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDataGridRow } from "./data-grid-row.js";

test.describe("DataGridRow", () => {
    const cellQueryString =
        '[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]';

    test("should set role to 'row'", async ({ page }) => {
        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));

        const element = page.locator("fast-data-grid-row");

        await expect(element).toHaveAttribute("role", "row");
    });

    test("should apply 'header' css class when row-type is 'header'", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("data-grid-data-grid-row--data-grid-row", {
                rowType: "header",
            })
        );

        const element = page.locator("fast-data-grid-row");

        await expect(element).toHaveAttribute("class", "header");
    });

    test("should apply 'sticky-header' css class when row-type is 'sticky-header'", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("data-grid-data-grid-row--data-grid-row", {
                rowType: "sticky-header",
            })
        );

        const element = page.locator("fast-data-grid-row");

        await expect(element).toHaveAttribute("class", "sticky-header");
    });

    test("should set `grid-template-columns` style to match attribute", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("data-grid-data-grid-row--data-grid-row", {
                gridTemplateColumns: "100px+200px",
            })
        );

        const element = page.locator("fast-data-grid-row");

        await expect(element).toHaveAttribute(
            "style",
            "grid-template-columns: 100px 200px;"
        );
    });

    test("should render no cells if provided no column definitions", async ({ page }) => {
        await page.goto(fixtureURL());

        await page.evaluate(() => {
            const node = document.createElement("fast-data-grid-row");
            document.getElementById("root")?.append(node);
        });

        const element = page.locator("fast-data-grid-row");

        const cells = element.locator("fast-data-grid-cell");

        await expect(cells).toHaveCount(0);
    });

    test("should render as many column header cells as specified in column definitions", async ({
        page,
    }) => {
        await page.goto(fixtureURL());

        const element = page.locator("fast-data-grid-row");

        const cells = element.locator(cellQueryString);

        await page.evaluate(() => {
            const node = document.createElement("fast-data-grid-row") as FASTDataGridRow;
            node.columnDefinitions = [{ columnDataKey: "item1" }];
            document.getElementById("root")?.append(node);
        });

        await expect(cells).toHaveCount(1);

        await element.evaluate((node: FASTDataGridRow) => {
            node.columnDefinitions = [
                { columnDataKey: "item1" },
                { columnDataKey: "item2" },
            ];
        });

        await expect(cells).toHaveCount(2);
    });

    test("should fire an event when a child cell is focused", async ({ page }) => {
        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));

        const element = page.locator("fast-data-grid-row");

        await expect(
            await element.evaluate((node: FASTDataGridRow) => {
                let wasInvoked = false;

                node.addEventListener("row-focused", () => {
                    wasInvoked = true;
                });

                node.cellElements[0].focus();

                return Promise.resolve(wasInvoked);
            })
        ).toBe(true);
    });

    test("should move focus with left/right arrow key strokes", async ({ page }) => {
        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));

        const element = page.locator("fast-data-grid-row");

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
        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));

        const element = page.locator("fast-data-grid-row");

        await element.locator(cellQueryString).first().focus();

        await expect(element).toHaveJSProperty("focusColumnIndex", 0);

        await page.keyboard.press("End");

        await expect(element).toHaveJSProperty("focusColumnIndex", 1);

        await page.keyboard.press("Home");

        await expect(element).toHaveJSProperty("focusColumnIndex", 0);
    });
});
