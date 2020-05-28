import { customElement } from "@microsoft/fast-element";
import {
    AccordionItem,
    AccordionItemTemplate as template,
} from "@microsoft/fast-foundation";
import { AccordionItemStyles as styles } from "./accordion-item.styles";

@customElement({
    name: "fast-accordion-item",
    template,
    styles,
})
export class FASTAccordionItem extends AccordionItem {}
