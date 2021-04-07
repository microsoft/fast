import { customElement } from "@microsoft/fast-element";
import { Accordion, AccordionTemplate as template } from "@microsoft/fast-foundation";
import { AccordionStyles as styles } from "./accordion.styles";

/**
 * The FAST Accordion Element. Implements {@link @microsoft/fast-foundation#Accordion},
 * {@link @microsoft/fast-foundation#AccordionTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: `<fast-accordion>`
 */
@customElement({
    name: "fast-accordion",
    template,
    styles,
})
export class FASTAccordion extends Accordion {}

export * from "../accordion-item";
export { AccordionStyles } from "./accordion.styles";
