import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTTab } from "../tab.js";

export const storyTemplate = html<StoryArgs<FASTTab>>`
    <fast-tab ?disabled="${x => x.disabled}">
        ${x => x.storyContent}
    </fast-tab>
`;

export default {
    title: "Tabs/Tab",
    excludeStories: ["storyTemplate"],
    args: {
        disabled: false,
        storyContent: "Tab",
    },
    argTypes: {
        disabled: { control: "boolean" },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTTab>;

export const Tab: Story<FASTTab> = renderComponent(storyTemplate).bind({});

export const TabWithIcons: Story<FASTTab> = Tab.bind({});
TabWithIcons.args = {
    storyContent: html`
        <svg width="20" height="20" slot="start"><use href="#test-icon" /></svg>
        Tab
        <svg width="20" height="20" slot="end"><use href="#test-icon-2" /></svg>
    `,
};
