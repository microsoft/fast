import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTPickerList } from "./picker-list.js";

/**
 *
 * @public
 */
export function pickerListTemplate<T extends FASTPickerList>(): ElementViewTemplate<T> {
    return html<T>`
        <template slot="list-region" role="list">
            <slot></slot>
            <slot name="input-region"></slot>
        </template>
    `;
}
