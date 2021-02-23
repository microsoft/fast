import {
    children,
    elements,
    html,
    ref,
    slotted,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import { PickerMenu } from "./picker-menu";

/**
 * The template for the List Picker component.
 * @public
 */
export function createPickerMenuTemplate(prefix: string): ViewTemplate {
    return html<PickerMenu>`
        <template role="list" aria-label="choose a recipient">
            <div class="options-display" part="options-display">
                <div class="header-region" part="header-region">
                    <slot name="header-region" ${slotted("headerElements")}></slot>
                </div>

                <slot ${slotted("menuElements")}></slot>

                <div class="footer-region" part="footer-region">
                    <slot name="footer-region" ${slotted("footerElements")}></slot>
                </div>
                <div
                    role="alert"
                    aria-live="polite"
                    part="suggestions-available-alert"
                    class="suggestions-available-alert"
                >
                    People suggestions available
                </div>
            </div>
            <div class="no-options-display" part="no-options-display">
                <slot name="no-options-region"></slot>
                <div
                    role="alert"
                    aria-live="polite"
                    part="no-suggestions-available-alert"
                    class="no-suggestions-available-alert"
                >
                    No suggestions available
                </div>
            </div>
        </template>
    `;
}
