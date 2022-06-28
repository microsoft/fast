import { html, repeat } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { Args, Meta } from "@storybook/html";
import type { Tabs as FoundationTabs } from "../tabs.js";

type TabsStoryArgs = Args & FoundationTabs;
type TabsStoryMeta = Meta<TabsStoryArgs>;

const componentTemplate = html<TabsStoryArgs>`
    <fast-tabs
        activeId="${x => x.activeId}"
        orientation="${x => x.orientation}"
        ?hide-active-indicator="${x => x.hideActiveIndicator}"
    >
        ${repeat(
            x => x.items,
            html`
                <fast-tab>${x => x.tab}</fast-tab>
                <fast-tab-panel>
                    ${x => x.panel}
                </fast-tab-panel>
            `
        )}
    </fast-tabs>
`;

export default {
    title: "Tabs",
    argTypes: {
        disabled: { control: { type: "boolean" } },
        orientation: { options: Object.values(Orientation), control: { type: "radio" } },
    },
} as TabsStoryMeta;

export const Tabs = (args: TabsStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

Tabs.args = {
    items: [
        {
            tab: "Tab one",
            panel: "Tab one content",
        },
        {
            tab: "Tab two",
            panel: "Tab two content",
        },
        {
            tab: "Tab three",
            panel: "Tab three content",
        },
    ],
};
