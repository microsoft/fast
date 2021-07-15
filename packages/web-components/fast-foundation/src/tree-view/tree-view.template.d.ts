import type { ViewTemplate } from "@microsoft/fast-element";
import type { TreeView } from "./tree-view";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
/**
 * The template for the {@link @microsoft/fast-foundation#TreeView} component.
 * @public
 */
export declare const treeViewTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<TreeView>;
