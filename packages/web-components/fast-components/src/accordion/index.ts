import { customElement } from "@microsoft/fast-element";
import { Accordion } from "./accordion";
import { AccordionTemplate as template } from "./accordion.template";
import { AccordionStyles as styles } from "./accordion.styles";

@customElement({
    name: "fast-accordion",
    template,
    styles,
})
export class FASTAccordion extends Accordion {}
export * from "./accordion.template";
export * from "./accordion.styles";
export * from "./accordion";
