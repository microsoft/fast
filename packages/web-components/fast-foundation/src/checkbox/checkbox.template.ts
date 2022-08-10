import { ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import type { CheckboxOptions, FASTCheckbox } from "./checkbox.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTCheckbox:class)} component.
 * @public
 */
export function checkboxTemplate(
    options: CheckboxOptions = {}
): ElementViewTemplate<FASTCheckbox> {
    return html<FASTCheckbox>`
        <template
            role="checkbox"
            aria-checked="${x => x.checked}"
            aria-required="${x => x.required}"
            aria-disabled="${x => x.disabled}"
            aria-readonly="${x => x.readOnly}"
            tabindex="${x => (x.disabled ? null : 0)}"
            @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            class="${x => (x.readOnly ? "readonly" : "")} ${x =>
                x.checked ? "checked" : ""} ${x =>
                x.indeterminate ? "indeterminate" : ""}"
        >
            <div part="control" class="control">
                <slot name="checked-indicator">
                    ${options.checkedIndicator || ""}
                </slot>
                <slot name="indeterminate-indicator">
                    ${options.indeterminateIndicator || ""}
                </slot>
            </div>
            <label
                part="label"
                class="${x =>
                    x.defaultSlottedNodes && x.defaultSlottedNodes.length
                        ? "label"
                        : "label label__hidden"}"
            >
                <slot ${slotted("defaultSlottedNodes")}></slot>
            </label>
        </template>
    `;
}
