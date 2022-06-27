import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import { AutoUpdateMode } from "../../index.js";
import { Tooltip as FoundationTooltip, TooltipPosition } from "../tooltip.js";

type TooltipStoryArgs = Args & FoundationTooltip;
type TooltipStoryMeta = Meta<TooltipStoryArgs>;

const storyTemplate = html<TooltipStoryArgs>`
    <div id="viewport" style="height: 100%; width: 100%;">
        <fast-tooltip
            visible="${x => x.visible}"
            delay="${x => x.delay}"
            position="${x => x.position}"
            auto-update-mode="${x => x.autoUpdateMode}"
            vertical-viewport-lock="${x => x.verticalViewportLock}"
            horizontal-viewport-lock="${x => x.horizontalViewportLock}"
            anchor="anchor-default"
        >
            ${x => x.content}
        </fast-tooltip>
        <fast-button
            id="anchor-default"
            style="margin: 200px; height: 150px; width: 150px;"
        >
            anchor
        </fast-button>
    </div>
`;

export default {
    title: "Tooltip",
    args: {
        content: "Here's a tooltip",
    },
    argTypes: {
        visible: { control: { type: "boolean" } },
        delay: { control: { type: "number" } },
        position: {
            options: Object.values(TooltipPosition),
            control: { type: "select" },
        },
        autoUpdateMode: {
            options: Object.values(AutoUpdateMode),
            control: { type: "select" },
        },
        verticalViewportLock: { control: { type: "boolean" } },
        horizontalViewportLock: { control: { type: "boolean" } },
    },
} as TooltipStoryMeta;

export const Tooltip = (args: TooltipStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
