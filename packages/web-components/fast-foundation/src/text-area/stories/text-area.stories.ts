import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { TextArea as FoundationTextArea } from "../text-area.js";
import { TextAreaResize } from "../text-area.options.js";

type TextAreaStoryArgs = Args & FoundationTextArea;
type TextAreaStoryMeta = Meta<TextAreaStoryArgs>;

const componentTemplate = html<TextAreaStoryArgs>`
    <fast-text-area
        ?autofocus="${x => x.autofocus}"
        ?disabled="${x => x.disabled}"
        ?readonly="${x => x.readOnly}"
        ?spellcheck="${x => x.spellcheck}"
        cols="${x => x.cols}"
        form="${x => x.form}"
        list="${x => x.list}"
        maxlength="${x => x.maxlength}"
        minlength="${x => x.minlength}"
        name="${x => x.name}"
        pattern="${x => x.pattern}"
        placeholder="${x => x.placeholder}"
        resize="${x => x.resize}"
        rows="${x => x.rows}"
        size="${x => x.size}"
        value="${x => x.value}"
    >
        ${x => x.label}
    </fast-text-area>
`;

export default {
    title: "Text Area",
    args: {
        label: "Text Area",
    },
    argTypes: {
        autofocus: { control: { type: "boolean" } },
        disabled: { control: { type: "boolean" } },
        label: { control: { type: "text" } },
        list: { control: { type: "text" } },
        maxlength: { control: { type: "number" } },
        minlength: { control: { type: "number" } },
        name: { control: { type: "text" } },
        placeholder: { control: { type: "text" } },
        form: { control: { type: "text" } },
        readOnly: { control: { type: "boolean" } },
        cols: { control: { type: "number" } },
        rows: { control: { type: "number" } },
        resize: { options: Object.values(TextAreaResize), control: { type: "select" } },
        spellcheck: { control: { type: "boolean" } },
        value: { control: { type: "text" } },
    },
} as TextAreaStoryMeta;

export const TextArea = (args: TextAreaStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
