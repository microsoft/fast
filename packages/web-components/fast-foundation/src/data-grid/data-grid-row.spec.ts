import { expect } from "chai";
import { customElement, DOM, html } from "@microsoft/fast-element";
import { fixture } from "../fixture";
import {
    DataGridRow,
    DataGridRowTemplate as rowTemplate,
    DataGridCell,
    DataGridCellTemplate as cellTemplate,
} from "./index";

@customElement({
    name: "fast-data-grid-row",
    template: rowTemplate,
})
class FASTDataGridRow extends DataGridRow {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTDataGridRow>(
        "fast-data-grid-row"
    );
    return { element, connect, disconnect };
}

describe("Data grid row", () => {
    it("should set role to 'row'", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("role")).to.equal("row");

        await disconnect();
    });
});
