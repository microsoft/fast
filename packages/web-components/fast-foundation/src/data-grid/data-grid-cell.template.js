import { html } from "@microsoft/fast-element";
/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGridCell} component using
 * the provided prefix.
 * @public
 */
export const dataGridCellTemplate = (context, definition) => {
    return html`
        <template
            tabindex="-1"
            role="${x => (x.cellType === "columnheader" ? "columnheader" : "gridcell")}"
            class="${x => (x.cellType === "columnheader" ? "column-header" : "")}"
        >
            <slot></slot>
        </template>
    `;
};
