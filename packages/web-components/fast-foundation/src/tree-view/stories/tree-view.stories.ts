import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTTreeView } from "../tree-view.js";

const storyTemplate = html<StoryArgs<FASTTreeView>>`
    <fast-tree-view>${x => x.storyContent}</fast-tree-view>
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

// Includes slotted dividers to test tab functionality, they should display but not be part of tab order.
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
        <fast-tree-item expanded>
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
        <fast-tree-item>Root item 3</fast-tree-item>
    `,
};

export const TreeViewFlat: Story<FASTTreeView> = renderComponent(storyTemplate).bind({});
TreeViewFlat.args = {
    storyContent: html`
        <fast-tree-item>
            <svg slot="start" width="20" height="20"><use href="#test-icon" /></svg>
            Tree item 1
            <svg slot="end" width="20" height="20"><use href="#test-icon-2" /></svg>
        </fast-tree-item>
        <fast-tree-item>
            <svg slot="start" width="20" height="20"><use href="#test-icon" /></svg>
            Tree item 2
            <svg slot="end" width="20" height="20"><use href="#test-icon-2" /></svg>
        </fast-tree-item>
        <fast-tree-item>
            <svg slot="start" width="20" height="20"><use href="#test-icon" /></svg>
            Tree item 3
            <svg slot="end" width="20" height="20"><use href="#test-icon-2" /></svg>
        </fast-tree-item>
    `,
};
