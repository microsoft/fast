import { html, ref, slotted } from "@microsoft/fast-element";
import { TreeView } from "./tree-view";

/**
 * The template for the {@link @microsoft/fast-foundation#TreeView} component.
 * @public
 */
export const TreeViewTemplate = html<TreeView>`
    <template
        role="tree"
        ${ref("treeView")}
        @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
        @focus="${(x, c) => x.handleFocus(c.event as FocusEvent)}"
        @focusout="${(x, c) => x.handleBlur(c.event as FocusEvent)}"
    >
        <slot ${slotted("slottedTreeItems")}></slot>
    </template>
`;
