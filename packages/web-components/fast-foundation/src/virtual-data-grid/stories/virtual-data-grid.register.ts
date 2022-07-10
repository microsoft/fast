import { css } from "@microsoft/fast-element";
import { FASTVirtualDataGrid } from "../virtual-data-grid.js";
import { dataGridTemplate } from "../virtual-data-grid.template.js";

const styles = css`
    :host {
        height: 100%;
        display: block;
        overflow-y: scroll;
    }
    .container {
        grid-template-columns: 1fr;
        display: grid;
    }
`;

FASTVirtualDataGrid.define({
    name: "fast-virtual-data-grid",
    template: dataGridTemplate({
        dataGridRow: "fast-data-grid-row",
    }),
    styles,
});
