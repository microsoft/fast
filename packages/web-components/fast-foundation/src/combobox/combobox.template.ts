import { ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { FASTListbox } from "../listbox/listbox.js";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { ComboboxOptions, FASTCombobox } from "./combobox.js";

const openIcon = `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 1 1 .7.7l-3.5 3.5a.5.5 0 0 1-.7 0l-3.5-3.5a.5.5 0 0 1 0-.7Z"/>
</svg>`;

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
            class="${x => (x.open ? "open" : "")} ${x =>
                x.disabled ? "disabled" : ""} ${x => x.position}"
            ?open="${x => x.open}"
            tabindex="${x => (!x.disabled ? "0" : null)}"
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
            @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        >
            <div class="control" part="control">
                ${startSlotTemplate(options)}
                <slot name="control">
                    <input
                        aria-activedescendant="${x =>
                            x.open ? x.ariaActiveDescendant : null}"
                        aria-autocomplete="${x => x.ariaAutoComplete}"
                        aria-controls="${x => x.ariaControls}"
                        aria-disabled="${x => x.ariaDisabled}"
                        aria-expanded="${x => x.ariaExpanded}"
                        aria-haspopup="listbox"
                        class="selected-value"
                        part="selected-value"
                        placeholder="${x => x.placeholder}"
                        role="combobox"
                        type="text"
                        ?disabled="${x => x.disabled}"
                        :value="${x => x.value}"
                        @input="${(x, c) => x.inputHandler(c.event as InputEvent)}"
                        @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}"
                        ${ref("control")}
                    />
                </slot>
                ${endSlotTemplate(options)}
                <div class="open-icon" part="open-icon" aria-hidden="true">
                    <slot name="open-icon">
                        ${options.openIcon || openIcon}
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
