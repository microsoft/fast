import { customElement } from "@microsoft/fast-element";
import { Accordion, AccordionTemplate as template } from "@microsoft/fast-foundation";
import { AccordionStyles as styles } from "./accordion.styles";

export * from "./accordion-item/index";

@customElement({
    name: "fast-accordion",
    template,
    styles,
})
export class FASTAccordion extends Accordion {}
