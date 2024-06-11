import { css, html, repeat, Updates } from "@microsoft/fast-element";
import { storyTemplate as sliderLabelStoryTemplate } from "../../slider-label/stories/slider-label.stories.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTSlider } from "../slider.js";
import { SliderMode, SliderOrientation } from "../slider.options.js";

const storyTemplate = html<StoryArgs<FASTSlider>>`
    <fast-slider
        ?disabled="${x => x.disabled}"
        ?readonly="${x => x.readOnly}"
        max="${x => x.max}"
        min="${x => x.min}"
        mode="${x => x.mode}"
        orientation="${x => x.orientation}"
        step="${x => x.step}"
        value="${x => x.value}"
    >
        ${x => x.storyContent}
    </fast-slider>
`;

export default {
    title: "Slider",
    args: {
        disabled: false,
        readOnly: false,
    },
    argTypes: {
        disabled: { control: "boolean" },
        max: { control: "number" },
        min: { control: "number" },
        mode: { control: "radio", options: Object.values(SliderMode) },
        orientation: { control: "radio", options: Object.values(SliderOrientation) },
        readOnly: { control: "boolean" },
        step: { control: "number" },
        storyContent: { table: { disable: true } },
        storyItems: { control: "object" },
        value: { control: "number" },
    },
} as Meta<FASTSlider>;

export const Slider: Story<FASTSlider> = renderComponent(storyTemplate).bind({});

export const SliderWithLabels: Story<FASTSlider> = Slider.bind({});
SliderWithLabels.args = {
    min: 0,
    max: 100,
    step: 10,
    storyContent: html`
        ${repeat(x => x.storyItems, sliderLabelStoryTemplate)}
    `,
    storyItems: [
        { position: 0, storyContent: "0℃" },
        { position: 10, storyContent: "10℃" },
        { position: 90, storyContent: "90℃" },
        { position: 100, storyContent: "100℃" },
    ],
};
SliderWithLabels.decorators = [
    Story => {
        const renderedStory = Story() as FASTSlider;

        Updates.enqueue(() => {
            renderedStory.$fastController.addStyles(css`
                :host([orientation="horizontal"]) {
                    padding: 0 1em;
                }
            `);
        });

        return renderedStory;
    },
];

export const SliderVerticalOrientation: Story<FASTSlider> = Slider.bind({});
SliderVerticalOrientation.args = {
    orientation: SliderOrientation.vertical,
};

export const SliderVerticalOrientationWithLabels: Story<FASTSlider> = Slider.bind({});
SliderVerticalOrientationWithLabels.args = {
    orientation: SliderOrientation.vertical,
    min: 0,
    max: 100,
    step: 10,
    storyContent: html`
        ${repeat(x => x.storyItems, sliderLabelStoryTemplate)}
    `,
    storyItems: [
        { position: 0, storyContent: "0℃" },
        { position: 10, storyContent: "10℃" },
        { position: 90, storyContent: "90℃" },
        { position: 100, storyContent: "100℃" },
    ],
};

export const SliderInForm: Story<FASTSlider> = renderComponent(
    html<StoryArgs<FASTSlider>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <fast-button type="submit">Submit</fast-button>
        </form>
    `
).bind({});
