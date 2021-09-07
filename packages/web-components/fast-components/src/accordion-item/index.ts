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
                d="M4.13591 6.57107C3.67466 5.90803 4.14912 5 4.95681 5H11.043C11.8507 5 12.3251 5.90803 11.8639 6.57106L9.23126 10.3555C8.63448 11.2133 7.36532 11.2134 6.76854 10.3555L4.13591 6.57107ZM4.95681 6L7.58945 9.78442C7.78837 10.0704 8.21143 10.0704 8.41035 9.78442L11.043 6L4.95681 6Z"
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
                d="M4.13591 9.42698C3.67466 10.09 4.14912 10.998 4.95681 10.998H11.043C11.8507 10.998 12.3251 10.09 11.8639 9.42698L9.23126 5.64257C8.63448 4.7847 7.36532 4.78469 6.76854 5.64257L4.13591 9.42698ZM4.95681 9.99805L7.58945 6.21363C7.78837 5.92767 8.21143 5.92767 8.41035 6.21363L11.043 9.99805L4.95681 9.99805Z"
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
