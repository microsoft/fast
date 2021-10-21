import { html, ref, slotted, when } from "@microsoft/fast-element";
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
> = (context, definition) => html<Select>`
    <template
        class="${x =>
            [
                x.collapsible && "collapsible",
                x.collapsible && x.open && "open",
                x.disabled && "disabled",
                x.collapsible && x.position,
            ]
                .filter(Boolean)
                .join(" ")}"
        role="${x => x.role}"
        tabindex="${x => (!x.disabled ? "0" : null)}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-expanded="${x => (x.collapsible ? x.ariaExpanded : null)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @focusin="${(x, c) => x.focusinHandler(c.event as FocusEvent)}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        @mousedown="${(x, c) => x.mousedownHandler(c.event as MouseEvent)}"
    >
        ${when(
            x => x.collapsible,
            html<Select>`
                <div
                    aria-activedescendant="${x =>
                        x.open ? x.ariaActiveDescendant : null}"
                    aria-controls="listbox"
                    aria-expanded="${x => x.ariaExpanded}"
                    aria-multiselectable="${x => x.ariaMultiselectable}"
                    aria-haspopup="listbox"
                    class="control"
                    part="control"
                    role="button"
                    ?disabled="${x => x.disabled}"
                    ${ref("control")}
                >
                    ${startSlotTemplate(context, definition)}
                    <slot name="button-container">
                        <div
                            class="selected-value"
                            part="selected-value"
                            ${ref("selectedValue")}
                        >
                            <slot name="selected-value">${x => x.displayValue}</slot>
                        </div>
                        <div class="indicator" part="indicator" ${ref("indicator")}>
                            <slot name="indicator">
                                ${definition.indicator || ""}
                            </slot>
                        </div>
                    </slot>
                    ${endSlotTemplate(context, definition)}
                </div>
            `
        )}
        <div
            aria-disabled="${x => x.disabled}"
            class="listbox"
            id="listbox"
            part="listbox"
            role="listbox"
            ?disabled="${x => x.disabled}"
            ?hidden="${x => x.collapsible && !x.open}"
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
