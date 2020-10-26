import { expect } from "chai";
import { customElement, DOM, html } from "@microsoft/fast-element";
import { fixture } from "../fixture";
import {
    DataGrid,
    DataGridTemplate as Gridtemplate,
    DataGridRow,
    DataGridRowTemplate as rowTemplate,
    DataGridCell,
    DataGridCellTemplate as cellTemplate,
} from "./index";

@customElement({
    name: "fast-data-grid",
    template: Gridtemplate,
})
class FASTDataGrid extends DataGrid {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTDataGrid>(
        "fast-data-grid"
    );
    return { element, connect, disconnect };
}

describe("Data grid", () => {
    it("should set role to 'grid'", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("role")).to.equal("grid");

        await disconnect();
    });
});
