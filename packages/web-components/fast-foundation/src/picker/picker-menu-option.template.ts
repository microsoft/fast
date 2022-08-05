import { html, ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { PickerMenuOption } from "./picker-menu-option.js";

/**
 *
 * @public
 */
export const pickerMenuOptionTemplate: FoundationElementTemplate<ViewTemplate<
    PickerMenuOption
>> = (context, definition) => {
    return html<PickerMenuOption>`
        <template
            role="listitem"
            tabindex="-1"
            @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
        >
            <slot></slot>
        </template>
    `;
};
