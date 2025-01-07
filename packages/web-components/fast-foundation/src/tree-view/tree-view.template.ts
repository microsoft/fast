import { html, ref, slotted } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { TreeView } from "./tree-view.js";

/**
 * The template for the {@link @ni/fast-foundation#TreeView} component.
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
        @focusin="${(x, c) => x.handleFocus(c.event as FocusEvent)}"
        @focusout="${(x, c) => x.handleBlur(c.event as FocusEvent)}"
        @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
        @selected-change="${(x, c) => x.handleSelectedChange(c.event)}"
    >
        <slot ${slotted("slottedTreeItems")}></slot>
    </template>
`;
