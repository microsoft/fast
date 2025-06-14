import { html, repeat } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTCheckbox } from "../checkbox.js";

const storyTemplate = html<StoryArgs<FASTCheckbox>>`
    <fast-checkbox
        ?checked="${x => x.checked}"
        ?disabled="${x => x.disabled}"
        ?required="${x => x.required}"
        ?readonly="${x => x.readOnly}"
        :indeterminate="${x => x.indeterminate}"
        value="${x => x.value}"
    >
        ${x => x.storyContent}
    </fast-checkbox>
`;

export default {
    title: "Checkbox",
    args: {
        checked: false,
        disabled: false,
        indeterminate: false,
        storyContent: "Checkbox",
        readOnly: false,
        required: false,
    },
    argTypes: {
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        indeterminate: { control: "boolean" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
        value: { control: "text" },
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
    },
} as Meta<FASTCheckbox>;

export const Checkbox: Story<FASTCheckbox> = renderComponent(storyTemplate).bind({});

export const CheckboxDisabled: Story<FASTCheckbox> = renderComponent(
    html<StoryArgs<FASTCheckbox>>`
        <div style="align-items: start; display: flex; flex-direction: column">
            ${repeat(x => x.storyItems, storyTemplate)}
        </div>
    `
).bind({});
CheckboxDisabled.args = {
    storyItems: [
        { storyContent: "Disabled (unchecked)", disabled: true },
        {
            storyContent: "Disabled (indeterminate, unchecked)",
            disabled: true,
            indeterminate: true,
        },
        {
            storyContent: "Disabled (indeterminate, checked)",
            checked: true,
            disabled: true,
            indeterminate: true,
        },
        { storyContent: "Disabled (checked)", checked: true, disabled: true },
    ],
};

export const CheckboxIndeterminate: Story<FASTCheckbox> = Checkbox.bind({});
CheckboxIndeterminate.args = {
    checked: true,
    indeterminate: true,
    storyContent: "Indeterminate",
};

export const CheckboxInForm: Story<FASTCheckbox> = renderComponent(
    html<StoryArgs<FASTCheckbox>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <fast-button type="submit">Submit</fast-button>
        </form>
    `
).bind({});

export const CheckboxInFieldset: Story<FASTCheckbox> = renderComponent(
    html<StoryArgs<FASTCheckbox>>`
        <fieldset style="align-items: start; display: flex; flex-direction: column">
            <legend>${x => x.legendLabel}</legend>
            ${repeat(x => x.storyItems, storyTemplate)}
        </fieldset>
    `
).bind({});
CheckboxInFieldset.args = {
    legendLabel: "Fruit",
    storyItems: [
        { storyContent: "Apples", checked: true },
        { storyContent: "Bananas", checked: true },
        { storyContent: "Honeydew" },
        { storyContent: "Oranges", checked: true },
    ],
};

export const CheckboxVisualVsAudioLabel = Checkbox.bind({});
CheckboxVisualVsAudioLabel.args = {
    storyContent: html`
        <span aria-label="Audio label">Visible label</span>
    `,
};
