import { ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { ButtonOptions, FASTButton } from "./button.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTButton:class)} component.
 * @public
 */
export function buttonTemplate<T extends FASTButton>(
    options: ButtonOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
    <template
        aria-disabled="${x => x.disabled}"
        ?autofocus="${x => x.autofocus}"
        tabindex=${x => x.tabIndex ? x.tabIndex : x.disabled ? -1 : 0}
        role="button"
    >
        <button
            class="control"
            part="control"
            ?disabled="${x => x.disabled}"
            form="${x => x.formId}"
            formaction="${x => x.formaction}"
            formenctype="${x => x.formenctype}"
            formmethod="${x => x.formmethod}"
            ?formnovalidate="${x => x.formnovalidate}"
            formtarget="${x => x.formtarget}"
            name="${x => x.name}"
            type="${x => x.type}"
            value="${x => x.value}"
            role="none"
            aria-hidden="true"
            tabindex="-1"
            ${ref("control")}
        >
            ${startSlotTemplate(options)}
            <span class="content" part="content">
                <slot ${slotted("defaultSlottedContent")}></slot>
            </span>
            ${endSlotTemplate(options)}
        </button>
    </template>
    `;
}
