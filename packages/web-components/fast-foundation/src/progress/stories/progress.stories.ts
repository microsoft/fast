import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTProgress } from "../progress.js";

const storyTemplate = html<StoryArgs<FASTProgress>>`
    <fast-progress
        ?paused="${x => x.paused}"
        max="${x => x.max}"
        min="${x => x.min}"
        value="${x => x.value}"
    >
        ${x => x.storyContent}
    </fast-progress>
`;

export default {
    title: "Progress",
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
} as Meta<FASTProgress>;

export const Progress: Story<FASTProgress> = renderComponent(storyTemplate).bind({});
