import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTTreeView } from "../tree-view.js";

const storyTemplate = html<StoryArgs<FASTTreeView>>`
    <fast-tree-view render-collapsed-nodes="${x => x.renderCollapsedNodes}">
        ${x => x.storyContent}
    </fast-tree-view>
`;

export default {
    title: "Tree view",
    args: {
        renderCollapsedNodes: true,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTTreeView>;

export const TreeView: Story<FASTTreeView> = renderComponent(storyTemplate).bind({});
TreeView.args = {
    storyContent: html`
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
    `,
};
