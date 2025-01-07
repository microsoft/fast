import { elements, html, slotted } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Accordion } from "./accordion.js";

/**
 * The template for the {@link @ni/fast-foundation#Accordion} component.
 * @public
 */
export const accordionTemplate: FoundationElementTemplate<ViewTemplate<Accordion>> = (
    context,
    definition
) => /* TODO: deprecate slot name `item` to only support default slot https://github.com/microsoft/fast/issues/5515 */ html`
    <template>
        <slot ${slotted({ property: "accordionItems", filter: elements() })}></slot>
        <slot name="item" part="item" ${slotted("accordionItems")}></slot>
    </template>
`;
