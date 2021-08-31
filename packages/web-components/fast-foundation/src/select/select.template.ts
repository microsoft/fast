import { html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Listbox } from "../listbox/listbox";
import { endTemplate, startTemplate } from "../patterns/start-end";
import type { ElementDefinitionContext } from "../design-system";
import type { Select, SelectOptions } from "./select";

/**
 * The template for the {@link @microsoft/fast-foundation#(Select:class)} component.
 * @public
 */
export const selectTemplate: (
    context: ElementDefinitionContext,
    definition: SelectOptions
) => ViewTemplate<Select> = (
    context: ElementDefinitionContext,
    definition: SelectOptions
) => html`
    <template
        class="${x => (x.open ? "open" : "")} ${x =>
            x.disabled ? "disabled" : ""} ${x => x.position}"
        role="${x => x.role}"
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
            aria-expanded="${x => x.ariaExpanded}"
            aria-haspopup="listbox"
            class="control"
            part="control"
            role="button"
            ?disabled="${x => x.disabled}"
        >
            ${startTemplate(context, definition)}
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
            ${endTemplate(context, definition)}
        </div>
        <div
            aria-disabled="${x => x.disabled}"
            class="listbox"
            id="listbox"
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
