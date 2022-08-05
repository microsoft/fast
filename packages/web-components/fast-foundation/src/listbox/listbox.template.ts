import { html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import { ListboxElement } from "./listbox.element.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(Listbox:class)} component.
 * @public
 */
export const listboxTemplate: FoundationElementTemplate<ViewTemplate<ListboxElement>> = (
    context,
    definition
) => html`
    <template
        aria-activedescendant="${x => x.ariaActiveDescendant}"
        aria-multiselectable="${x => x.ariaMultiSelectable}"
        class="listbox"
        role="listbox"
        tabindex="${x => (!x.disabled ? "0" : null)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @focusin="${(x, c) => x.focusinHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        @mousedown="${(x, c) => x.mousedownHandler(c.event as MouseEvent)}"
    >
        <slot
            ${slotted({
                filter: ListboxElement.slottedOptionFilter,
                flatten: true,
                property: "slottedOptions",
            })}
        ></slot>
    </template>
`;
