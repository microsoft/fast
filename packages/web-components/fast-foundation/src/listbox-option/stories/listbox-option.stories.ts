import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTListboxOption } from "../listbox-option.js";

export const storyTemplate = html<StoryArgs<FASTListboxOption>>`
    <fast-option
        ?disabled="${x => x.disabled}"
        ?selected="${x => x.selected}"
        value="${x => x.value}"
    >
        ${x => x.storyContent}
    </fast-option>
`;

export default {
    title: "Listbox Option",
    excludeStories: ["storyTemplate"],
    args: {
        selected: false,
        disabled: false,
        storyContent: "Listbox option",
        value: "listbox-value",
    },
    argTypes: {
        disabled: { control: "boolean" },
        items: { table: { disable: true } },
        selected: { control: "boolean" },
        value: { control: "text" },
        ariaChecked: { control: "text" },
        ariaPosInSet: { control: "text" },
        ariaSelected: { control: "text" },
        ariaSetSize: { control: "text" },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTListboxOption>;

export const ListboxOption: Story<FASTListboxOption> = renderComponent(
    storyTemplate
).bind({});
