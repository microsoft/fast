import { html, ref, ViewTemplate } from "@microsoft/fast-element";
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
        <template slot="list-region" role="list" class="picker-list">
            <slot></slot>
            <slot name="input-region"></slot>
        </template>
    `;
};
