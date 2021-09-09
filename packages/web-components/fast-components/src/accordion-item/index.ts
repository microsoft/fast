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
                d="M4.95681 10.998C4.14912 10.998 3.67466 10.09 4.13591 9.42698L6.76854 5.64257C7.36532 4.78469 8.63448 4.7847 9.23126 5.64257L11.8639 9.42698C12.3251 10.09 11.8507 10.998 11.043 10.998H4.95681Z"
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
