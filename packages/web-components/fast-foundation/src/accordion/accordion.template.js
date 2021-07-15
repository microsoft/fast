import { html, slotted } from "@microsoft/fast-element";
/**
 * The template for the {@link @microsoft/fast-foundation#Accordion} component.
 * @public
 */
export const accordionTemplate = (context, definition) => html`
    <template>
        <slot name="item" part="item" ${slotted("accordionItems")}></slot>
    </template>
`;
