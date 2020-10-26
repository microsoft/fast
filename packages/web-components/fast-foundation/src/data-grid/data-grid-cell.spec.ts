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
});
