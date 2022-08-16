import { elements, ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import type { FASTAccordion } from "./accordion.js";

/**
 * Creates a template for the {@link @microsoft/fast-foundation#FASTAccordion} component.
 * @public
 */
export function accordionTemplate<T extends FASTAccordion>(): ElementViewTemplate<T> {
    return html<T>`
        <slot ${slotted({ property: "accordionItems", filter: elements() })}></slot>
    `;
}
