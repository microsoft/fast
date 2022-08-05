import { html, ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { PickerList } from "./picker-list.js";

/**
 *
 * @public
 */
export const pickerListTemplate: FoundationElementTemplate<ViewTemplate<PickerList>> = (
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
