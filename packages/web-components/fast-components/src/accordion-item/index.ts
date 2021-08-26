import {
    AccordionItem,
    AccordionItemOptions,
    accordionItemTemplate as template,
} from "@microsoft/fast-foundation";
import { accordionItemStyles as styles } from "./accordion-item.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#AccordionItem} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#accordionItemTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-accordion-item\>
 */
export const fastAccordionItem = AccordionItem.compose<AccordionItemOptions>({
    baseName: "accordion-item",
    template,
    styles,
    collapsedIcon: `
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.44084 6.7154C2.96937 6.1766 3.35203 5.33333 4.06799 5.33333H11.9322C12.6481 5.33333 13.0308 6.1766 12.5593 6.7154L8.87809 10.9225C8.41322 11.4537 7.58689 11.4537 7.12202 10.9225L3.44084 6.7154ZM4.43528 6.33333L7.87462 10.264C7.94102 10.3399 8.05909 10.3399 8.12549 10.264L11.5648 6.33333H4.43528Z"
        />
    </svg>
    `,
    expandedIcon: `
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.44084 9.93876C2.96937 10.4776 3.35203 11.3208 4.06799 11.3208H11.9322C12.6481 11.3208 13.0308 10.4776 12.5593 9.93876L8.87809 5.73166C8.41322 5.20045 7.58689 5.20045 7.12202 5.73166L3.44084 9.93876ZM4.43528 10.3208L7.87462 6.39017C7.94102 6.31428 8.05909 6.31428 8.12549 6.39017L11.5648 10.3208H4.43528Z"
        />
    </svg>
    `,
});

/**
 * Styles for AccordionItem
 * @public
 */
export const accordionItemStyles = styles;

/**
 * Base class for Accordion item
 * @public
 */
export { AccordionItem };
