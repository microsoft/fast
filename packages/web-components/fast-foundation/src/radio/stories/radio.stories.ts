import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTRadio } from "../radio.js";

type RadioStoryArgs = Args & FASTRadio;
type RadioStoryMeta = Meta<RadioStoryArgs>;

const storyTemplate = html<RadioStoryArgs>`
    <fast-radio
        ?checked="${x => x.checked}"
        ?disabled="${x => x.disabled}"
        ?required="${x => x.required}"
    >
        ${x => x.label}
    </fast-radio>
`;

export default {
    title: "Radio",
    args: {
        label: "Label",
        checked: false,
        disabled: false,
        required: false,
    },
    argTypes: {
        checked: { control: { type: "boolean" } },
        disabled: { control: { type: "boolean" } },
        required: { control: { type: "boolean" } },
    },
} as RadioStoryMeta;

export const Radio = (args: RadioStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
