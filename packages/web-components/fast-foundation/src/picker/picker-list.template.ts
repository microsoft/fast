import { html, ViewTemplate } from "@microsoft/fast-element";
import type { PickerList } from "./picker-list";

/**
 *
 * @public
 */
 export const pickerListTemplate: (context, definition) => ViewTemplate<PickerList> = (
    context,
    definition
) => {
    return html<PickerList>`
        <template role="list">
            <slot></slot>
        </template>
    `;
}
