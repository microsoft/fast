import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Accordion } from "./accordion.js";

/**
 * The template for the {@link @microsoft/fast-foundation#Accordion} component.
 * @public
 */
export const accordionTemplate: FoundationElementTemplate<ViewTemplate<Accordion>> = (
    context,
    definition
) => html`
    <template>
        <slot ${slotted({ property: "accordionItems", filter: elements() })}></slot>
        <slot ${slotted("accordionItems")}></slot>
    </template>
`;
