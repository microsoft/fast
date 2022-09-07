import { ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { FASTListbox } from "../listbox/listbox.js";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { ComboboxOptions, FASTCombobox } from "./combobox.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTCombobox:class)} component.
 * @public
 */
export function comboboxTemplate<T extends FASTCombobox>(
    options: ComboboxOptions = {}
): ElementViewTemplate<T> {
    return html`
        <template
            aria-disabled="${x => x.ariaDisabled}"
            autocomplete="${x => x.autocomplete}"
            ?open="${x => x.open}"
            tabindex="${x => (!x.disabled ? "0" : null)}"
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
            @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        >
            <div class="control" part="control">
                ${startSlotTemplate(options)}
                <slot name="field">
                    <input
                        aria-activedescendant="${x =>
                            x.open ? x.ariaActiveDescendant : null}"
                        aria-autocomplete="${x => x.ariaAutoComplete}"
                        aria-controls="${x => x.ariaControls}"
                        aria-disabled="${x => x.ariaDisabled}"
                        aria-expanded="${x => x.ariaExpanded}"
                        aria-haspopup="listbox"
                        class="field"
                        part="field"
                        placeholder="${x => x.placeholder}"
                        role="combobox"
                        type="text"
                        ?disabled="${x => x.disabled}"
                        :value="${x => x.value}"
                        @input="${(x, c) => x.inputHandler(c.event as InputEvent)}"
                        @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}"
                        ${ref("field")}
                    />
                </slot>
                ${endSlotTemplate(options)}
                <div class="open-close-icon" part="open-close-icon" aria-hidden="true">
                    <slot name="open-close-icon">
                        ${options.openCloseIcon ?? ""}
                    </slot>
                </div>
            </div>
            <div
                class="listbox"
                id="${x => x.listboxId}"
                part="listbox"
                role="listbox"
                ?disabled="${x => x.disabled}"
                ?hidden="${x => !x.open}"
                ${ref("listbox")}
            >
                <slot
                    ${slotted({
                        filter: FASTListbox.slottedOptionFilter,
                        flatten: true,
                        property: "slottedOptions",
                    })}
                ></slot>
            </div>
        </template>
    `;
}
