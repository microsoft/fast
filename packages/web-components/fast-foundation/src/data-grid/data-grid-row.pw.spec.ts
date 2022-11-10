import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDataGridRow } from "./data-grid-row.js";

test.describe("DataGridRow", () => {
    const cellQueryString = "fast-data-grid-cell";

    let page: Page;
    let element: Locator;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-data-grid-row");

        root = page.locator("#root");

        await page.goto(fixtureURL("data-grid-data-grid-row--data-grid-row"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('should set the `role` attribute to "row" by default', async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-data-grid-row></fast-data-grid-row>
            `;
        });

        await expect(element).toHaveAttribute("role", "row");
    });

    test("should set `grid-template-columns` style to match attribute", async () => {
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

    test("should fire an event when a child cell is focused", async () => {
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

    test("should move focus with left/right arrow key strokes", async () => {
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

    test("should move focus to the start/end of the row with home/end keystrokes", async () => {
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

    test("should render no cells if provided no column definitions", async () => {
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

    test("should render as many column header cells as specified in column definitions", async () => {
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

    test("should emit a 'rowselectionchange' event when clicked with disableClickSelect disabled", async () => {
        await root.evaluate((node: FASTDataGridRow) => {
            node.innerHTML = /* html */ `
                <fast-data-grid-row>
                    <fast-data-grid-cell ></fast-data-grid-cell>
                </fast-data-grid-row>
            `;
            node.disableClickSelect = false;
        });

        const wasInvoked = await Promise.all([
            element.evaluate(node =>
                node.addEventListener("rowselectionchange", () => true)
            ),
            element.click(),
        ]);

        expect(wasInvoked).toBeTruthy;
    });

    test("should not emit a 'rowselectionchange' event when clicked with disableClickSelect disabled", async () => {
        await root.evaluate((node: FASTDataGridRow) => {
            node.innerHTML = /* html */ `
                <fast-data-grid-row>
                    <fast-data-grid-cell ></fast-data-grid-cell>
                </fast-data-grid-row>
            `;
            node.disableClickSelect = true;
        });

        const wasInvoked = await Promise.all([
            element.evaluate(node =>
                node.addEventListener("rowselectionchange", () => true)
            ),
            element.click(),
        ]);

        expect(wasInvoked).toBeFalsy;
    });

    test("should emit a 'rowselectionchange' event when space key is pressed with disableClickSelect disabled", async () => {
        await root.evaluate((node: FASTDataGridRow) => {
            node.innerHTML = /* html */ `
                <fast-data-grid-row>
                    <fast-data-grid-cell ></fast-data-grid-cell>
                </fast-data-grid-row>
            `;
            node.disableClickSelect = false;
        });

        const wasInvoked = await Promise.all([
            element.evaluate(node => {
                node.addEventListener("rowselectionchange", () => true);
                // FIXME: Playwright's keyboard API is not working as expected.
                node.dispatchEvent(new KeyboardEvent("keydown", { key: "Space" }));
            }),
        ]);

        expect(wasInvoked).toBeTruthy;
    });
});
