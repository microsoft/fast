import { html } from "@microsoft/fast-element";
import { AutoUpdateMode } from "../../index.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import { FASTTooltip, TooltipPosition } from "../tooltip.js";

const storyTemplate = html<StoryArgs<FASTTooltip>>`
    <fast-tooltip
        visible="${x => (x.visible ? "true" : undefined)}"
        track-pointer="${x => (x.trackPointer ? "true" : undefined)}"
        delay="${x => x.delay}"
        position="${x => x.position}"
        auto-update-mode="${x => x.autoUpdateMode}"
        vertical-viewport-lock="${x => x.verticalViewportLock}"
        horizontal-viewport-lock="${x => x.horizontalViewportLock}"
        anchor="anchor-default"
    >
        ${x => x.storyContent}
    </fast-tooltip>
`;

export default {
    title: "Tooltip",
    args: {
        storyContent: "Tooltip",
    },
    argTypes: {
        autoUpdateMode: { control: "select", options: Object.values(AutoUpdateMode) },
        delay: { control: "number" },
        horizontalViewportLock: { control: "boolean" },
        position: { control: "select", options: Object.values(TooltipPosition) },
        verticalViewportLock: { control: "boolean" },
        visible: { control: "boolean" },
        trackPointer: { control: "boolean" },
    },
    parameters: {
        docs: { inlineStories: false },
    },
} as Meta<FASTTooltip>;

export const Default: Story = renderComponent(
    html<StoryArgs<FASTTooltip>>`
        <div>
            <fast-button id="anchor-default" style="margin: 200px;">
                Hover or focus me
            </fast-button>
            ${storyTemplate}
        </div>
    `
).bind({});

export const PointerTracking: Story = renderComponent(
    html<StoryArgs<FASTTooltip>>`
        <div>
            <fast-button id="anchor-default" style="margin: 200px;">
                Hover or focus me
            </fast-button>
            ${storyTemplate}
        </div>
    `
).bind({});
PointerTracking.args = {
    trackPointer: true,
};
