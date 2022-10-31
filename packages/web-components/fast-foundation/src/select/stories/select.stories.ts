import { html, repeat } from "@microsoft/fast-element";
import { storyTemplate as ListboxOptionTemplate } from "../../listbox-option/stories/listbox-option.stories.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTSelect } from "../select.js";

const storyTemplate = html<StoryArgs<FASTSelect>>`
    <fast-select
        ?open="${x => x.open}"
        ?disabled="${x => x.disabled}"
        ?multiple="${x => x.multiple}"
        size="${x => x.size}"
        value="${x => x.value}"
    >
        ${x => x.storyContent}
    </fast-select>
`;

export default {
    title: "Select",
    args: {
        disabled: false,
        multiple: false,
        open: false,
        storyContent: html<StoryArgs<FASTSelect>>`
            ${repeat(x => x.storyItems, ListboxOptionTemplate)}
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
        disabled: { control: "boolean" },
        name: { control: "text" },
        multiple: { control: "boolean" },
        open: { control: "boolean" },
        size: { control: "number" },
        storyContent: { table: { disable: true } },
        storyItems: { control: "object" },
        value: { control: "text" },
    },
} as Meta<FASTSelect>;

export const Select: Story<FASTSelect> = renderComponent(storyTemplate).bind({});

export const SelectMultiple: Story<FASTSelect> = Select.bind({});
SelectMultiple.args = {
    multiple: true,
};

export const SelectWithSize: Story<FASTSelect> = Select.bind({});
SelectWithSize.args = {
    size: 5,
};

export const SelectDisabled: Story<FASTSelect> = Select.bind({});
SelectDisabled.args = {
    disabled: true,
};

export const SelectInForm: Story<FASTSelect> = renderComponent(html<Meta<FASTSelect>>`
    <form @submit="${() => false}">
        ${storyTemplate}
        <fast-button type="submit">Submit</fast-button>
    </form>
`).bind({});
