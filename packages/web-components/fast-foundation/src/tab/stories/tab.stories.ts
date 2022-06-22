import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Tab as FoundationTab } from "../tab.js";

type TabStoryArgs = Args & FoundationTab;
type TabStoryMeta = Meta<TabStoryArgs>;

const componentTemplate = html<TabStoryArgs>`
    <fast-tab ?disabled="${x => x.disabled}">${x => x.content}</fast-tab>
`;

export default {
    title: "Tabs/Tab",
    argTypes: {
        disabled: { control: { type: "boolean" } },
    },
} as TabStoryMeta;

export const Tab = (args: TabStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

Tab.args = {
    content: "Tab",
};
