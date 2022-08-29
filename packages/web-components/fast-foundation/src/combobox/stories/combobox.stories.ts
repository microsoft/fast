import { html, repeat } from "@microsoft/fast-element";
import { storyTemplate as listboxOptionTemplate } from "../../listbox-option/stories/listbox-option.stories.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTCombobox } from "../combobox.js";
import { ComboboxAutocomplete } from "../combobox.options.js";

const storyTemplate = html<StoryArgs<FASTCombobox>>`
    <fast-combobox
        ?autofocus="${x => x.autofocus}"
        ?disabled="${x => x.disabled}"
        ?required="${x => x.required}"
        autocomplete="${x => x.autocomplete}"
        id="${x => x.id}"
        name="${x => x.name}"
        placeholder="${x => x.placeholder}"
        value="${x => x.value}"
    >
        ${x => x.storyContent}
    </fast-combobox>
`;

export default {
    title: "Combobox",
    args: {
        disabled: false,
        required: false,
        storyContent: html`
            ${repeat(x => x.storyItems, listboxOptionTemplate)}
        `,
        storyItems: [
            { storyContent: "William Hartnell" },
            { storyContent: "Patrick Troughton" },
            { storyContent: "Jon Pertwee" },
            { storyContent: "Tom Baker" },
            { storyContent: "Peter Davidson" },
            { storyContent: "Colin Baker" },
            { storyContent: "Sylvester McCoy" },
            { storyContent: "Paul McGann" },
            { storyContent: "Christopher Eccleston" },
            { storyContent: "David Tenant" },
            { storyContent: "Matt Smith" },
            { storyContent: "Peter Capaldi" },
            { storyContent: "Jodie Whittaker" },
            { storyContent: "Ncuti Gatwa" },
        ],
    },
    argTypes: {
        autocomplete: { control: "select", options: Object.values(ComboboxAutocomplete) },
        disabled: { control: "boolean" },
        id: { control: "text" },
        placeholder: { control: "text" },
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        value: { control: "text" },
    },
} as Meta<FASTCombobox>;

export const Combobox: Story<FASTCombobox> = renderComponent(storyTemplate).bind({});

export const ComboboxDisabled: Story<FASTCombobox> = Combobox.bind({});
ComboboxDisabled.args = {
    disabled: true,
};

export const ComboboxWithPlaceholder: Story<FASTCombobox> = Combobox.bind({});
ComboboxWithPlaceholder.args = {
    placeholder: "Select a character",
};

export const ComboboxWithInlineAutocomplete: Story<FASTCombobox> = Combobox.bind({});
ComboboxWithInlineAutocomplete.args = {
    autocomplete: ComboboxAutocomplete.inline,
};

export const ComboboxWithListAutocomplete: Story<FASTCombobox> = Combobox.bind({});
ComboboxWithListAutocomplete.args = {
    autocomplete: ComboboxAutocomplete.list,
};

export const ComboboxWithBothAutocomplete: Story<FASTCombobox> = Combobox.bind({});
ComboboxWithBothAutocomplete.args = {
    autocomplete: ComboboxAutocomplete.both,
};

export const ComboboxWithIcons: Story<FASTCombobox> = Combobox.bind({});
ComboboxWithIcons.args = {
    storyContent: html`
        <svg width="20" height="20" slot="start"><use href="#test-icon" /></svg>
        ${repeat(x => x.storyItems, listboxOptionTemplate)}
        <svg width="20" height="20" slot="end"><use href="#test-icon-2" /></svg>
    `,
};

export const ComboboxInForm: Story<FASTCombobox> = renderComponent(
    html<StoryArgs<FASTCombobox>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <fast-button type="reset">Reset</fast-button>
            <fast-button type="submit">Submit</fast-button>
        </form>
    `
).bind({});
ComboboxInForm.args = {
    required: true,
};

export const ComboboxWithWrappingLabel: Story<FASTCombobox> = renderComponent(
    html<StoryArgs<FASTCombobox>>`
        <label for="${x => x.id}" style="display: inline-flex; flex-direction: column">
            <div>${x => x.label}</div>
            ${storyTemplate}
        </label>
    `
).bind({});
ComboboxWithWrappingLabel.args = {
    id: "combobox",
    label: "Combobox",
    name: "combobox",
};
