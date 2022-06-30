import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTPickerList } from "./picker-list.js";

/**
 *
 * @public
 */
export function pickerListTemplate(): ElementViewTemplate<FASTPickerList> {
    return html<FASTPickerList>`
        <template slot="list-region" role="list" class="picker-list">
            <slot></slot>
            <slot name="input-region"></slot>
        </template>
    `;
}
