import { html, repeat } from "@microsoft/fast-element";
import { storyTemplate as tabPanelStoryTemplate } from "../../tab-panel/stories/tab-panel.stories.js";
import type { FASTTab } from "../../tab/tab.js";
import { storyTemplate as tabStoryTemplate } from "../../tab/stories/tab.stories.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import { TabsOrientation } from "../tabs.options.js";
import type { FASTTabs } from "../tabs.js";

const storyTemplate = html<StoryArgs<FASTTabs>>`
    <fast-tabs activeid="${x => x.activeid}" orientation="${x => x.orientation}">
        ${x => x.storyContent}
    </fast-tabs>
`;

const tabWithIconsStoryTemplate = html<StoryArgs<FASTTab>>`
    <fast-tab ?disabled="${x => x.disabled}">
        <svg slot="start" width="20" height="20"><use href="#test-icon" /></svg>
        ${x => x.storyContent}
        <svg slot="end" width="20" height="20"><use href="#test-icon-2" /></svg>
    </fast-tab>
`;

export default {
    title: "Tabs",
    args: {
        orientation: TabsOrientation.horizontal,
        storyContent: html<StoryArgs<FASTTabs>>`
            ${repeat(x => x.storyItems.tabs, tabStoryTemplate)}
            ${repeat(x => x.storyItems.tabPanels, tabPanelStoryTemplate)}
        `,
    },
    argTypes: {
        activeid: { control: "text" },
        orientation: { control: "radio", options: Object.values(TabsOrientation) },
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

export const TabsWithSlottedStartEnd: Story<FASTTabs> = Tabs.bind({});
TabsWithSlottedStartEnd.args = {
    storyContent: html<StoryArgs<FASTTabs>>`
        <svg slot="start" width="20" height="20"><use href="#test-icon" /></svg>
        ${repeat(x => x.storyItems.tabs, tabWithIconsStoryTemplate)}
        ${repeat(x => x.storyItems.tabPanels, tabPanelStoryTemplate)}
        <svg slot="end" width="20" height="20"><use href="#test-icon-2" /></svg>
    `,
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

const tabOrderStoryTemplate = html<StoryArgs<FASTTabs>>`
    <fast-tabs :customTabOrder=${["t2", "t3", "t1"]}>
        <fast-tab id="t1" aria-controls="tp1">Tab 1</fast-tab>
        <fast-tab id="t2" aria-controls="tp2">Tab 2</fast-tab>
        <fast-tab id="t3" aria-controls="tp3">Tab 3</fast-tab>
        <fast-tab-panel id="tp1" aria-labelledby="t1">Tab 1</fast-tab-panel>
        <fast-tab-panel id="tp2" aria-labelledby="t2">Tab 2</fast-tab-panel>
        <fast-tab-panel id="tp3" aria-labelledby="t3">Tab 3</fast-tab-panel>
    </fast-tabs>
`;

export const WithTabOrder: Story<FASTTabs> = renderComponent(tabOrderStoryTemplate).bind(
    {}
);
