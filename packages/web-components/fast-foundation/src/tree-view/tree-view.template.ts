import { html, ref, slotted } from "@microsoft/fast-element";
import { TreeView } from "./tree-view";

export const TreeViewTemplate = html<TreeView>`
    <template
        role="tree"
        tabindex=${x => (x.focusable ? 0 : -1)}
        ${ref("treeView")}
        @keydown=${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}
        @focus=${(x, c) => x.handleFocus(c.event as FocusEvent)}
        @blur=${(x, c) => x.handleBlur(c.event as FocusEvent)}
    >
        <slot ${slotted("slottedTreeItems")}></slot>
    </template>
`;
