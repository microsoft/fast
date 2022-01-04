import { html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import type {
    FoundationElementDefinition,
    FoundationElementTemplate,
} from "../foundation-element";
import type { Accordion } from "./accordion";

/**
 * The template for the {@link @microsoft/fast-foundation#Accordion} component.
 * @public
 */
export const accordionTemplate: FoundationElementTemplate<ViewTemplate<Accordion>> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template>
        <slot name="item" part="item" ${slotted("accordionItems")}></slot>
    </template>
`;
