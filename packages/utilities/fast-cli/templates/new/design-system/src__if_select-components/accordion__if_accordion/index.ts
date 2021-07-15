import { Accordion, accordionTemplate as template } from "@microsoft/fast-foundation";
import { accordionStyles as styles } from "./accordion.styles";

export * from "../accordion-item/index";

/**
 * A function that returns a Accordion registration for configuring the component with a DesignSystem.
 * Implements Accordion
 * @public
 * Generates HTML Element: \</* @echo namespace */-accordion\>
 */
export const /* @echo namespace*/Accordion = Accordion.compose({
    baseName: "accordion",
    template,
    styles,
});

/**
 * Styles for Accordion
 * @public
 */
export const accordionStyles = styles;

/**
 * Base class for Accordion
 * @public
 */
export { Accordion };
