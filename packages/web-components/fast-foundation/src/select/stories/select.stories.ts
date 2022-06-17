import { html, repeat } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Select as FoundationSelect } from "../select.js";

type SelectStoryArgs = Args & FoundationSelect;
type SelectStoryMeta = Meta<SelectStoryArgs>;

const storyTemplate = html<SelectStoryArgs>`
    <fast-select ?multiple="${x => x.multiple}" size="${x => x.size}">
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
        items: {
            table: {
                disable: true,
            },
        },
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
