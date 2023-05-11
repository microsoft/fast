import { html, repeat } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTTreeItem } from "../tree-item.js";

const storyTemplate = html<StoryArgs<FASTTreeItem>>`
    <fast-tree-item
        ?expanded="${x => x.expanded}"
        ?selected="${x => x.selected}"
        ?disabled="${x => x.disabled}"
        :nested="${x => x.nested}"
    >
        ${x => x.storyContent}
    </fast-tree-item>
`;

export default {
    title: "Tree View/Tree Item",
    args: {
        disabled: false,
        expanded: false,
        nested: false,
        selected: false,
    },
    argTypes: {
        expanded: { control: "boolean" },
        nested: { control: "boolean" },
        selected: { control: "boolean" },
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
    },
} as Meta<FASTTreeItem>;

export const TreeItem: Story<FASTTreeItem> = renderComponent(storyTemplate).bind({});
TreeItem.args = {
    storyContent: "Tree Item",
};

export const TreeItemWithSlottedStartEnd: Story<FASTTreeItem> = TreeItem.bind({});
TreeItemWithSlottedStartEnd.args = {
    storyContent: html`
        <svg slot="start" width="20" height="20"><use href="#test-icon" /></svg>
        Tree Item
        <svg slot="end" width="20" height="20"><use href="#test-icon-2" /></svg>
    `,
};

export const TreeItemWithNestedItems: Story<FASTTreeItem> = TreeItem.bind({});
TreeItemWithNestedItems.args = {
    storyContent: html`
        Tree Item ${repeat(x => x.storyItems, storyTemplate)}
    `,
    storyItems: [
        { storyContent: "Nested Tree Item" },
        { storyContent: "Nested Tree Item" },
    ],
};
