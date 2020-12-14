import { expect } from "chai";
import { customElement, DOM, html } from "@microsoft/fast-element";
import { fixture } from "../fixture";
import { ColumnDefinition, createDataGridRowTemplate, DataGridRow } from "./index";
import { newDataRow } from "./data-grid.spec";
import { KeyCodes } from "@microsoft/fast-web-utilities";

@customElement({
    name: "fast-data-grid-row",
    template: createDataGridRowTemplate("fast"),
})
class FASTDataGridRow extends DataGridRow {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTDataGridRow>(
        "fast-data-grid-row"
    );
    return { element, connect, disconnect };
}

const arrowRightEvent = new KeyboardEvent("keydown", {
    key: "ArrowRight",
    keyCode: KeyCodes.arrowRight,
    bubbles: true,
} as KeyboardEventInit);

const arrowLeftEvent = new KeyboardEvent("keydown", {
    key: "ArrowLeft",
    keyCode: KeyCodes.arrowLeft,
    bubbles: true,
} as KeyboardEventInit);

const homeEvent = new KeyboardEvent("keydown", {
    key: "Home",
    keyCode: KeyCodes.home,
    bubbles: true,
} as KeyboardEventInit);

const endEvent = new KeyboardEvent("keydown", {
    key: "End",
    keyCode: KeyCodes.end,
    bubbles: true,
} as KeyboardEventInit);

const cellQueryString = '[role="cell"], [role="gridcell"], [role="columnheader"]';

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
        await DOM.nextUpdate();
        expect(element.querySelectorAll(cellQueryString).length).to.equal(1);

        element.columnDefinitions = [
            { columnDataKey: "item1" },
            { columnDataKey: "item2" },
        ];
        await DOM.nextUpdate();
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
            { columnDataKey: "item1" },
            { columnDataKey: "item2" },
            { columnDataKey: "item3" },
        ] as ColumnDefinition[];
        (element as DataGridRow).rowData = newDataRow("test");

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
            { columnDataKey: "item1" },
            { columnDataKey: "item2" },
            { columnDataKey: "item3" },
        ] as ColumnDefinition[];
        (element as DataGridRow).rowData = newDataRow("test");

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
