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
        value: 75,
    },
    argTypes: {
        min: { control: "number" },
        max: { control: "number" },
        paused: { control: "boolean" },
        storyContent: { table: { disable: true } },
        value: { control: "number" },
    },
} as Meta<FASTProgress>;

export const Progress: Story<FASTProgress> = renderComponent(storyTemplate).bind({});

export const ProgressIndeterminate: Story<FASTProgress> = Progress.bind({});
ProgressIndeterminate.args = {
    value: null,
};
