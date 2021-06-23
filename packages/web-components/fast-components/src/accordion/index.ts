import { Accordion, accordionTemplate as template } from "@microsoft/fast-foundation";
import { accordionStyles as styles } from "./accordion.styles";

export * from "../accordion-item/index";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Accordion} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#accordionTemplate}
 *
 *
 * @public
 * @remarks
 * Generatese the HTML Element: \<fast-accordion\>
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
