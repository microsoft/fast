import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Accordion as FoundationAccordion } from "../accordion.js";
import { AccordionExpandMode } from "../accordion.js";

type AccordionArgs = Args & FoundationAccordion;
type AccordionMeta = Meta<AccordionArgs>;

const storyTemplate = html<AccordionArgs>`
    <fast-accordion expand-mode="${x => x.expandmode}">
        ${x => x?.content}
    </fast-accordion>
`;

export default {
    title: "Accordion",
    args: {
        content: html`
            <fast-accordion-item>
                <div slot="heading">Accordion Item 1 Heading</div>
                Accordion Item 1 Content
            </fast-accordion-item>
            <fast-accordion-item>
                <div slot="heading">Accordion Item 2 Heading</div>
                Accordion Item 2 Content
            </fast-accordion-item>
        `,
    },

    argTypes: {
        expandmode: {
            options: Object.values(AccordionExpandMode),
            control: {
                type: "select",
            },
        },
    },
} as AccordionMeta;

export const Accordion = (args: AccordionArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
