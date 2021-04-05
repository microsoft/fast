import { html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Accordion } from "./accordion";

/**
 * The template for the {@link @microsoft/fast-foundation#Accordion} component.
 * @public
 */
export const AccordionTemplate: ViewTemplate<Accordion> = html`
    <template>
        <slot name="item" part="item" ${slotted("accordionItems")}></slot>
    </template>
`;
