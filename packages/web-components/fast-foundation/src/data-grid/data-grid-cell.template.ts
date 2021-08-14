import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { DataGridCell } from "./data-grid-cell";

/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGridCell} component using
 * the provided prefix.
 * @public
 */
export const dataGridCellTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<DataGridCell> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => {
    return html<DataGridCell>`
        <template
            tabindex="-1"
            role="${x => (x.cellType === "columnheader" ? "columnheader" : "gridcell")}"
            class="${x => (x.cellType === "columnheader" ? "column-header" : "")}"
        >
            <slot></slot>
        </template>
    `;
};
