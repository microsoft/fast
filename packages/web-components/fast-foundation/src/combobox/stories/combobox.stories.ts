import { html, repeat } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Combobox as FoundationCombobox } from "../combobox.js";
import { ComboboxAutocomplete } from "../combobox.options.js";

type ComboboxStoryArgs = Args & FoundationCombobox;
type ComboboxStoryMeta = Meta<ComboboxStoryArgs>;

const storyTemplate = html<ComboboxStoryArgs>`
    <fast-combobox autocomplete="${x => x.autocomplete}">
        ${repeat(
            x => x.items,
            html`
                <fast-option>${x => x.text}</fast-option>
            `
        )}
    </fast-combobox>
`;

export default {
    title: "Combobox",
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
        autocomplete: {
            options: Object.values(ComboboxAutocomplete),
            control: {
                type: "select",
            },
        },
        items: {
            table: {
                disable: true,
            },
        },
    },
} as ComboboxStoryMeta;

export const Combobox = (args: ComboboxStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
