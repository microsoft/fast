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
 * Generates HTML Element: `<fast-accordion-item>`
 */
export const fastAccordionItem = AccordionItem.compose<AccordionItemOptions>({
    baseName: "accordion-item",
    template,
    styles,
    collapsedIcon: `
        <svg
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M3.44 6.72a.83.83 0 0 1 .63-1.39h7.86c.72 0 1.1.85.63 1.39l-3.68 4.2c-.47.53-1.3.53-1.76 0l-3.68-4.2Zm1-.39 3.43 3.93c.07.08.19.08.26 0l3.43-3.93H4.44Z"/>
        </svg>
    `,
    expandedIcon: `
        <svg
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M4.96 11a1 1 0 0 1-.82-1.57l2.63-3.79a1.5 1.5 0 0 1 2.46 0l2.63 3.79a1 1 0 0 1-.82 1.57H4.96Z"/>
        </svg>
    `,
});

/**
 * Base class for Accordion item
 * @public
 */
export { AccordionItem };

export { styles as accordionItemStyles };
