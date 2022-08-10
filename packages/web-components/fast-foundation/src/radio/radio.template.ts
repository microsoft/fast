import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html, slotted } from "@microsoft/fast-element";
import { whitespaceFilter } from "../utilities/whitespace-filter.js";
import type { FASTRadio, RadioOptions } from "./radio.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTRadio:class)} component.
 * @public
 */
export function radioTemplate(
    options: RadioOptions = {}
): ElementViewTemplate<FASTRadio> {
    return html`
        <template
            role="radio"
            class="${x =>
                [x.checked && "checked", x.readOnly && "readonly"]
                    .filter(Boolean)
                    .join(" ")}"
            aria-checked="${x => x.checked}"
            aria-required="${x => x.required}"
            aria-disabled="${x => x.disabled}"
            aria-readonly="${x => x.readOnly}"
            @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        >
            <div part="control" class="control">
                <slot name="checked-indicator">
                    ${options.checkedIndicator ?? ""}
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
