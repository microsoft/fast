import { expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { 
    dataGridTemplate, 
    DataGrid, 
    DataGridRow, 
    dataGridRowTemplate, 
    DataGridCell,
    dataGridCellTemplate 
} from "./index";
import type { ColumnDefinition } from "./data-grid";
import { DataGridRowTypes, GenerateHeaderOptions } from "./data-grid.options";
import { DOM } from "@microsoft/fast-element";
import { KeyCodes } from "@microsoft/fast-web-utilities";

const FASTDataGridCell = DataGridCell.compose({
    baseName: "data-grid-cell",
    template: dataGridCellTemplate
})

const FASTDataGridRow = DataGridRow.compose({
    baseName: "data-grid-row",
    template: dataGridRowTemplate
})

const FASTDataGrid = DataGrid.compose({
    baseName: "data-grid",
    template: dataGridTemplate
})

// Utility functions to generate test data
export function newDataSet(rowCount: number): object[] {
    const newRows: object[] = [];
    for (let i = 0; i < rowCount; i++) {
        newRows.push(newDataRow(`${i + 1}`));
    }
    return newRows;
}

export function newDataRow(id: string): object {
    return {
        item1: `value 1-${id}`,
        item2: `value 2-${id}`,
        item3: `value 3-${id}`,
        item4: `value 4-${id}`,
        item5: `value 5-${id}`,
        item6: `value 6-${id}`,
    };
}

const arrowUpEvent = new KeyboardEvent("keydown", {
    key: "ArrowUp",
    keyCode: KeyCodes.arrowUp,
    bubbles: true,
} as KeyboardEventInit);

const arrowDownEvent = new KeyboardEvent("keydown", {
    key: "ArrowDown",
    keyCode: KeyCodes.arrowDown,
    bubbles: true,
} as KeyboardEventInit);

const homeEvent = new KeyboardEvent("keydown", {
    key: "Home",
    keyCode: KeyCodes.home,
    bubbles: true,
    ctrlKey: true,
} as KeyboardEventInit);

const endEvent = new KeyboardEvent("keydown", {
    key: "End",
    keyCode: KeyCodes.end,
    bubbles: true,
    ctrlKey: true,
} as KeyboardEventInit);

const cellQueryString = '[role="cell"], [role="gridcell"], [role="columnheader"]';

async function setup() {
    const { document, element, connect, disconnect} = await fixture(
        [FASTDataGrid(), FASTDataGridRow(), FASTDataGridCell()]
    );
    return { document, element, connect, disconnect};
}

describe("Data grid", () => {
    it("should set role to 'grid'", async () => {
        const { document, element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("role")).to.equal("grid");

        await disconnect();
    });

    it("should have a tabIndex of 0 by default", async () => {
        const {  document, element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should have a tabIndex of -1 when a cell is focused", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(2);

        await connect();

        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        expect(rows.length).to.equal(3);
        const cells: Element[] = Array.from(rows[0].querySelectorAll(cellQueryString));
        expect(cells.length).to.equal(6);

        (cells[0] as HTMLElement).focus();

        expect(element.getAttribute("tabindex")).to.equal("-1");

        await disconnect();
    });

    it("should generate basic column definitions when generateColumns is called", async () => {
        const columns: ColumnDefinition[] = DataGrid.generateColumns(newDataRow("test"));
        expect(columns.length).to.equal(6);
        expect(columns[0].columnDataKey).to.equal("item1");
        expect(columns[5].columnDataKey).to.equal("item6");
    });

    it("should generate a basic grid with a row header based on rowsdata only", async () => {
        const {  document, element, connect, disconnect } = await setup();
        element.rowsData = newDataSet(5);
        await connect();

        const rows: DataGridRow[] = Array.from(element.querySelectorAll('[role="row"]'));

        expect(rows.length).to.equal(6);
        expect(rows[0].rowType).to.equal(DataGridRowTypes.header);

        await disconnect();
    });

    it("should not generate a header when generateHeader is set to 'none'", async () => {
        const {  document, element, connect, disconnect } = await setup();
        element.rowsData = newDataSet(5);
        element.generateHeader = GenerateHeaderOptions.none;
        await connect();

        const rows: DataGridRow[] = Array.from(element.querySelectorAll('[role="row"]'));

        expect(rows.length).to.equal(5);
        expect(rows[0].rowType).to.equal(DataGridRowTypes.default);

        await disconnect();
    });

    it("should generate a sticky header when generateHeader is set to 'sticky'", async () => {
        const {  document, element, connect, disconnect } = await setup();
        element.rowsData = newDataSet(5);
        element.generateHeader = GenerateHeaderOptions.sticky;
        await connect();

        const rows: DataGridRow[] = Array.from(element.querySelectorAll('[role="row"]'));

        expect(rows.length).to.equal(6);
        expect(rows[0].rowType).to.equal(DataGridRowTypes.stickyHeader);

        await disconnect();
    });

    it("should set the row index attribute of child rows'", async () => {
        const { document, element, connect, disconnect } = await setup();
        element.rowsData = newDataSet(5);
        element.generateHeader = GenerateHeaderOptions.sticky;
        await connect();

        const rows: DataGridRow[] = Array.from(element.querySelectorAll('[role="row"]'));

        await DOM.nextUpdate();

        expect(rows.length).to.equal(6);
        expect(rows[0].rowIndex).to.equal(0);
        expect(rows[1].rowIndex).to.equal(1);
        expect(rows[2].rowIndex).to.equal(2);
        expect(rows[3].rowIndex).to.equal(3);
        expect(rows[4].rowIndex).to.equal(4);
        expect(rows[5].rowIndex).to.equal(5);

        await disconnect();
    });

    it("should move focus with up/down arrow key strokes", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(2);

        await connect();

        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        expect(rows.length).to.equal(3);
        const cells: Element[] = Array.from(rows[0].querySelectorAll(cellQueryString));
        expect(cells.length).to.equal(6);

        (cells[0] as HTMLElement).focus();
        expect(document.activeElement?.textContent).to.contain("item1");

        document.activeElement?.dispatchEvent(arrowDownEvent);
        expect(document.activeElement?.textContent).to.contain("value 1-1");

        document.activeElement?.dispatchEvent(arrowDownEvent);
        expect(document.activeElement?.textContent).to.contain("value 1-2");

        document.activeElement?.dispatchEvent(arrowDownEvent);
        expect(document.activeElement?.textContent).to.contain("value 1-2");

        document.activeElement?.dispatchEvent(arrowUpEvent);
        expect(document.activeElement?.textContent).to.contain("value 1-1");

        document.activeElement?.dispatchEvent(arrowUpEvent);
        expect(document.activeElement?.textContent).to.contain("item1");

        document.activeElement?.dispatchEvent(arrowUpEvent);
        expect(document.activeElement?.textContent).to.contain("item1");

        await disconnect();
    });

    it("should move focus to first/last cells with ctrl + home/end key strokes", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(2);

        await connect();

        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        expect(rows.length).to.equal(3);
        const cells: Element[] = Array.from(rows[0].querySelectorAll(cellQueryString));
        expect(cells.length).to.equal(6);

        (cells[0] as HTMLElement).focus();
        expect(document.activeElement?.textContent).to.contain("item1");

        document.activeElement?.dispatchEvent(endEvent);
        expect(document.activeElement?.textContent).to.contain("value 6-2");

        document.activeElement?.dispatchEvent(homeEvent);
        expect(document.activeElement?.textContent).to.contain("item1");

        await disconnect();
    });

    it("should move focus by setting focusRowIndex", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(2);

        await connect();

        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        expect(rows.length).to.equal(3);
        const cells: Element[] = Array.from(rows[0].querySelectorAll(cellQueryString));
        expect(cells.length).to.equal(6);

        (cells[0] as HTMLElement).focus();
        expect(document.activeElement?.textContent).to.contain("item1");

        element.focusRowIndex = 1;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("value 1-1");

        element.focusRowIndex = 2;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("value 1-2");

        element.focusRowIndex = 3;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("value 1-2");

        await disconnect();
    });

    it("should move focus by setting focusColumnIndex", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(2);

        await connect();

        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        expect(rows.length).to.equal(3);
        const cells: Element[] = Array.from(rows[0].querySelectorAll(cellQueryString));
        expect(cells.length).to.equal(6);

        (cells[0] as HTMLElement).focus();
        expect(document.activeElement?.textContent).to.contain("item1");

        element.focusColumnIndex = 1;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("item2");

        element.focusColumnIndex = 6;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("item6");

        element.focusColumnIndex = 7;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("item6");

        await disconnect();
    });
});
