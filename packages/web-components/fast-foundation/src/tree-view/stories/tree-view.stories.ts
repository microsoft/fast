import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { TreeView as FoundationTreeView } from "../tree-view.js";

type TreeViewStoryArgs = Args & FoundationTreeView;
type TreeViewStoryMeta = Meta<TreeViewStoryArgs>;

const storyTemplate = html<TreeViewStoryArgs>`
    <fast-tree-view :renderCollapsedNodes="${x => x.renderCollapsedNodes}">
        <fast-divider></fast-divider>
        <fast-tree-item>
            Root item 1
            <fast-divider></fast-divider>
            <fast-tree-item expanded>
                Flowers
                <fast-tree-item>Daisy</fast-tree-item>
                <fast-tree-item disabled>Sunflower</fast-tree-item>
                <fast-tree-item expanded>
                    Rose
                    <fast-divider role="presentation"></fast-divider>
                    <fast-tree-item>Pink</fast-tree-item>
                    <fast-tree-item>Red</fast-tree-item>
                    <fast-tree-item>White</fast-tree-item>
                </fast-tree-item>
            </fast-tree-item>
            <fast-tree-item>Nested item 2</fast-tree-item>
            <fast-tree-item>Nested item 3</fast-tree-item>
        </fast-tree-item>
        <fast-tree-item>
            Root item 2
            <fast-tree-item>
                Flowers
                <fast-divider></fast-divider>
                <fast-tree-item disabled>Daisy</fast-tree-item>
                <fast-tree-item>Sunflower</fast-tree-item>
                <fast-tree-item>Rose</fast-tree-item>
            </fast-tree-item>
            <fast-tree-item>Nested item 2</fast-tree-item>
            <fast-tree-item>Nested item 3</fast-tree-item>
        </fast-tree-item>
        <fast-tree-item>
            Root item 3
        </fast-tree-item>
    </fast-tree-view>
`;

export default {
    title: "Tree view",
    argTypes: {
        args: {
            content: "You got a fast tree item",
            expanded: false,
            disabled: false,
            selected: false,
            renderCollapsedNodes: true,
        },
        renderCollapsedNodes: {
            control: { type: "boolean" },
        },
    },
} as TreeViewStoryMeta;

export const TreeView = (args: TreeViewStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
