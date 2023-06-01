import { html, repeat } from "@microsoft/fast-element";
import {} from "@microsoft/fast-web-utilities";
import { storyTemplate as radioStoryTemplate } from "../../radio/stories/radio.stories.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import { RadioGroupOrientation } from "../radio-group.options.js";
import type { FASTRadioGroup } from "../radio-group.js";

const storyTemplate = html<StoryArgs<FASTRadioGroup>>`
    <fast-radio-group
        ?disabled="${x => x.disabled}"
        ?readonly="${x => x.readOnly}"
        name="${x => x.name}"
        orientation="${x => x.orientation}"
        value="${x => x.value}"
    >
        ${x => x.storyContent}
    </fast-radio-group>
`;

export default {
    title: "Radio Group",
    args: {
        disabled: false,
        name: "fruits",
        readOnly: false,
        storyContent: html<StoryArgs<FASTRadioGroup>>`
            <label slot="label">Fruits</label>
            ${repeat(x => x.storyItems, radioStoryTemplate)}
        `,
        storyItems: [
            { storyContent: "Apples", value: "apples" },
            { storyContent: "Bananas", value: "bananas" },
            { storyContent: "Blueberries", value: "blueberries" },
            { storyContent: "Grapefruit", value: "grapefruit" },
            { storyContent: "Kiwi", value: "kiwi" },
            { storyContent: "Mango", value: "mango" },
            { storyContent: "Oranges", value: "oranges" },
            { storyContent: "Pineapple", value: "pineapple" },
            { storyContent: "Strawberries", value: "strawberries" },
        ],
    },
    argTypes: {
        disabled: { control: "boolean" },
        name: { control: "text" },
        orientation: { control: "radio", options: Object.values(RadioGroupOrientation) },
        readOnly: { control: "boolean" },
        storyContent: { table: { disable: true } },
        storyItems: { control: "object" },
        value: { control: "text" },
    },
} as Meta<FASTRadioGroup>;

export const RadioGroup: Story<FASTRadioGroup> = renderComponent(storyTemplate).bind({});

export const RadioGroupVertical: Story<FASTRadioGroup> = RadioGroup.bind({});
RadioGroupVertical.args = {
    orientation: RadioGroupOrientation.vertical,
};

export const RadioGroupInForm: Story<FASTRadioGroup> = renderComponent(
    html<StoryArgs<FASTRadioGroup>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <fast-button type="submit">Submit</fast-button>
        </form>
    `
).bind({});
