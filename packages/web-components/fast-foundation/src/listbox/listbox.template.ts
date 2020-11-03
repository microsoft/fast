import { html, slotted } from "@microsoft/fast-element";
import { Listbox } from "./listbox";

/**
 * The template for the {@link @microsoft/fast-foundation#(Listbox:class)} component.
 * @public
 */
export const ListboxTemplate = html<Listbox>`
    <template
        aria-activedescendent="${x => x.ariaActiveDescendant}"
        aria-disabled="${x => x.disabled}"
        class="listbox ${x => (x.disabled ? "disabled" : "")}"
        role="listbox"
        tabindex="${x => (!x.disabled ? "0" : null)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @focusin="${(x, c) => x.focusinHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
    >
        <slot
            ${slotted({
                filter: Listbox.slottedOptionFilter,
                flatten: true,
                property: "options",
            })}
        ></slot>
    </template>
`;
