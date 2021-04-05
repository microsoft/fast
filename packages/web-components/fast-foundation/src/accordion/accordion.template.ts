import { html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Accordion } from "./accordion";

/**
 * The template for the {@link @microsoft/fast-foundation#Accordion} component.
 * @public
 */
export const AccordionTemplate: (context, definition) => ViewTemplate<Accordion> = (
    context,
    definition
) => html`
    <${context.tagFor(Accordion)}>
        <slot name="item" part="item" ${slotted("accordionItems")}></slot>
    </${context.tagFor(Accordion)}>
`;
