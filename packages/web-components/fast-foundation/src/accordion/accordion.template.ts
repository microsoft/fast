import { html, slotted } from "@microsoft/fast-element";
import { Accordion } from "./accordion";

/**
 * The template for the {@link @microsoft/fast-foundation#Accordion} component.
 * @public
 */
export const AccordionTemplate = html<Accordion>`
    <template>
        <slot name="item" part="item" ${slotted("accordionItems")}></slot>
    </template>
`;
