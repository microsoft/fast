import { html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Radio } from "./radio";

/**
 * The template for the {@link @microsoft/fast-foundation#(Radio:class)} component.
 * @public
 */
export const RadioTemplate: ViewTemplate<Radio> = html`
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
                <div part="checked-indicator" class="checked-indicator"></div>
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
