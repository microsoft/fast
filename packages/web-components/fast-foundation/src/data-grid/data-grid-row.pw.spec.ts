import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDataGridRow } from "./data-grid-row.js";

test.describe("DataGridRow", () => {
    const cellQueryString =
        '[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]';

    test.describe("States, Attributes, and Properties", () => {
        let page: Page;
        let element: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-data-grid-row");

            await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test('should set the `role` attribute to "row" by default', async () => {
            await expect(element).toHaveAttribute("role", "row");
        });

        test('should add the "header" class when the `row-type` attribute is "header"', async () => {
            await element.evaluate(node => {
                node.setAttribute("row-type", "header");
            });

            await expect(element).toHaveClass(/header/);

            await element.evaluate(node => {
                node.removeAttribute("row-type");
            });

            await expect(element).not.toHaveClass(/header/);
        });

        test('should apply "sticky-header" class when the `row-type` attribute is "sticky-header"', async () => {
            await element.evaluate(node => {
                node.setAttribute("row-type", "sticky-header");
            });

            await expect(element).toHaveClass(/sticky-header/);

            await element.evaluate(node => {
                node.removeAttribute("row-type");
            });

            await expect(element).not.toHaveClass(/sticky-header/);
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

        test("should fire an event when a child cell is focused", async () => {
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

        test("should move focus with left/right arrow key strokes", async () => {
            await element.locator(cellQueryString).first().focus();

            await expect(element).toHaveJSProperty("focusColumnIndex", 0);

            await page.keyboard.press("ArrowRight");

            await expect(element).toHaveJSProperty("focusColumnIndex", 1);

            await page.keyboard.press("ArrowLeft");

            await expect(element).toHaveJSProperty("focusColumnIndex", 0);
        });

        test("should move focus to the start/end of the row with home/end keystrokes", async () => {
            await element.locator(cellQueryString).first().focus();

            await expect(element).toHaveJSProperty("focusColumnIndex", 0);

            await page.keyboard.press("End");

            await expect(element).toHaveJSProperty("focusColumnIndex", 1);

            await page.keyboard.press("Home");

            await expect(element).toHaveJSProperty("focusColumnIndex", 0);
        });
    });

    test("should render no cells if provided no column definitions", async ({ page }) => {
        await page.goto(
            fixtureURL("data-grid-data-grid-row--data-grid-row", {
                columnDefinitions: "!undefined",
            })
        );

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
        await page.goto(fixtureURL("debug--blank"));

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
});
