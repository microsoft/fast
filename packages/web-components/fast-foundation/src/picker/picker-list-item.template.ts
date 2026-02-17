import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html } from "@microsoft/fast-element";
import type { FASTPickerListItem } from "./picker-list-item.js";

/**
 *
 * @public
 */
export function pickerListItemTemplate<
    T extends FASTPickerListItem
>(): ElementViewTemplate<T> {
    return html<T>`
        <template
            role="listitem"
            tabindex="0"
            disabled="${(x, c) => (x.pickerContext.disabled === true ? true : void 0)}"
            @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
            @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
        >
            <slot></slot>
        </template>
    `;
}
