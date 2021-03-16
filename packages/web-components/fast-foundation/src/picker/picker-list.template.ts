import { html, ViewTemplate } from "@microsoft/fast-element";
import type { PickerList } from "./picker-list";

/**
 *
 * @public
 */
export function createPickerListTemplate(prefix: string): ViewTemplate {
    return html<PickerList>`
        <template role="list">
            <slot></slot>
        </template>
    `;
}
