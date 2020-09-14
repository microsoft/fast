
import { html, slotted } from "@microsoft/fast-element";
import { Listbox } from "./listbox";

export const ListboxTemplate = html<Listbox>`
    <template>
        <slot></slot>
    </template>
`;