import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import type { FoundationElementDefinition } from "../foundation-element";
import type { Accordion } from "./accordion";

/**
 * The template for the {@link @microsoft/fast-foundation#Accordion} component.
 * @public
 */
export const accordionTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Accordion> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => /* TODO: deprecate slot name `item` to only support default slot https://github.com/microsoft/fast/issues/5515 */ html`
    <template>
        <slot ${slotted({ property: "accordionItems", filter: elements() })}></slot>
        <slot name="item" part="item" ${slotted("accordionItems")}></slot>
    </template>
`;
