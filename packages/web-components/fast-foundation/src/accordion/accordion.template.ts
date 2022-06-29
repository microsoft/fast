import { elements, ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import type { FASTAccordion } from "./accordion.js";

/**
 * Creates a template for the {@link @microsoft/fast-foundation#FASTAccordion} component.
 * @public
 */
export function accordionTemplate(): ElementViewTemplate<FASTAccordion> {
    return html<FASTAccordion>`
        <template>
            <slot ${slotted({ property: "accordionItems", filter: elements() })}></slot>
        </template>
    `;
}
