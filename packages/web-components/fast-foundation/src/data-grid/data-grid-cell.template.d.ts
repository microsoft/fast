import type { ViewTemplate } from "@microsoft/fast-element";
import type { DataGridCell } from "./data-grid-cell";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGridCell} component using
 * the provided prefix.
 * @public
 */
export declare const dataGridCellTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<DataGridCell>;
