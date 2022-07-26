import { css } from "@microsoft/fast-element";
import { FASTDataGridRow } from "../data-grid-row.js";
import { dataGridRowTemplate } from "../data-grid-row.template.js";

const styles = css`
    :host {
        display: grid;
        padding: 1px 0;
        box-sizing: border-box;
        width: 100%;
        border-bottom: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
    }
    :host(.sticky-header) {
        background: var(--neutral-fill-rest);
        position: sticky;
        top: 0;
    }
`;

FASTDataGridRow.define({
    name: "fast-data-grid-row",
    template: dataGridRowTemplate({
        dataGridCell: "fast-data-grid-cell",
    }),
    styles,
});
