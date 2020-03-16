import { html } from "@microsoft/fast-element";
import { TreeView } from "./tree-view";

export const TreeViewTemplate = html<TreeView>`
  <div class="body">
    <slot></slot>
  </div>
`;
