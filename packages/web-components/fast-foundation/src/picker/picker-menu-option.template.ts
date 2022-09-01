import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTPickerMenuOption } from "./picker-menu-option.js";

/**
 *
 * @public
 */
export function pickerMenuOptionTemplate<
    T extends FASTPickerMenuOption
>(): ElementViewTemplate<T> {
    return html<T>`
        <template
            role="listitem"
            tabindex="-1"
            @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
        >
            <slot></slot>
        </template>
    `;
}
