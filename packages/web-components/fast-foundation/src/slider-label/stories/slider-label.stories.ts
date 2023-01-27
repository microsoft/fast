import { html } from "@microsoft/fast-element";
import { Meta, renderComponent, Story, StoryArgs } from "../../__test__/helpers.js";
import { SliderOrientation } from "../../slider/slider.options.js";
import type { FASTSliderLabel } from "../slider-label.js";

export const storyTemplate = html<StoryArgs<FASTSliderLabel>>`
    <fast-slider-label
        ?disabled="${x => x.disabled}"
        ?hide-mark="${x => x.hideMark}"
        :sliderOrientation="${x => x.sliderOrientation}"
        position="${x => x.position}"
    >
        ${x => x.storyContent}
    </fast-slider-label>
`;

export default {
    title: "Slider Label",
    excludeStories: ["storyTemplate"],
    args: {
        disabled: false,
        hideMark: false,
        storyContent: "Slider label",
    },
    argTypes: {
        disabled: { control: "boolean" },
        hideMark: { control: "boolean" },
        position: { control: "number" },
        sliderOrientation: {
            control: "radio",
            options: Object.values(SliderOrientation),
        },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTSliderLabel>;

export const SliderLabel: Story<FASTSliderLabel> = renderComponent(storyTemplate).bind(
    {}
);
