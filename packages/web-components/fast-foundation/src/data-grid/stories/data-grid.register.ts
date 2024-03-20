import { css } from "@microsoft/fast-element";
import { FASTDataGrid } from "../data-grid.js";
import { dataGridTemplate } from "../data-grid.template.js";
import { registerComplexCell } from "./examples/complex-cell.js";

const styles = css`
    :host {
        display: grid;
        grid-auto-flow: row;
        grid-template-columns: repeat(
            ${x => x.columnDefinitions?.length ?? 1},
            minmax(0, 1fr)
        );
    }

    :host([selection-mode="multi-row"]) {
        user-select: none;
    }
`;

FASTDataGrid.define({
    name: "fast-data-grid",
    template: dataGridTemplate({
        dataGridRow: "fast-data-grid-row",
    }),
    styles,
});

registerComplexCell();
