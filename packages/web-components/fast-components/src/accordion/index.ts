import { Accordion, accordionTemplate as template } from "@microsoft/fast-foundation";
import { accordionStyles as styles } from "./accordion.styles";

export * from "../accordion-item/index";

/**
 * The FAST Accordion Element. Implements {@link @microsoft/fast-foundation#Accordion},
 * {@link @microsoft/fast-foundation#accordionTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-accordion\>
 */
export const fastAccordion = Accordion.compose({
    baseName: "accordion",
    template,
    styles,
});

/**
 * Styles for Accordion
 * @public
 */
export const accordionStyles = styles;
