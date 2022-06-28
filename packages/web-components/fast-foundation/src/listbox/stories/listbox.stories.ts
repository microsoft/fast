import { html, repeat } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { ListboxElement } from "../listbox.element.js";

type ListboxStoryArgs = Args & ListboxElement;
type ListboxStoryMeta = Meta<ListboxStoryArgs>;

const storyTemplate = html<ListboxStoryArgs>`
    <fast-listbox
        ?multiple="${x => x.multiple}"
        size="${x => x.size}"
        ?disabled="${x => x.disabled}"
    >
        ${repeat(
            x => x.items,
            html`
                <fast-option ?selected="${x => x.selected}">${x => x.text}</fast-option>
            `
        )}
    </fast-listbox>
`;

export default {
    title: "Listbox",
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
        disabled: {
            control: {
                type: "boolean",
            },
        },
        items: {
            table: {
                disable: true,
            },
        },
        size: {
            control: {
                type: "number",
            },
        },
    },
} as ListboxStoryMeta;

export const Listbox = (args: ListboxStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const ListboxMultiple = Listbox.bind({});
ListboxMultiple.storyName = "Listbox in multiple-selection mode";
ListboxMultiple.args = {
    multiple: true,
};

export const ListboxDisabled = Listbox.bind({});
ListboxDisabled.storyName = "Disabled Listbox";
ListboxDisabled.args = {
    disabled: true,
};
