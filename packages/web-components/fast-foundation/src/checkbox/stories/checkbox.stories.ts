import { html, repeat } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Checkbox as FoundationCheckbox } from "../checkbox.js";

type CheckboxStoryArgs = Args & FoundationCheckbox;
type CheckboxStoryMeta = Meta<CheckboxStoryArgs>;

const storyTemplate = html<CheckboxStoryArgs>`
    <fast-checkbox
        ?checked="${x => x.checked}"
        ?disabled="${x => x.disabled}"
        :indeterminate="${x => x.indeterminate}"
        ?required="${x => x.required}"
    >
        ${x => x.label}
    </fast-checkbox>
`;

export default {
    title: "Checkbox",
    args: {
        checked: false,
        indeterminate: false,
        label: "Checkbox",
        required: false,
    },
    argTypes: {
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        indeterminate: { control: "boolean" },
        required: { control: "boolean" },
    },
} as CheckboxStoryMeta;

export const Checkbox = (args: CheckboxStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const DisabledCheckbox: CheckboxStoryMeta = (args: CheckboxStoryArgs) => {
    const disabledStoryTemplate = html<CheckboxStoryArgs>`
        ${repeat(x => x.items, storyTemplate)}
    `;

    const storyFragment = new DocumentFragment();
    disabledStoryTemplate.render(args, storyFragment);
    return storyFragment;
};
DisabledCheckbox.args = {
    items: [
        { label: "Disabled (unchecked)", checked: false, disabled: true },
        {
            label: "Disabled (indeterminate, unchecked)",
            checked: false,
            disabled: true,
            indeterminate: true,
        },
        {
            label: "Disabled (indeterminate, checked)",
            checked: true,
            disabled: true,
            indeterminate: true,
        },
        { label: "Disabled (checked)", checked: true, disabled: true },
    ],
};
DisabledCheckbox.decorators = [
    Story => {
        const renderedStory = Story() as DocumentFragment;
        const styles = document.createElement("style");
        styles.innerHTML = /* css */ `
            fast-checkbox {
                display: flex;
            }
        `;
        renderedStory.append(styles);
        return renderedStory;
    },
];

export const IndeterminateCheckbox = Checkbox.bind({});
IndeterminateCheckbox.storyName = "Indeterminate";
IndeterminateCheckbox.args = {
    label: "Indeterminate",
    indeterminate: true,
};

export const Required: CheckboxStoryMeta = (args: CheckboxStoryArgs) => {
    const requiredStoryTemplate = html<CheckboxStoryArgs>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <fast-button type="submit">Submit</fast-button>
        </form>
    `;

    const storyFragment = new DocumentFragment();
    requiredStoryTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
Required.args = {
    required: true,
};

export const Fieldset: CheckboxStoryMeta = (args: CheckboxStoryArgs) => {
    const fieldsetStoryTemplate = html<CheckboxStoryArgs>`
        <fieldset>
            <legend>${x => x.label}</legend>
            ${repeat(x => x.items, storyTemplate)}
        </fieldset>
    `;

    const storyFragment = new DocumentFragment();
    fieldsetStoryTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
Fieldset.args = {
    label: "Fruit",
    items: [
        { label: "Apples", checked: true },
        { label: "Bananas", checked: true },
        { label: "Honeydew" },
        { label: "Oranges", checked: true },
    ],
};
Fieldset.decorators = [
    Story => {
        const renderedStory = Story() as DocumentFragment;
        const styles = document.createElement("style");
        styles.innerHTML = /* css */ `
            fieldset {
                align-items: start;
                display: flex;
                flex-direction: column;
            }
        `;
        renderedStory.append(styles);
        return renderedStory;
    },
];

export const VisualVsAudioLabel = Checkbox.bind({});
VisualVsAudioLabel.args = {
    label: html`
        <span aria-label="Audio label">Visible label</span>
    `,
};
