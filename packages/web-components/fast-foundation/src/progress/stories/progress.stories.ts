import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTProgress } from "../progress.js";

const storyTemplate = html<StoryArgs<FASTProgress>>`
    <fast-progress max="${x => x.max}" min="${x => x.min}" value="${x => x.value}">
        ${x => x.storyContent}
    </fast-progress>
`;

export default {
    title: "Progress",
    args: {
        indeterminate: false,
        value: 75,
    },
    argTypes: {
        indeterminate: { control: "boolean" },
        min: { control: "number" },
        max: { control: "number" },
        storyContent: { table: { disable: true } },
        value: { control: "number", if: { arg: "indeterminate", truthy: false } },
    },
} as Meta<FASTProgress>;

export const Progress: Story<FASTProgress> = renderComponent(storyTemplate).bind({});
