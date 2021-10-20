import { html, ref, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import type { TreeView } from "./tree-view";

/**
 * The template for the {@link @microsoft/fast-foundation#TreeView} component.
 * @public
 */
export const treeViewTemplate: FoundationElementTemplate<ViewTemplate<TreeView>> = (
    context,
    definition
) => html`
    <template
        role="tree"
        ${ref("treeView")}
        @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.handleBlur(c.event as FocusEvent)}"
        @focusin="${(x, c) => x.handleFocus(c.event as FocusEvent)}"
        @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
    >
        <slot ${slotted("slottedTreeItems")}></slot>
    </template>
`;
