import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTDataListItem } from "./data-list-item.js";

/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataListItem} component.
 * @public
 */
export function dataListItemTemplate(): ElementViewTemplate<FASTDataListItem> {
    return html<FASTDataListItem>`
        <template>
            <slot></slot>
        </template>
    `;
}
