import {
    children,
    elements,
    html,
    ref,
    slotted,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import { PickerInput } from "./picker-input";

/**
 *
 * @public
 */
export function createPickerInputTemplate(prefix: string): ViewTemplate {
    return html<PickerInput>`
        <template
            role="combobox"
            type="text"
            autocapitalize="off"
            autocomplete="off"
            aria-autocomplete="both"
            aria-haspopup="true"
            aria-label="TODO"
            aria-haspopup="true"
            aria-label="TODO"
        >
            <input part="input-element" />
        </template>
    `;
}
