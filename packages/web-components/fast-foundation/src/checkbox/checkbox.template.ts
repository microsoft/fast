import { html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Checkbox, CheckboxOptions } from "./checkbox.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(Checkbox:class)} component.
 * @public
 */
export const checkboxTemplate: FoundationElementTemplate<
    ViewTemplate<Checkbox>,
    CheckboxOptions
> = (context, definition) => html`
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
            x.checked ? "checked" : ""} ${x => (x.indeterminate ? "indeterminate" : "")}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${definition.checkedIndicator || ""}
            </slot>
            <slot name="indeterminate-indicator">
                ${definition.indeterminateIndicator || ""}
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
