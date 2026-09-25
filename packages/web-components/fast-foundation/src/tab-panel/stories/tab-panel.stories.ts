import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTTabPanel } from "../tab-panel.js";

export const storyTemplate = html<StoryArgs<FASTTabPanel>>`
    <fast-tab-panel>${x => x.storyContent}</fast-tab-panel>
`;

export default {
    title: "Tabs/Tab Panel",
    excludeStories: ["storyTemplate"],
    args: {
        storyContent: "Tab panel",
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTTabPanel>;

export const TabPanel: Story<FASTTabPanel> = renderComponent(storyTemplate).bind({});
