import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { SliderLabel as FoundationSlider } from "../slider-label.js";

type SliderLabelStoryArgs = Args & FoundationSlider;
type SliderLabelStoryMeta = Meta<SliderLabelStoryArgs>;

const componentTemplate = html<SliderLabelStoryArgs>`
    <fast-slider-label
        ?hide-mark="${x => x.hideMark}"
        position="${x => x.position}"
        ?disabled="${x => x.disabled}"
    >
        ${x => x.label}
    </fast-slider-label>
`;

export default {
    title: "Slider/Slider Label",
    argTypes: {
        hideMark: { control: { type: "boolean" } },
        content: { control: { type: "text" } },
        position: { control: { type: "number" } },
    },
} as SliderLabelStoryMeta;

export const SliderLabel = (args: SliderLabelStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
SliderLabel.args = {
    label: "Slider label",
};
