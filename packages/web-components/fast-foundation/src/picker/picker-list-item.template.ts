import { html, ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { PickerListItem } from "./picker-list-item.js";

/**
 *
 * @public
 */
export const pickerListItemTemplate: FoundationElementTemplate<ViewTemplate<
    PickerListItem
>> = (context, definition) => {
    return html<PickerListItem>`
        <template
            role="listitem"
            tabindex="0"
            @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
            @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
        >
            <slot></slot>
        </template>
    `;
};
