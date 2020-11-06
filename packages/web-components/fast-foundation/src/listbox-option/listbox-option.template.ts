import { html } from "@microsoft/fast-element";
import { ListboxOption } from "./listbox-option";

/**
 * The template for the {@link @microsoft/fast-foundation#(ListboxOption:class)} component.
 * @public
 */
export const ListboxOptionTemplate = html<ListboxOption>`
    <template
        aria-selected="${x => (x.selected ? true : false)}"
        class="${x => (x.selected ? "selected" : "")} ${x =>
            x.disabled ? "disabled" : ""}"
        role="${x => x.role}"
    >
        <span class="content" part="content">
            <slot></slot>
        </span>
    </template>
`;
