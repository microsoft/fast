import { html, repeat } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { storyTemplate as tabPanelStoryTemplate } from "../../tab-panel/stories/tab-panel.stories.js";
import { storyTemplate as tabStoryTemplate } from "../../tab/stories/tab.stories.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTTabs } from "../tabs.js";

const storyTemplate = html<StoryArgs<FASTTabs>>`
    <fast-tabs
        ?hide-active-indicator="${x => x.hideActiveIndicator}"
        activeid="${x => x.activeid}"
        orientation="${x => x.orientation}"
    >
        ${x => x.storyContent}
    </fast-tabs>
`;

export default {
    title: "Tabs",
    args: {
        hideActiveIndicator: false,
        storyContent: html<StoryArgs<FASTTabs>>`
            ${repeat(x => x.storyItems.tabs, tabStoryTemplate)}
            ${repeat(x => x.storyItems.tabPanels, tabPanelStoryTemplate)}
        `,
    },
    argTypes: {
        activeid: { control: "text" },
        hideActiveIndicator: { control: "boolean" },
        orientation: { control: "radio", options: Object.values(Orientation) },
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
    },
} as Meta<FASTTabs>;

export const Tabs: Story<FASTTabs> = renderComponent(storyTemplate).bind({});
Tabs.args = {
    storyItems: {
        tabs: [
            { storyContent: "Tab one" },
            { storyContent: "Tab two" },
            { storyContent: "Tab three" },
        ],
        tabPanels: [
            { storyContent: "Tab panel one" },
            { storyContent: "Tab panel two" },
            { storyContent: "Tab panel three" },
        ],
    },
};

export const DisabledTabs: Story<FASTTabs> = Tabs.bind({});
DisabledTabs.args = {
    storyItems: {
        tabs: [
            { storyContent: "Tab one", disabled: true },
            { storyContent: "Tab two" },
            { storyContent: "Tab three" },
            { storyContent: "Tab four" },
            { storyContent: "Tab five", disabled: true },
        ],
        tabPanels: [
            { storyContent: "Tab panel one" },
            { storyContent: "Tab panel two" },
            { storyContent: "Tab panel three" },
            { storyContent: "Tab panel four" },
            { storyContent: "Tab panel five" },
        ],
    },
};
