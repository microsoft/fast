import { html } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { Args, Meta } from "@storybook/html";
import type { FASTSlider } from "../slider.js";

type SliderStoryArgs = Args & FASTSlider;
type SliderStoryMeta = Meta<SliderStoryArgs>;

const componentTemplate = html<SliderStoryArgs>`
    <fast-slider
        orientation="${x => x.orientation}"
        min="${x => x.min}"
        max="${x => x.max}"
        step="${x => x.step}"
        value="${x => x.value}"
    >
        ${x => x.content}
    </fast-slider>
`;

export default {
    title: "Slider",
    argTypes: {
        content: { table: { disable: true } },
        orientation: { options: Object.values(Orientation), control: { type: "radio" } },
        min: { control: { type: "number" } },
        max: { control: { type: "number" } },
        step: { control: { type: "number" } },
        value: { control: { type: "text" } },
    },
} as SliderStoryMeta;

export const Slider = (args: SliderStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const SliderWithLabels = Slider.bind({});
SliderWithLabels.args = {
    min: 0,
    max: 100,
    step: 10,
    content: html`
        <fast-slider-label position="0">
            0&#8451;
        </fast-slider-label>
        <fast-slider-label position="10">
            10&#8451;
        </fast-slider-label>
        <fast-slider-label position="90">
            90&#8451;
        </fast-slider-label>
        <fast-slider-label position="100">
            100&#8451;
        </fast-slider-label>
    `,
};

export const SliderVertical = Slider.bind({});
SliderVertical.storyName = "Vertical Slider";
SliderVertical.args = {
    orientation: Orientation.vertical,
};
