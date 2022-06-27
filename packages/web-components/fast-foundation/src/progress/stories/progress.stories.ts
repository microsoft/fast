import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FoundationElement } from "../../index.js";
import type { BaseProgress as FoundationProgress } from "../base-progress.js";

type ProgressStoryArgs = Args & Omit<FoundationProgress, keyof FoundationElement>;
type ProgressStoryMeta = Meta<ProgressStoryArgs>;

const componentTemplate = html<ProgressStoryArgs>`
    <fast-progress
        ?paused="${x => x.paused}"
        max="${x => x.max}"
        min="${x => x.min}"
        value="${x => x.value}"
    ></fast-progress>
`;

export default {
    title: "Progress",
    args: {
        min: 0,
        max: 100,
        value: 75,
    },
    argTypes: {
        paused: { control: { type: "boolean" } },
    },
} as ProgressStoryMeta;

export const Progress = (args: ProgressStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const ProgressIndeterminate = Progress.bind({});
ProgressIndeterminate.args = {
    value: null,
};

export const ProgressPaused = Progress.bind({});
ProgressPaused.args = {
    paused: true,
};
