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

// Utility functions to generate test data
export function newDataSet(rowCount: number): object[] {
    const newRows: object[] = [];
    for (let i = 0; i <= rowCount; i++) {
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

    it("should have a tabIndex of 0 by default", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });
});
