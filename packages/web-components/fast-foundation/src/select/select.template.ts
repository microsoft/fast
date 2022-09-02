import { ElementViewTemplate, html, ref, slotted, when } from "@microsoft/fast-element";
import { FASTListbox } from "../listbox/listbox.js";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { FASTSelect, SelectOptions } from "./select.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTSelect:class)} component.
 * @public
 */
export function selectTemplate<T extends FASTSelect>(
    options: SelectOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
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
            aria-activedescendant="${x => x.ariaActiveDescendant}"
            aria-controls="${x => x.ariaControls}"
            aria-disabled="${x => x.ariaDisabled}"
            aria-expanded="${x => x.ariaExpanded}"
            aria-haspopup="${x => (x.collapsible ? "listbox" : null)}"
            aria-multiselectable="${x => x.ariaMultiSelectable}"
            ?open="${x => x.open}"
            role="combobox"
            tabindex="${x => (!x.disabled ? "0" : null)}"
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            @focusin="${(x, c) => x.focusinHandler(c.event as FocusEvent)}"
            @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
            @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
            @mousedown="${(x, c) => x.mousedownHandler(c.event as MouseEvent)}"
        >
            ${when(
                x => x.collapsible,
                html<T>`
                    <div
                        class="control"
                        part="control"
                        ?disabled="${x => x.disabled}"
                        ${ref("control")}
                    >
                        ${startSlotTemplate(options)}
                        <div class="field" part="field">
                            <slot name="field">${x => x.displayValue}</slot>
                        </div>
                        ${endSlotTemplate(options)}
                        <div
                            class="open-close-icon"
                            part="open-close-icon"
                            aria-hidden="true"
                        >
                            <slot name="open-close-icon">
                                ${options.openCloseIcon ?? ""}
                            </slot>
                        </div>
                    </div>
                `
            )}
            <div
                class="listbox"
                id="${x => x.listboxId}"
                part="listbox"
                role="listbox"
                ?disabled="${x => x.disabled}"
                ?hidden="${x => (x.collapsible ? !x.open : false)}"
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
