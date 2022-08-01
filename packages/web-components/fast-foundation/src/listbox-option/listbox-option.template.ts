import { ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { FASTListboxOption, ListboxOptionOptions } from "./listbox-option.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTListboxOption:class)} component.
 * @public
 */
export function listboxOptionTemplate(
    options: ListboxOptionOptions = {}
): ElementViewTemplate<FASTListboxOption> {
    return html<FASTListboxOption>`
        <template
            aria-checked="${x => x.ariaChecked}"
            aria-disabled="${x => x.ariaDisabled}"
            aria-posinset="${x => x.ariaPosInSet}"
            aria-selected="${x => x.ariaSelected}"
            aria-setsize="${x => x.ariaSetSize}"
            class="${x =>
                [
                    x.checked && "checked",
                    x.selected && "selected",
                    x.disabled && "disabled",
                ]
                    .filter(Boolean)
                    .join(" ")}"
            role="option"
        >
            ${startSlotTemplate(options)}
            <span class="content" part="content">
                <slot ${slotted("content")}></slot>
            </span>
            ${endSlotTemplate(options)}
        </template>
    `;
}
