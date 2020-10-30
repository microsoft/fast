import { expect } from "chai";
import { customElement, DOM, html } from "@microsoft/fast-element";
import { fixture } from "../fixture";
import { DataGridCell, DataGridCellTemplate as cellTemplate } from "./index";

@customElement({
    name: "fast-data-grid-cell",
    template: cellTemplate,
})
class FASTDataGridCell extends DataGridCell {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTDataGridCell>(
        "fast-data-grid-cell"
    );
    return { element, connect, disconnect };
}

describe("Data grid cell", () => {
    it("should set role to 'gridcell' by default", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("role")).to.equal("gridcell");

        await disconnect();
    });

    it("should set role to 'columnheader' when cell-type is 'header'", async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute("cell-type", "header");
        await connect();

        expect(element.getAttribute("role")).to.equal("columnheader");

        await disconnect();
    });

    it("should apply 'column-header' css class when cell-type is 'header'", async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute("cell-type", "header");
        await connect();

        expect(element.className).to.contain("columnheader");

        await disconnect();
    });

    it("should have a tabIndex of -1 by default", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("tabindex")).to.equal(-1);

        await disconnect();
    });
});
