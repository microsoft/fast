import { children, elements, html, ref, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { TreeView } from "./tree-view";

/**
 * The template for the {@link @microsoft/fast-foundation#TreeView} component.
 * @public
 */
export const treeViewTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<TreeView> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template
        role="tree"
        ${ref("treeView")}
        @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
    >
        <slot ${slotted("slottedTreeItems")}></slot>
    </template>
`;
