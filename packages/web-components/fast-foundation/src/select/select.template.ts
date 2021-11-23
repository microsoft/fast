import { html, ref, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import { Listbox } from "../listbox/listbox";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end";
import type { Select, SelectOptions } from "./select";

/**
 * The template for the {@link @microsoft/fast-foundation#(Select:class)} component.
 * @public
 */
export const selectTemplate: FoundationElementTemplate<
    ViewTemplate<Select>,
    SelectOptions
> = (context, definition) => html`
    <template
        class="${x => (x.open ? "open" : "")} ${x =>
            x.disabled ? "disabled" : ""} ${x => x.position}"
        role="combobox"
        tabindex="${x => (!x.disabled ? "0" : null)}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-expanded="${x => x.ariaExpanded}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
    >
        <div
            aria-activedescendant="${x => (x.open ? x.ariaActiveDescendant : null)}"
            aria-controls="listbox"
            aria-haspopup="listbox"
            class="control"
            part="control"
            role="button"
            ?disabled="${x => x.disabled}"
        >
            ${startSlotTemplate(context, definition)}
            <slot name="button-container">
                <div class="selected-value" part="selected-value">
                    <slot name="selected-value">${x => x.displayValue}</slot>
                </div>
                <div class="indicator" part="indicator">
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
            id="listbox"
            part="listbox"
            role="listbox"
            ?disabled="${x => x.disabled}"
            ?hidden="${x => !x.open}"
            ${ref("listbox")}
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
