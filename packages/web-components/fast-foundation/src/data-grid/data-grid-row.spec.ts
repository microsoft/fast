import { expect } from "chai";
import { Updates } from "@microsoft/fast-element";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { ColumnDefinition, dataGridRowTemplate, FASTDataGridCell, dataGridCellTemplate, FASTDataGridRow } from "./index.js";
import { newDataRow } from "./data-grid.spec.js";
import { keyArrowLeft, keyArrowRight, keyEnd, keyHome } from "@microsoft/fast-web-utilities";

const dataGridCellName = uniqueElementName();
FASTDataGridCell.define({
    name: dataGridCellName,
    template: dataGridCellTemplate()
});

const dataGridRowName = uniqueElementName();
FASTDataGridRow.define({
    name: dataGridRowName,
    template: dataGridRowTemplate({
        dataGridCell: dataGridCellName
    })
});

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTDataGridRow>(dataGridRowName);
    return { element, connect, disconnect };
}

const arrowRightEvent = new KeyboardEvent("keydown", {
    key: keyArrowRight,
    bubbles: true,
} as KeyboardEventInit);

const arrowLeftEvent = new KeyboardEvent("keydown", {
    key: keyArrowLeft,
    bubbles: true,
} as KeyboardEventInit);

const homeEvent = new KeyboardEvent("keydown", {
    key: keyHome,
    bubbles: true,
} as KeyboardEventInit);

const endEvent = new KeyboardEvent("keydown", {
    key: keyEnd,
    bubbles: true,
} as KeyboardEventInit);

const cellQueryString = '[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]';

describe("Data grid row", () => {
    it("should set role to 'row'", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("role")).to.equal("row");

        await disconnect();
    });

    it("should apply 'header' css class when row-type is 'header'", async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute("row-type", "header");
        await connect();

        expect(element.className).to.contain("header");

        await disconnect();
    });

    it("should apply 'sticky-header' css class when row-type is 'sticky-header'", async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute("row-type", "sticky-header");
        await connect();

        expect(element.className).to.contain("header");

        await disconnect();
    });

    it("should set css grid-template-columns style to match attribute", async () => {
        const { element, connect, disconnect } = await setup();

        element.setAttribute("grid-template-columns", "100px 200px");
        await connect();

        expect(element.style.gridTemplateColumns).to.equal("100px 200px");

        await disconnect();
    });

    it("should render no cells if provided no column definitions ", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.querySelectorAll(cellQueryString).length).to.equal(0);

        await disconnect();
    });

    it("should render as many column header cells as specified in column definitions", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.querySelectorAll(cellQueryString).length).to.equal(0);

        element.columnDefinitions = [{ columnDataKey: "item1" }];
        await Updates.next();
        expect(element.querySelectorAll(cellQueryString).length).to.equal(1);

        element.columnDefinitions = [
            { columnDataKey: "item1" },
            { columnDataKey: "item2" },
        ];
        await Updates.next();
        expect(element.querySelectorAll(cellQueryString).length).to.equal(2);

        await disconnect();
    });

    it("should fire an event when a child cell is focused", async () => {
        const { element, connect, disconnect } = await setup();

        let wasInvoked: boolean = false;

        element.columnDefinitions = [
            { columnDataKey: "item1" },
            { columnDataKey: "item2" },
        ];
        element.addEventListener("row-focused", e => {
            wasInvoked = true;
        });

        await connect();

        (element.querySelectorAll(cellQueryString)[0] as HTMLElement).focus();
        expect(wasInvoked).to.equal(true);

        await disconnect();
    });

    it("should move focus with left/right arrow key strokes", async () => {
        const { element, connect, disconnect } = await setup();

        element.columnDefinitions = [
            { columnDataKey: "item1", isRowHeader: true },
            { columnDataKey: "item2" },
            { columnDataKey: "item3" },
        ] as ColumnDefinition[];
        (element as FASTDataGridRow).rowData = newDataRow("test");

        await connect();

        (element.querySelectorAll(cellQueryString)[0] as HTMLElement).focus();
        expect(document.activeElement?.textContent).to.contain("value 1-test");

        (element.querySelectorAll(cellQueryString)[0] as HTMLElement).dispatchEvent(
            arrowRightEvent
        );
        expect(document.activeElement?.textContent).to.contain("value 2-test");

        (element.querySelectorAll(cellQueryString)[1] as HTMLElement).dispatchEvent(
            arrowRightEvent
        );
        expect(document.activeElement?.textContent).to.contain("value 3-test");

        (element.querySelectorAll(cellQueryString)[2] as HTMLElement).dispatchEvent(
            arrowRightEvent
        );
        expect(document.activeElement?.textContent).to.contain("value 3-test");

        (element.querySelectorAll(cellQueryString)[2] as HTMLElement).dispatchEvent(
            arrowLeftEvent
        );
        expect(document.activeElement?.textContent).to.contain("value 2-test");

        (element.querySelectorAll(cellQueryString)[1] as HTMLElement).dispatchEvent(
            arrowLeftEvent
        );
        expect(document.activeElement?.textContent).to.contain("value 1-test");

        (element.querySelectorAll(cellQueryString)[0] as HTMLElement).dispatchEvent(
            arrowLeftEvent
        );
        expect(document.activeElement?.textContent).to.contain("value 1-test");

        await disconnect();
    });

    it("should move focus to the start/end of the row with home/end keystrokes", async () => {
        const { element, connect, disconnect } = await setup();

        element.columnDefinitions = [
            { columnDataKey: "item1", isRowHeader: true },
            { columnDataKey: "item2" },
            { columnDataKey: "item3" },
        ] as ColumnDefinition[];
        (element as FASTDataGridRow).rowData = newDataRow("test");

        await connect();

        (element.querySelectorAll(cellQueryString)[0] as HTMLElement).focus();
        expect(document.activeElement?.textContent).to.contain("value 1-test");

        (element.querySelectorAll(cellQueryString)[0] as HTMLElement).dispatchEvent(
            endEvent
        );
        expect(document.activeElement?.textContent).to.contain("value 3-test");

        (element.querySelectorAll(cellQueryString)[0] as HTMLElement).dispatchEvent(
            homeEvent
        );
        expect(document.activeElement?.textContent).to.contain("value 1-test");

        await disconnect();
    });
});
