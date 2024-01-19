import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTAccordion } from "../accordion.js";
import { AccordionExpandMode } from "../accordion.options.js";

const storyTemplate = html<StoryArgs<FASTAccordion>>`
    <fast-accordion expand-mode="${x => x.expandmode}">
        ${x => x.storyContent}
    </fast-accordion>
`;

const meta: Meta<FASTAccordion> = {
    title: "Accordion",
    component: "anchor",
    args: {
        expandmode: AccordionExpandMode.multi,
    },
    argTypes: {
        expandmode: { control: "select", options: Object.values(AccordionExpandMode) },
        storyContent: { table: { disable: true } },
    },
};

export default meta;

export const Accordion: Story<FASTAccordion> = renderComponent(storyTemplate).bind({});
Accordion.args = {
    storyContent: html`
        <fast-accordion-item>
            <span slot="heading">Accordion Item 1 Heading</span>
            Accordion Item 1 Content
        </fast-accordion-item>
        <fast-accordion-item>
            <span slot="heading">Accordion Item 2 Heading</span>
            <fast-checkbox>A checkbox as content</fast-checkbox>
        </fast-accordion-item>
        <fast-accordion-item disabled>
            <span slot="heading">Accordion Item 3 Heading</span>
            Accordion Item 3 Content
        </fast-accordion-item>
    `,
};

export const AccordionWithSlottedStartEnd: Story<FASTAccordion> = renderComponent(
    storyTemplate
).bind({});
AccordionWithSlottedStartEnd.args = {
    storyContent: html`
        <fast-accordion-item>
            <fast-badge slot="start">start</fast-badge>
            <span slot="heading">Accordion Item 1 Heading</span>
            <fast-badge slot="end">end</fast-badge>
            Accordion Item 1 Content
        </fast-accordion-item>
        <fast-accordion-item>
            <fast-badge slot="start">start</fast-badge>
            <span slot="heading">Accordion Item 2 Heading</span>
            <fast-badge slot="end">end</fast-badge>
            <fast-checkbox>A checkbox as content</fast-checkbox>
        </fast-accordion-item>
        <fast-accordion-item disabled>
            <fast-badge slot="start">start</fast-badge>
            <span slot="heading">Accordion Item 3 Heading</span>
            <fast-badge slot="end">end</fast-badge>
            Accordion Item 3 Content
        </fast-accordion-item>
    `,
};

export const AccordionWithExpandedChild: Story<FASTAccordion> = renderComponent(
    storyTemplate
).bind({});
AccordionWithExpandedChild.args = {
    storyContent: html`
        <fast-accordion-item>
            <div slot="heading">Accordion Item 1 Heading</div>
            Accordion Item 1 Content
        </fast-accordion-item>
        <fast-accordion-item>
            <div slot="heading">Accordion Item 2 Heading</div>
            <fast-checkbox>A checkbox as content</fast-checkbox>
        </fast-accordion-item>
        <fast-accordion-item expanded>
            <div slot="heading">Accordion Item 3 Heading</div>
            Accordion Item 3 Content
        </fast-accordion-item>
    `,
};

export const AccordionWithSingleExpandMode: Story<FASTAccordion> = renderComponent(
    storyTemplate
).bind({});
AccordionWithSingleExpandMode.args = {
    expandmode: "single",
    storyContent: html`
        <fast-accordion-item expanded disabled>
            <div slot="heading">Accordion Item 1 Heading</div>
            Accordion Item 1 Content
        </fast-accordion-item>
        <fast-accordion-item expanded>
            <div slot="heading">Accordion Item 2 Heading</div>
            <fast-checkbox>A checkbox as content</fast-checkbox>
        </fast-accordion-item>
        <fast-accordion-item>
            <div slot="heading">Accordion Item 3 Heading</div>
            Accordion Item 3 Content
        </fast-accordion-item>
        <fast-accordion-item>
            <div slot="heading">Accordion Item 4 Heading</div>
            Accordion Item 4 Content
        </fast-accordion-item>
    `,
};
