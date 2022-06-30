import { css } from "@microsoft/fast-element";
import { FASTDataGridCell } from "../data-grid-cell.js";
import { dataGridCellTemplate } from "../data-grid-cell.template.js";

const styles = css`
    :host {
        color: var(--neutral-foreground-rest);
        box-sizing: border-box;
        padding: calc(var(--design-unit) * 1px) calc(var(--design-unit) * 3px);
        font-size: var(--type-ramp-base-font-size);
        border: transparent calc(var(--stroke-width) * 1px) solid;
        overflow: hidden;
        outline: none;
        white-space: nowrap;
        border-radius: calc(var(--control-corner-radius) * 1px);
    }

    :host(.column-header) {
        font-weight: 600;
    }

    :host(:focus-visible) {
        border-color: var(--focus-stroke-outer);
    }
`;

FASTDataGridCell.define({
    name: "fast-data-grid-cell",
    template: dataGridCellTemplate(),
    styles,
});
