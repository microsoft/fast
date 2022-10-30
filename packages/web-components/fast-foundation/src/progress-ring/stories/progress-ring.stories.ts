import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTProgressRing } from "../progress-ring.js";

const storyTemplate = html<StoryArgs<FASTProgressRing>>`
    <fast-progress-ring
        ?paused="${x => x.paused}"
        max="${x => x.max}"
        min="${x => x.min}"
        value="${x => x.value}"
    >
        ${x => x.storyContent}
    </fast-progress-ring>
`;

export default {
    title: "Progress/Progress Ring",
    args: {
        paused: false,
        indeterminate: false,
        value: 75,
    },
    argTypes: {
        indeterminate: { control: "boolean" },
        min: { control: "number" },
        max: { control: "number" },
        paused: { control: "boolean" },
        storyContent: { table: { disable: true } },
        value: { control: "number", if: { arg: "indeterminate", truthy: false } },
    },
} as Meta<FASTProgressRing>;

export const ProgressRing: Story<FASTProgressRing> = renderComponent(storyTemplate).bind(
    {}
);
