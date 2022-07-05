import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTNumberField } from "../number-field.js";

type NumberFieldStoryArgs = Args & FASTNumberField;
type NumberFieldStoryMeta = Meta<NumberFieldStoryArgs>;

const componentTemplate = html<NumberFieldStoryArgs>`
    <fast-number-field
        :readOnly="${x => x.readOnly}"
        :required="${x => x.required}"
        ?autofocus="${x => x.autofocus}"
        ?disabled="${x => x.disabled}"
        ?hide-step="${x => x.hideStep}"
        max="${x => x.max}"
        maxlength="${x => x.maxlength}"
        min="${x => x.min}"
        minlength="${x => x.minlength}"
        placeholder="${x => x.placeholder}"
        size="${x => x.size}"
        value="${x => x.value}"
    >
        ${x => x.label}
    </fast-number-field>
`;

export default {
    title: "Number Field",
    args: {
        label: "Number Field",
        placeholder: "number",
    },
    argTypes: {
        autofocus: { control: { type: "boolean" } },
        label: { control: { type: "text" } },
        disabled: { control: { type: "boolean" } },
        hideStep: { control: { type: "boolean " } },
        list: { control: { type: "text" } },
        max: { control: { type: "number" } },
        maxlength: { control: { type: "number" } },
        min: { control: { type: "number" } },
        minlength: { control: { type: "number" } },
        placeholder: { control: { type: "text" } },
        readOnly: { control: { type: "boolean" } },
        required: { control: { type: "boolean" } },
        size: { control: { type: "number" } },
        value: { control: { type: "number" } },
    },
} as NumberFieldStoryMeta;

export const NumberField = (args: NumberFieldStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
