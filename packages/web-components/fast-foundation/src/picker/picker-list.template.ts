import {
    children,
    elements,
    html,
    ref,
    slotted,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import { PickerList } from "./picker-list";

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
