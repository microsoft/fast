import { html, ref, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Listbox } from "../listbox/listbox";
import { endTemplate, startTemplate } from "../patterns/start-end";
import type { Combobox, ComboboxOptions } from "./combobox";
import type { ElementDefinitionContext } from "../design-system";

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
        class="${x => [x.disabled && "disabled", x.position].filter(Boolean).join(" ")}"
        autocomplete="${x => x.autocomplete}"
        tabindex="${x => (!x.disabled ? "0" : null)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
        @focusin="${(x, c) => x.focusinHandler(c.event as FocusEvent)}"
    >
        <div class="control" part="control" role="presentation">
            ${startTemplate}
            <slot name="control">
                <input
                    aria-activedescendant="${x =>
                        x.open ? x.ariaActiveDescendant : null}"
                    aria-autocomplete="${x => x.autocomplete}"
                    aria-controls="${x => x.listboxId}"
                    aria-expanded="${x => x.ariaExpanded}"
                    aria-haspopup="listbox"
                    class="selected-value"
                    ?disabled="${x => x.disabled}"
                    id="selected-value"
                    part="selected-value"
                    placeholder="${x => x.placeholder}"
                    role="combobox"
                    type="text"
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
            ${endTemplate}
        </div>
        <div
            aria-expanded="${x => x.ariaExpanded}"
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
