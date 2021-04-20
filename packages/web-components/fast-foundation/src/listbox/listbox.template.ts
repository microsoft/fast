import { html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Listbox } from "./listbox";

/**
 * The template for the {@link @microsoft/fast-foundation#(Listbox:class)} component.
 * @public
 */
export const listboxTemplate: (context, definition) => ViewTemplate<Listbox> = (
    context,
    definition
) => html`
    <template
        aria-activedescendant="${x => x.ariaActiveDescendant}"
        class="listbox"
        role="${x => x.role}"
        tabindex="${x => (!x.disabled ? "0" : null)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @focusin="${(x, c) => x.focusinHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        @mousedown="${(x, c) => x.mousedownHandler(c.event as MouseEvent)}"
    >
        <slot
            ${slotted({
                filter: Listbox.slottedOptionFilter,
                flatten: true,
                property: "slottedOptions",
            })}
        ></slot>
    </template>
`;
