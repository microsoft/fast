import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTButton } from "src/index.js";
import { FASTTooltip, TooltipPosition } from "../tooltip.js";

type TooltipStoryArgs = Args & FASTTooltip & FASTButton;
type TooltipStoryMeta = Meta<TooltipStoryArgs>;

const storyTemplate = html<TooltipStoryArgs>`
    <div>
        <fast-tooltip
            visible="${x => x.visible}"
            delay="${x => x.delay}"
            position="${x => x.position}"
            autoupdate="${x => x.autoUpdate}"
            anchor="anchor-default"
        >
            ${x => x.content}
        </fast-tooltip>
        <fast-button id="anchor-default" style="margin: 200px;">
            Anchor
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
            control: { type: "boolean" },
        },
    },
} as TooltipStoryMeta;

export const Tooltip = (args: TooltipStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
