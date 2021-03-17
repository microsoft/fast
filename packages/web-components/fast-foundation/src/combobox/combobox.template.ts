import { html, ref, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Listbox } from "../listbox/listbox";
import { endTemplate, startTemplate } from "../patterns/start-end";
import type { Combobox } from "./combobox";

/**
 * The template for the {@link @microsoft/fast-foundation#(Combobox:class)} component.
 * @public
 */
export const ComboboxTemplate: ViewTemplate<Combobox> = html`
    <template
        autocomplete="${x => x.autocomplete}"
        class="${x => (x.disabled ? "disabled" : "")} ${x => x.position}"
        tabindex="${x => (!x.disabled ? "0" : null)}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-autocomplete="${x => x.autocomplete}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
    >
        <div class="control" part="control">
            ${startTemplate}
            <slot name="control">
                <input
                    class="selected-value"
                    part="selected-value"
                    placeholder="${x => x.placeholder}"
                    role="${x => x.role}"
                    type="text"
                    aria-activedescendant="${x =>
                        x.open ? x.ariaActiveDescendant : null}"
                    aria-controls="${x => x.listboxId}"
                    aria-expanded="${x => x.ariaExpanded}"
                    aria-haspopup="listbox"
                    ?disabled="${x => x.disabled}"
                    :value="${x => x.value}"
                    @input="${(x, c) => x.inputHandler(c.event as InputEvent)}"
                    @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
                    @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}"
                    ${ref("control")}
                />
                <div class="indicator" part="indicator" aria-hidden="true">
                    <slot name="indicator">
                        <svg
                            class="select-indicator"
                            part="select-indicator"
                            viewBox="0 0 12 7"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"
                            />
                        </svg>
                    </slot>
                </div>
            </slot>
            ${endTemplate}
        </div>
        <div
            aria-disabled="${x => x.disabled}"
            class="listbox"
            id="${x => x.listboxId}"
            part="listbox"
            role="listbox"
            style="--max-height: ${x => x.maxHeight}px"
            ?disabled="${x => x.disabled}"
            ?hidden="${x => !x.open}"
        >
            <slot
                ${slotted({
                    filter: Listbox.slottedOptionFilter,
                    flatten: true,
                    property: "slottedOptions",
                })}
            ></slot>
        </div>
    </template>
`;
