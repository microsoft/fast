import { html, repeat } from "@microsoft/fast-element";
import { storyTemplate as listboxOptionStoryTemplate } from "../../listbox-option/stories/listbox-option.stories.js";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTListboxElement } from "../listbox.element.js";

const storyTemplate = html<StoryArgs<FASTListboxElement>>`
    <fast-listbox
        ?multiple="${x => x.multiple}"
        size="${x => x.size}"
        ?disabled="${x => x.disabled}"
    >
        ${x => x.storyContent}
    </fast-listbox>
`;

export default {
    title: "Listbox",
    args: {
        disabled: false,
        multiple: false,
        storyContent: html<StoryArgs<FASTListboxElement>>`
            ${repeat(x => x.storyItems, listboxOptionStoryTemplate)}
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
        multiple: { control: "boolean" },
        size: { control: "number" },
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
    },
} as Meta<FASTListboxElement>;

export const Listbox: Story<FASTListboxElement> = renderComponent(storyTemplate).bind({});

export const ListboxMultiple: Story<FASTListboxElement> = Listbox.bind({});
ListboxMultiple.storyName = "Listbox in multiple-selection mode";
ListboxMultiple.args = {
    multiple: true,
};
