import { html, ref } from "@microsoft/fast-element";
import { TreeView } from "./tree-view";

export const TreeViewTemplate = html<TreeView>`
    <template
        role="tree"
        tabindex=${x => (x.focusable ? 0 : 1)}
        @focus=${x => x.handleFocus}
        @blur=${x => x.handleBlur}
        @keydown=${x => x.handleKeyDown}
        ${ref("treeView")}
    >
        <slot></slot>
    </template>
`;
