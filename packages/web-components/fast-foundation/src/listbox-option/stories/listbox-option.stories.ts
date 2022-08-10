import { html, repeat } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTListboxOption } from "../listbox-option.js";

type ListboxOptionStoryArgs = Args & FASTListboxOption;
type ListboxOptionStoryMeta = Meta<ListboxOptionStoryArgs>;

const storyTemplate = html<ListboxOptionStoryArgs>`
    <fast-option
        :disabled="${x => x.disabled}"
        ?selected="${x => x.selected}"
        :checked="${x => x.checked}"
        value="${x => x.value}"
    >
        ${x => x.text}
    </fast-option>
`;

export default {
    title: "Listbox/Listbox Option",
    args: {
        text: "Listbox option",
        value: "listbox-value",
    },
    argTypes: {
        selected: {
            control: {
                type: "boolean",
            },
        },
    },
} as ListboxOptionStoryMeta;

export const ListboxOption = (args: ListboxOptionStoryArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};

export const ListboxOptionSelected = ListboxOption.bind({});
ListboxOptionSelected.storyName = "Selected Listbox Option";
ListboxOptionSelected.args = {
    selected: true,
};

export const ListboxOptionDisabled = (args: ListboxOptionStoryArgs) => {
    const disabledStoryTemplate = html<ListboxOptionStoryArgs>`
        ${repeat(x => x.items, storyTemplate)}
    `;

    const storyFragment = new DocumentFragment();
    disabledStoryTemplate.render(args, storyFragment);
    return storyFragment;
};
ListboxOptionDisabled.storyName = "Disabled Listbox Option";
ListboxOptionDisabled.args = {
    items: [
        {
            disabled: true,
            text: "disabled (unselected)",
        },
        {
            disabled: true,
            text: "disabled (selected)",
        },
        {
            checked: false,
            disabled: true,
            selected: true,
            text: "disabled (unselected, checked)",
        },
        {
            checked: true,
            disabled: true,
            selected: true,
            text: "disabled (selected, checked)",
        },
    ],
};
