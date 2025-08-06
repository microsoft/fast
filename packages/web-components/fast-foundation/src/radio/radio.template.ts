import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html, slotted } from "@microsoft/fast-element";
import { staticallyCompose } from "../utilities/template-helpers.js";
import { whitespaceFilter } from "../utilities/whitespace-filter.js";
import type { FASTRadio, RadioOptions } from "./radio.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTRadio:class)} component.
 * @public
 */
export function radioTemplate<T extends FASTRadio>(
    options: RadioOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <template
            role="radio"
            aria-checked="${x => x.checked}"
            aria-required="${x => x.required}"
            aria-disabled="${x => x.disabled}"
            @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        >
            <div part="control" class="control">
                <slot name="checked-indicator">
                    ${staticallyCompose(options.checkedIndicator)}
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
}
