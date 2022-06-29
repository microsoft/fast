import { css } from "@microsoft/fast-element";
import { FASTDataGrid } from "../data-grid.js";
import { dataGridTemplate } from "../data-grid.template.js";

const styles = css`
    :host {
        display: block;
    }
`;

FASTDataGrid.define({
    name: "fast-data-grid",
    template: dataGridTemplate({
        dataGridRow: "fast-data-grid-row",
    }),
    styles,
});
