import { Accordion, AccordionTemplate as template } from "@microsoft/fast-foundation";
import { AccordionStyles as styles } from "./accordion.styles";

export * from "../accordion-item/index";

/**
 * The FAST Accordion Element. Implements {@link @microsoft/fast-foundation#Accordion},
 * {@link @microsoft/fast-foundation#AccordionTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-accordion\>
 */
export const FASTAccordion = Accordion.compose({
    baseName: "fast",
    template,
    styles,
});

/**
 * Styles for Accordion
 * @public
 */
export const AccordionStyles = styles;
