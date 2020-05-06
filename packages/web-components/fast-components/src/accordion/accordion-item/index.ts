import { customElement } from "@microsoft/fast-element";
import { AccordionItem } from "./accordion-item";
import { AccordionItemTemplate as template } from "./accordion-item.template";
import { AccordionItemStyles as styles } from "./accordion-item.styles";

@customElement({
    name: "fast-accordion-item",
    template,
    styles,
})
export class FASTAccordionItem extends AccordionItem {}
export * from "./accordion-item.template";
export * from "./accordion-item.styles";
export * from "./accordion-item";
