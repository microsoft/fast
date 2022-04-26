import { html, ViewTemplate, when } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/index.js";
import type { VirtualListItem } from "./virtual-list-item.js";

/**
 * The template for the {@link @microsoft/fast-foundation#VirtualListItem} component.
 * @public
 */
export const virtualListItemTemplate: FoundationElementTemplate<ViewTemplate<
    VirtualListItem
>> = (context, definition) => {
    return html<VirtualListItem>`
        <template>
            <slot></slot>
        </template>
    `;
};
