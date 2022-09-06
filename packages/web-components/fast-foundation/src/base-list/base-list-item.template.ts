import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTBaseListItem } from "./base-list-item.js";

/**
 * Generates a template for the {@link @microsoft/fast-foundation#BaseListItem} component.
 * @public
 */
export function baseListItemTemplate(): ElementViewTemplate<FASTBaseListItem> {
    return html<FASTBaseListItem>`
        <template>
            <slot></slot>
        </template>
    `;
}
