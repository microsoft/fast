import type { ViewTemplate } from "@microsoft/fast-element";
import { html, slotted } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import { Listbox } from "../listbox/listbox";
import { endTemplate, startTemplate } from "../patterns/start-end";
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
        aria-activeDescendant="${x => x.ariaActiveDescendant}"
        aria-controls="${x => x.listboxId}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-expanded="${x => x.ariaExpanded}"
        aria-haspopup="listbox"
        class="${x =>
            [x.open && "open", x.disabled && "disabled", x.position]
                .filter(Boolean)
                .join(" ")}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        ?disabled="${x => x.disabled}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        role="combobox"
        tabindex="${x => (!x.disabled ? "0" : null)}"
    >
        <div class="control" part="control">
            ${startTemplate}
            <slot name="button-container">
                <div class="selected-value" part="selected-value" id="selected-value">
                    <slot name="selected-value">${x => x.displayValue}</slot>
                </div>
                <div class="indicator" part="indicator" aria-hidden="true">
                    <slot name="indicator">
                        ${definition.indicator || ""}
                    </slot>
                </div>
            </slot>
            ${endTemplate}
        </div>
        <div
            aria-activeDescendant="${x => (x.open ? x.ariaActiveDescendant : null)}"
            aria-disabled="${x => x.disabled}"
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
