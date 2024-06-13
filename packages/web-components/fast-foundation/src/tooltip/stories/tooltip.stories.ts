import { html, repeat } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTTooltip } from "../tooltip.js";
import { TooltipPlacement } from "../tooltip.options.js";

const componentTemplate = html<StoryArgs<FASTTooltip>>`
    <fast-tooltip
        show="${x => x.show}"
        placement="${x => x.placement}"
        anchor="${x => x.anchor}"
    >
        ${x => x.storyContent}
    </fast-tooltip>
`;

export default {
    title: "Tooltip",
    args: {
        anchor: "anchor-default",
        storyContent: "Tooltip",
    },
    argTypes: {
        anchor: { control: "text" },
        placement: {
            control: "select",
            options: Object.values(TooltipPlacement),
        },
        show: { control: "select", options: [undefined, true, false] },
    },
} as Meta<FASTTooltip>;

export const Tooltip: Story<FASTTooltip> = renderComponent(html<StoryArgs<FASTTooltip>>`
    <div>
        <fast-button id="${x => x.anchor}">
            ${x => x.buttonContent ?? "Hover or focus me"}
        </fast-button>
        ${componentTemplate}
    </div>
`).bind({});

export const TooltipPlacements: Story<FASTTooltip> = renderComponent(
    html<StoryArgs<FASTTooltip>>`
        <fast-card
            id="${x => x.anchor}"
            style="height: 50%; left: 50%; position: absolute; top: 50%; transform: translate(-50%, -50%); width: 50%;"
        >
            ${repeat(x => x.storyItems, componentTemplate)}
        </fast-card>
    `
).bind({});
TooltipPlacements.args = {
    anchor: "placement-container",
    storyItems: Object.values(TooltipPlacement).map(placement => ({
        anchor: "placement-container",
        placement,
        show: true,
        storyContent: placement,
    })),
};
TooltipPlacements.parameters = { controls: { include: [] } };
