import { css } from "@microsoft/fast-element";
import { FASTVirtualDataGrid } from "../virtual-data-grid.js";
import { virtualDataGridTemplate } from "../virtual-data-grid.template.js";

const styles = css`
    :host {
        height: 100%;
        display: block;
        overflow-y: scroll;
    }
    .container {
        position: relative;
    }
`;

FASTVirtualDataGrid.define({
    name: "fast-virtual-data-grid",
    styles,
    template: virtualDataGridTemplate({
        dataGridRow: "fast-data-grid-row",
    }),
});
