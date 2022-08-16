import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTListboxOption } from "../listbox-option.js";

export const storyTemplate = html<StoryArgs<FASTListboxOption>>`
    <fast-option
        ?disabled="${x => x.disabled}"
        ?selected="${x => x.selected}"
        id="${x => x.id}"
        value="${x => x.value}"
    >
        <svg width="20" height="20" slot="start"><use href="#test-icon"/></svg>
        ${x => x.storyContent}
        <svg width="20" height="20" slot="end"><use href="#test-icon-2"/></svg>
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
