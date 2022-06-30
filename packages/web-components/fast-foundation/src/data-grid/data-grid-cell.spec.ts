import { expect } from "chai";
import { html, ViewTemplate } from "@microsoft/fast-element";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { dataGridCellTemplate, FASTDataGridCell } from "./index.js";
import { newDataRow } from "./data-grid.spec.js";
import { DataGridCellTypes } from "./data-grid.options.js";

const dataGridCellName = uniqueElementName();
FASTDataGridCell.define({
    name: dataGridCellName,
    template: dataGridCellTemplate()
});

const testCellContentsTemplate: ViewTemplate = html<FASTDataGridCell>`
    <template>
        Test template
    </template>
`;

const testFocusableCellContentsTemplate: ViewTemplate = html<FASTDataGridCell>`
    <template>
        <button>Test button</button>
    </template>
`;

function getFocusTarget(cell: FASTDataGridCell): HTMLElement {
    return cell.querySelector("button") as HTMLElement;
}

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<FASTDataGridCell>(dataGridCellName);
    return { element, connect, disconnect, parent };
}

describe("Data grid cell", () => {
    it("should set role to 'gridcell' by default", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("role")).to.equal("gridcell");

        await disconnect();
    });

    it("should set role to 'columnheader' when cell-type is 'columnheader'", async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute("cell-type", "columnheader");
        await connect();

        expect(element.getAttribute("role")).to.equal("columnheader");

        await disconnect();
    });


    it("should set role to 'rowheader' when cell-type is 'rowheader'", async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute("cell-type", "rowheader");
        await connect();

        expect(element.getAttribute("role")).to.equal("rowheader");

        await disconnect();
    });

    it("should apply 'column-header' css class when cell-type is 'columnheader'", async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute("cell-type", "columnheader");
        await connect();

        expect(element.className).to.contain("column-header");

        await disconnect();
    });

    it("should apply 'row-header' css class when cell-type is 'rowheader'", async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute("cell-type", "rowheader");
        await connect();

        expect(element.className).to.contain("row-header");

        await disconnect();
    });

    it("should have a tabIndex of -1 by default", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("tabindex")).to.equal("-1");

        await disconnect();
    });

    it("should set css grid-column style to match attribute", async () => {
        const { element, connect, disconnect } = await setup();

        element.setAttribute("grid-column", "2");
        await connect();

        expect(element.style.gridColumnStart).to.equal("2");
        expect(element.style.gridColumnEnd).to.equal("auto");

        await disconnect();
    });

    it("should set css grid-column style to match attribute", async () => {
        const { element, connect, disconnect } = await setup();

        element.setAttribute("grid-column", "2");
        await connect();

        expect(element.style.gridColumnStart).to.equal("2");
        expect(element.style.gridColumnEnd).to.equal("auto");

        await disconnect();
    });

    it("should not render data if no columndefinition provided", async () => {
        const { element, connect, disconnect } = await setup();

        (element as FASTDataGridCell).rowData = newDataRow("test");
        await connect();

        expect(element.textContent).to.equal("");

        await disconnect();
    });

    it("should render data if a column definition provided", async () => {
        const { element, connect, disconnect } = await setup();

        (element as FASTDataGridCell).columnDefinition = { columnDataKey: "item2" };
        (element as FASTDataGridCell).rowData = newDataRow("test");
        await connect();

        expect(element.textContent).to.include("value 2-test");

        await disconnect();
    });

    it("should render a custom cell template if provided", async () => {
        const { element, connect, disconnect } = await setup();

        (element as FASTDataGridCell).columnDefinition = {
            columnDataKey: "item2",
            cellTemplate: testCellContentsTemplate,
        };
        (element as FASTDataGridCell).rowData = newDataRow("test");
        await connect();

        expect(element.textContent).to.include("Test template");

        await disconnect();
    });

    it("should render a custom header cell template if provided", async () => {
        const { element, connect, disconnect } = await setup();

        (element as FASTDataGridCell).columnDefinition = {
            columnDataKey: "item2",
            headerCellTemplate: testCellContentsTemplate,
        };
        (element as FASTDataGridCell).rowData = newDataRow("test");
        (element as FASTDataGridCell).cellType = DataGridCellTypes.columnHeader;

        await connect();

        expect(element.textContent).to.include("Test template");

        await disconnect();
    });

    it("should fire an event when focused", async () => {
        const { element, connect, disconnect } = await setup();

        let wasInvoked: boolean = false;

        (element as FASTDataGridCell).columnDefinition = {
            columnDataKey: "item2",
        };
        element.addEventListener("cell-focused", e => {
            wasInvoked = true;
        });

        await connect();

        element.focus();
        expect(document.activeElement).to.equal(element);
        expect(wasInvoked).to.equal(true);

        await disconnect();
    });

    it("should focus on custom cell template if focus target callback provided", async () => {
        const { element, connect, disconnect } = await setup();

        (element as FASTDataGridCell).columnDefinition = {
            columnDataKey: "item2",
            cellTemplate: testFocusableCellContentsTemplate,
            cellFocusTargetCallback: getFocusTarget,
        };
        (element as FASTDataGridCell).rowData = newDataRow("test");
        await connect();

        element.focus();
        expect(document.activeElement?.textContent).to.contain("Test button");

        await disconnect();
    });

    it("should focus on custom header cell template if focus target callback provided", async () => {
        const { element, connect, disconnect } = await setup();

        (element as FASTDataGridCell).columnDefinition = {
            columnDataKey: "item2",
            headerCellTemplate: testFocusableCellContentsTemplate,
            headerCellFocusTargetCallback: getFocusTarget,
        };
        (element as FASTDataGridCell).cellType = DataGridCellTypes.columnHeader;
        (element as FASTDataGridCell).rowData = newDataRow("test");
        await connect();

        element.focus();
        expect(document.activeElement?.textContent).to.contain("Test button");

        await disconnect();
    });
});
