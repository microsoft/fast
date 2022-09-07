import { ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import type { FASTSwitch, SwitchOptions } from "./switch.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTSwitch:class)} component.
 * @public
 */
export function switchTemplate<T extends FASTSwitch>(
    options: SwitchOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <template
            role="switch"
            aria-checked="${x => x.checked}"
            aria-disabled="${x => x.disabled}"
            aria-readonly="${x => x.readOnly}"
            tabindex="${x => (x.disabled ? null : 0)}"
            @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        >
            <label
                part="label"
                class="${x =>
                    x.defaultSlottedNodes && x.defaultSlottedNodes.length
                        ? "label"
                        : "label label__hidden"}"
            >
                <slot ${slotted("defaultSlottedNodes")}></slot>
            </label>
            <div part="control" class="control">
                <slot name="thumb">
                    ${options.thumb ?? `<div class="thumb" class="thumb"></div>`}
                </slot>
            </div>
            <span class="status-message" part="status-message">
                <span class="checked-message" part="checked-message">
                    <slot name="checked-message"></slot>
                </span>
                <span class="unchecked-message" part="unchecked-message">
                    <slot name="unchecked-message"></slot>
                </span>
            </span>
        </template>
    `;
}
