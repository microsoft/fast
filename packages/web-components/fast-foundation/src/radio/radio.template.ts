import { html, slotted } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Radio, RadioOptions } from "./radio.js";

/**
 * The template for the {@link @ni/fast-foundation#(Radio:class)} component.
 * @public
 */
export const radioTemplate: FoundationElementTemplate<
    ViewTemplate<Radio>,
    RadioOptions
> = (context, definition) => html`
    <template
        role="radio"
        class="${x => (x.checked ? "checked" : "")} ${x =>
            x.readOnly ? "readonly" : ""}"
        aria-checked="${x => x.checked}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${definition.checkedIndicator || ""}
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
