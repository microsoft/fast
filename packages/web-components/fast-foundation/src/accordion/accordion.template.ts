import { html, slotted } from "@microsoft/fast-element";
import { Accordion } from "./accordion";

export const AccordionTemplate = html<Accordion>`
    <template>
        <slot name="item" part="item" ${slotted("accordionItems")}></slot>
    </template>
`;
