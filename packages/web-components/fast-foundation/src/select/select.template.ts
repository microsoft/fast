import { ElementViewTemplate, html, ref, slotted, when } from "@microsoft/fast-element";
import { FASTListbox } from "../listbox/listbox.js";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { FASTSelect, SelectOptions } from "./select.js";

const openIcon = `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 1 1 .7.7l-3.5 3.5a.5.5 0 0 1-.7 0l-3.5-3.5a.5.5 0 0 1 0-.7Z"/>
</svg>`;

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
                        <slot name="control">
                            <div class="selected-value" part="selected-value">
                                <slot name="selected-value">${x => x.displayValue}</slot>
                            </div>
                        </slot>
                        ${endSlotTemplate(options)}
                        <div aria-hidden="true" class="open-icon" part="open-icon">
                            <slot name="open-icon">
                                ${options.openIcon || openIcon}
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
