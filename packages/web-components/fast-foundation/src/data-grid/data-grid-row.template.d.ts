import type { ViewTemplate } from "@microsoft/fast-element";
import type { DataGridRow } from "./data-grid-row";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGridRow} component using
 * the provided prefix.
 *
 * @public
 */
export declare const dataGridRowTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<DataGridRow>;
