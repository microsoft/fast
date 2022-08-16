import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import { FASTAccordion } from "../accordion.js";
import { AccordionExpandMode } from "../accordion.options.js";

const storyTemplate = html<StoryArgs<FASTAccordion>>`
    <fast-accordion expand-mode="${x => x.expandmode}">
        ${x => x.storyContent}
    </fast-accordion>
`;

export default {
    title: "Accordion",
    component: FASTAccordion,
    args: {
        expandmode: AccordionExpandMode.multi,
    },
    argTypes: {
        expandmode: { control: "select", options: Object.values(AccordionExpandMode) },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTAccordion>;

export const Accordion: Story<FASTAccordion> = renderComponent(storyTemplate).bind({});
Accordion.args = {
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
    `,
};
