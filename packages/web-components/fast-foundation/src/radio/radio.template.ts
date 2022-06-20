import type { ViewTemplate } from "@microsoft/fast-element";
import { html, slotted } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import { whitespaceFilter } from "../utilities/whitespace-filter.js";
import type { Radio, RadioOptions } from "./radio.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(Radio:class)} component.
 * @public
 */
export const radioTemplate: FoundationElementTemplate<
    ViewTemplate<Radio>,
    RadioOptions
> = (context, definition) => html`
    <template
        role="radio"
        class="${x =>
            [x.checked && "checked", x.readOnly && "readonly"].filter(Boolean).join(" ")}"
        aria-checked="${x => x.checked}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${definition.checkedIndicator ?? ""}
            </slot>
        </div>
        <label
            part="label"
            class="${x =>
                ["label", !x.defaultSlottedNodes?.length && "label__hidden"]
                    .filter(Boolean)
                    .join(" ")}"
        >
            <slot
                ${slotted({
                    property: "defaultSlottedNodes",
                    filter: whitespaceFilter,
                })}
            ></slot>
        </label>
    </template>
`;
