import { html } from "@microsoft/fast-element";
import type { Meta } from "@storybook/html";
import type { Story, StoryArgs } from "../../__test__/helpers.js";
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

const meta: Meta = {
    title: "Accordion Item",
    component: "FASTAccordionItem",
    parameters: { actions: { argTypesRegex: "^.*Handler" } },
    argTypes: {
        expanded: { control: "boolean" },
        headinglevel: { control: { type: "number", max: 6, min: 1 } },
        id: { control: "text" },
        storyContent: { table: { disable: true } },
        clickHandler: { action: "click" },
    },
};

export default meta;

export const AccordionItem: Story<FASTAccordionItem> = renderComponent(
    storyTemplate
).bind({});
AccordionItem.args = {
    storyContent: html`
        <span slot="heading">Accordion Item Heading</span>
        Accordion Item Content
    `,
};

export const AccordionItemWithSlottedStartEnd: Story<FASTAccordionItem> = renderComponent(
    storyTemplate
).bind({});
AccordionItemWithSlottedStartEnd.args = {
    storyContent: html`
        <fast-badge slot="start">start</fast-badge>
        <span slot="heading">Accordion Item Heading</span>
        <fast-badge slot="end">end</fast-badge>
        Accordion Item Content
    `,
};
