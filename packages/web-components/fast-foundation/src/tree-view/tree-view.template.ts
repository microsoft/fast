import { html, ref, slotted } from "@microsoft/fast-element";
import { TreeView } from "./tree-view";

export const TreeViewTemplate = html<TreeView>`
    <template
        role="tree"
        ${ref("treeView")}
        @keydown=${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}
        @focusout=${(x, c) => x.handleFocusOut(c.event as FocusEvent)}
    >
        <slot ${slotted("slottedTreeItems")}></slot>
    </template>
`;
