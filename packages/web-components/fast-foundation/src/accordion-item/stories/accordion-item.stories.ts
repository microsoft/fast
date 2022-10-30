import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTAccordionItem } from "../accordion-item.js";

const storyTemplate = html<StoryArgs<FASTAccordionItem>>`
    <fast-accordion-item
        ?expanded="${x => x.expanded}"
        heading-level="${x => x.headinglevel}"
        id="${x => x.id}"
    >
        ${x => x.storyContent}
    </fast-accordion-item>
`;

export default {
    title: "Accordion Item",
    args: {
        expanded: false,
    },
    argTypes: {
        expanded: { control: "boolean" },
        headinglevel: { control: { type: "number", max: 6, min: 1 } },
        id: { control: "text" },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTAccordionItem>;

export const AccordionItem: Story<FASTAccordionItem> = renderComponent(
    storyTemplate
).bind({});
AccordionItem.args = {
    storyContent: html`
        Accordion Item Content
        <div slot="heading">Accordion Item Heading</div>
    `,
};
