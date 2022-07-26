import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTPickerListItem } from "./picker-list-item.js";

/**
 *
 * @public
 */
export function pickerListItemTemplate(): ElementViewTemplate<FASTPickerListItem> {
    return html<FASTPickerListItem>`
        <template
            role="listitem"
            tabindex="0"
            @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
            @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
        >
            <slot></slot>
        </template>
    `;
}
