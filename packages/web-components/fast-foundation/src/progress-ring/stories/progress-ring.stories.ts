import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FoundationElement } from "../../index.js";
import type { ProgressRing as FoundationProgressRing } from "../progress-ring.js";

type ProgressRingStoryArgs = Args & Omit<FoundationProgressRing, keyof FoundationElement>;
type ProgressRingStoryMeta = Meta<ProgressRingStoryArgs>;

const componentTemplate = html<ProgressRingStoryArgs>`
    <fast-progress-ring
        ?paused="${x => x.paused}"
        max="${x => x.max}"
        min="${x => x.min}"
        value="${x => x.value}"
    ></fast-progress-ring>
`;

export default {
    title: "Progress/Progress Ring",
    args: {
        min: 0,
        max: 100,
        value: 75,
    },
    argTypes: {
        paused: { control: { type: "boolean" } },
    },
} as ProgressRingStoryMeta;

export const ProgressRing = (args: ProgressRingStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const ProgressRingIndeterminate = ProgressRing.bind({});
ProgressRingIndeterminate.args = {
    value: null,
};

export const ProgressRingPaused = ProgressRing.bind({});
ProgressRingPaused.args = {
    paused: true,
};
