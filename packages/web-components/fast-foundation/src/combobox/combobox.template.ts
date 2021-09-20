import { html, ref, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Listbox } from "../listbox/listbox";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end";
import type { ElementDefinitionContext } from "../design-system";
import type { Combobox, ComboboxOptions } from "./combobox";

/**
 * The template for the {@link @microsoft/fast-foundation#(Combobox:class)} component.
 * @public
 */
export const comboboxTemplate: (
    context: ElementDefinitionContext,
    definition: ComboboxOptions
) => ViewTemplate<Combobox> = (
    context: ElementDefinitionContext,
    definition: ComboboxOptions
) => html`
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
            ${startSlotTemplate(context, definition)}
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
                        ${definition.indicator || ""}
                    </slot>
                </div>
            </slot>
            ${endSlotTemplate(context, definition)}
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
