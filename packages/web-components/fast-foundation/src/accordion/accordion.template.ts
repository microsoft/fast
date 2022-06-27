import { elements, ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import type { FoundationAccordion } from "./accordion.js";

/**
 * Creates a template for the {@link @microsoft/fast-foundation#FoundationAccordion} component.
 * @public
 */
export function createAccordionTemplate(): ElementViewTemplate<FoundationAccordion> {
    return html<FoundationAccordion>`
        <template>
            <slot ${slotted({ property: "accordionItems", filter: elements() })}></slot>
        </template>
    `;
}
