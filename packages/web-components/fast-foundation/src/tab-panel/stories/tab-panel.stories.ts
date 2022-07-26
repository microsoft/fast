import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTTabPanel } from "../tab-panel.js";

type TabPanelStoryArgs = Args & FASTTabPanel;
type TabPanelStoryMeta = Meta<TabPanelStoryArgs>;

const componentTemplate = html<TabPanelStoryArgs>`
    <fast-tab-panel>
        ${x => x.content}
    </fast-tab-panel>
`;

export default {
    title: "Tabs/Tab Panel",
    argTypes: {
        disabled: { control: { type: "boolean" } },
    },
} as TabPanelStoryMeta;

export const TabPanel = (args: TabPanelStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

TabPanel.args = {
    content: "Tab Panel",
};
