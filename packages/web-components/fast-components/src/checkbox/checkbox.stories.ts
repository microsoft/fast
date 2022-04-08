import { html } from "@microsoft/fast-element";
import { Checkbox } from "@microsoft/fast-foundation";
import { Meta } from "@storybook/html";
import { renderComponent } from "../storybook-helpers.js";

const componentTemplate = html`
    <fast-checkbox
        class="${x => (x.indeterminate ? "flag-indeterminate" : "")}"
        ?checked="${x => x.checked}"
        ?disabled="${x => x.disabled}"
        ?required="${x => x.required}"
    >
        ${x => x.label}
    </fast-checkbox>
`;

export default {
    title: "Checkbox",
    argTypes: {
        checked: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        required: {
            control: "boolean",
        },
        label: {
            control: "text",
        },
    },
    decorators: [
        (Story, { args }) => {
            const renderedStory = Story() as DocumentFragment;
            const checkboxes = renderedStory.querySelectorAll<Checkbox>("fast-checkbox");
            if (args.indeterminate) {
                checkboxes.forEach(checkbox => {
                    checkbox.indeterminate = true;
                });
            }
            return renderedStory;
        },
    ],
} as Meta<Checkbox>;

export const Primary = renderComponent(componentTemplate).bind({});

export const WithLabel = renderComponent(componentTemplate).bind({});
WithLabel.args = {
    label: "label",
};

export const RequiredUnchecked = renderComponent(componentTemplate).bind({});
RequiredUnchecked.args = {
    checked: false,
    required: true,
    label: "Required (Unchecked)",
};

export const IndeterminateUnchecked = renderComponent(componentTemplate).bind({});
IndeterminateUnchecked.args = {
    checked: false,
    indeterminate: true,
    label: "Indeterminate (Unchecked)",
};

export const IndeterminateChecked = renderComponent(componentTemplate).bind({});
IndeterminateChecked.args = {
    checked: true,
    indeterminate: true,
    label: "Indeterminate (Checked)",
};

export const DisabledUnchecked = renderComponent(componentTemplate).bind({});
DisabledUnchecked.args = {
    checked: false,
    disabled: true,
    label: "Disabled (Unchecked)",
};

export const DisabledChecked = renderComponent(componentTemplate).bind({});
DisabledChecked.args = {
    checked: true,
    disabled: true,
    label: "Disabled (Checked)",
};

export const DisabledIndeterminateUnchecked = renderComponent(componentTemplate).bind({});
DisabledIndeterminateUnchecked.args = {
    checked: false,
    disabled: true,
    indeterminate: true,
    label: "Disabled, Indeterminate (Unchecked)",
};

export const DisabledIndeterminateChecked = renderComponent(componentTemplate).bind({});
DisabledIndeterminateChecked.args = {
    checked: true,
    disabled: true,
    indeterminate: true,
    label: "Disabled, Indeterminate (Checked)",
};

const inlineTemplate = html`
    <fast-checkbox checked>Apples</fast-checkbox>
    <fast-checkbox checked>Bananas</fast-checkbox>
    <fast-checkbox>Honeydew</fast-checkbox>
    <fast-checkbox checked>Oranges</fast-checkbox>
`;
export const Inline = renderComponent(inlineTemplate).bind({});

const verticalComponentTemplate = html`
    <fieldset style="display: flex; flex-direction: column; align-items: start;">
        <legend>Fruit</legend>
        <fast-checkbox checked>Apples</fast-checkbox>
        <fast-checkbox checked>Bananas</fast-checkbox>
        <fast-checkbox>Honeydew</fast-checkbox>
        <fast-checkbox checked>Oranges</fast-checkbox>
    </fieldset>
`;

export const Vertical = renderComponent(verticalComponentTemplate).bind({});

export const VisualVsAudioLabel = renderComponent(componentTemplate).bind({});
VisualVsAudioLabel.args = {
    label: html`
        <span aria-label="Audio label">Visible label</span>
    `,
};
