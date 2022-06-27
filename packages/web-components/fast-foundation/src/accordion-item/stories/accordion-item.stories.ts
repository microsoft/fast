import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { AccordionItem as FoundationAccordionItem } from "../accordion-item.js";

type AccordionItemArgs = Args & FoundationAccordionItem;
type AccordionItemMeta = Meta<AccordionItemArgs>;

const storyTemplate = html<AccordionItemArgs>`
    <fast-accordion-item ?expanded="${x => x?.expanded}">
        ${x => x?.content}
    </fast-accordion-item>
`;

export default {
    title: "Accordion/Accordion Item",
    includeStories: ["AccordionItem"],
    args: {
        content: html`
            Accordion Item Content
            <div slot="heading">Accordion Item Heading</div>
        `,
        expanded: true,
    },
} as AccordionItemMeta;

export const AccordionItem = (args: AccordionItemArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
