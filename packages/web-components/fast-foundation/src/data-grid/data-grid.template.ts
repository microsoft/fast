import { html, slotted, when } from "@microsoft/fast-element";
import { DataGrid } from "./data-grid";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGrid} component.
 * @public
 */
export const DataGridTemplate = html<DataGrid>`
    <template role="grid" tabindex="0">
        <slot
            name="headerSlot"
            part="headerSlot"
            ${slotted("slottedHeaderElements")}
        ></slot>
        ${when(
            x => x.generateHeader,
            html<DataGrid>`
                <fast-data-grid-header
                    gridTemplateColumns="${x => x.gridTemplateColumns}"
                    :columnsData="${x => x.columnsData}"
                ></fast-data-grid-header>
            `
        )}
        <slot part="rowsSlot" ${slotted("slottedRowElements")}></slot>
    </template>
`;
