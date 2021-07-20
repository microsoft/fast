import { html, ViewTemplate } from "@microsoft/fast-element";
import type { PickerListItem } from "./picker-list-item";

/**
 *
 * @public
 */
export const pickerListItemTemplate: (
    context,
    definition
) => ViewTemplate<PickerListItem> = (context, definition) => {
    return html<PickerListItem>`
        <template
            role="listitem"
            tabindex="0"
            @click="${(x, c) => x.handleItemClick(c.event as MouseEvent)}"
            @keydown="${(x, c) => x.handleItemKeyDown(c.event as KeyboardEvent)}"
        >
            <slot></slot>
        </template>
    `;
};
