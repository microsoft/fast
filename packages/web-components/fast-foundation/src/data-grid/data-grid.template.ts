import { html, ref } from "@microsoft/fast-element";
import { DataGrid } from "./data-grid";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGrid} component.
 * @public
 */
export const DataGridTemplate = html<DataGrid>`
    <template role="grid">
    <div part="header" class="header" ${ref("headerElement")}>
    </div>
    <div part="rows" class="rows" ${ref("gridElement")}>
    </div>
    </template>
`;
