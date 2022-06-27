import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import { TextField as FoundationTextField, TextFieldType } from "../text-field.js";

type TextFieldStoryArgs = Args & FoundationTextField;
type TextFieldStoryMeta = Meta<TextFieldStoryArgs>;

const componentTemplate = html<TextFieldStoryArgs>`
    <fast-text-field
        ?autofocus="${x => x.autofocus}"
        ?disabled="${x => x.disabled}"
        ?readonly="${x => x.readOnly}"
        ?spellcheck="${x => x.spellcheck}"
        list="${x => x.list}"
        maxlength="${x => x.maxlength}"
        minlength="${x => x.minlength}"
        name="${x => x.name}"
        pattern="${x => x.pattern}"
        placeholder="${x => x.placeholder}"
        resize="${x => x.resize}"
        size="${x => x.size}"
        type="${x => x.type}"
        value="${x => x.value}"
    >
        ${x => x.label}
    </fast-text-field>
`;

export default {
    title: "Text Field",
    args: {
        label: "Text Field",
    },
    argTypes: {
        autofocus: { control: { type: "boolean" } },
        disabled: { control: { type: "boolean" } },
        label: { control: { type: "text" } },
        list: { control: { type: "text" } },
        maxlength: { control: { type: "number" } },
        minlength: { control: { type: "number" } },
        name: { control: { type: "text" } },
        pattern: { control: { type: "text" } },
        placeholder: { control: { type: "text" } },
        readOnly: { control: { type: "boolean" } },
        size: { control: { type: "number" } },
        spellcheck: { control: { type: "boolean" } },
        type: { options: Object.values(TextFieldType), control: { type: "text" } },
        value: { control: { type: "text" } },
    },
} as TextFieldStoryMeta;

export const TextField = (args: TextFieldStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
