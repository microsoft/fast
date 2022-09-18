import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTVirtualListItem } from "./virtual-list-item.js";

/**
 * Generates a template for the {@link @microsoft/fast-foundation#VirtualListItem} component.
 * @public
 */
export function virtualListItemTemplate<
    T extends FASTVirtualListItem
>(): ElementViewTemplate<T> {
    return html<T>`
        <template>
            <slot></slot>
        </template>
    `;
}
