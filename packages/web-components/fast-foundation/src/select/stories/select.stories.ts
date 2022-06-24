import { html, repeat } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FoundationElement } from "../../index.js";
import type { Select as FoundationSelect } from "../select.js";
import { SelectPosition } from "../select.options.js";

type SelectStoryArgs = Args & Omit<FoundationSelect, keyof FoundationElement>;
type SelectStoryMeta = Meta<SelectStoryArgs>;

const storyTemplate = html<SelectStoryArgs>`
    <fast-select
        ?open="${x => x.open}"
        ?disabled="${x => x.disabled}"
        ?multiple="${x => x.multiple}"
        size="${x => x.size}"
        position="${x => x.position}"
    >
        ${repeat(
            x => x.items,
            html`
                <fast-option>${x => x.text}</fast-option>
            `
        )}
    </fast-select>
`;

export default {
    title: "Select",
    args: {
        items: [
            { text: "William Hartnell" },
            { text: "Patrick Troughton" },
            { text: "Jon Pertwee" },
            { text: "Tom Baker" },
            { text: "Peter Davidson" },
            { text: "Colin Baker" },
            { text: "Sylvester McCoy" },
            { text: "Paul McGann" },
            { text: "Christopher Eccleston" },
            { text: "David Tenant" },
            { text: "Matt Smith" },
            { text: "Peter Capaldi" },
            { text: "Jodie Whittaker" },
        ],
    },
    argTypes: {
        disabled: { control: { type: "boolean" } },
        items: { table: { disable: true } },
        name: { control: { type: "text" } },
        multiple: { control: { type: "boolean" } },
        open: { control: { type: "boolean" } },
        position: { options: Object.values(SelectPosition), control: { type: "select" } },
        size: { control: { type: "number" } },
    },
} as SelectStoryMeta;

export const Select = (args: SelectStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const SelectMultiple = Select.bind({});
SelectMultiple.args = {
    multiple: true,
};

export const SelectWithSize = Select.bind({});
SelectWithSize.args = {
    size: 5,
};

export const SelectDisabled = Select.bind({});
SelectDisabled.args = {
    disabled: true,
};
