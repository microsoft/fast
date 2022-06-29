import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTTreeItem } from "../tree-item.js";

type TreeItemStoryArgs = Args & FASTTreeItem;
type TreeItemStoryMeta = Meta<TreeItemStoryArgs>;

const storyTemplate = html<TreeItemStoryArgs>`
    <fast-tree-item
        :expanded="${x => x.expanded}"
        :selected="${x => x.selected}"
        :disabled="${x => x.disabled}"
    >
        ${x => x.content}
    </fast-tree-item>
`;

export default {
    title: "Tree view/Tree Item",
    args: {
        content: "Tree Item",
        expanded: false,
        disabled: false,
        selected: false,
    },
    argTypes: {
        expanded: { control: { type: "boolean" } },
        selected: { control: { type: "boolean" } },
        disabled: { control: { type: "boolean" } },
    },
} as TreeItemStoryMeta;

export const TreeItem = (args: TreeItemStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
