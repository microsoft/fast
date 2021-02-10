import { customElement, html, ViewTemplate } from "@microsoft/fast-element";
import {
    createPickerMenuTemplate,
    createPickerTemplate,
    PickerMenu,
} from "@microsoft/fast-foundation";
import { PeoplePickerStyles as pickerStyles } from "./people-picker.styles";
import { PeoplePickerMenuStyles as pickerMenuStyles } from "./people-picker-menu.styles";
import { PeoplePicker } from "./people-picker";

function createItemTemplate(): ViewTemplate {
    return html`
        <button role="listitem" tabindex="0">
            ${x => x}
        </button>
    `;
}

function createOptionTemplate(): ViewTemplate {
    return html`
        <button
            role="listitem"
            tabindex="-1"
            @click="${(x, c) => c.parent.handleOptionClick(c.event as MouseEvent)}"
        >
            ${x => x}
        </button>
    `;
}

/**
 * The FAST People Picker Custom Element. Implements {@link @microsoft/fast-foundation#PeoplePicker},
 * {@link @microsoft/fast-foundation#PeoplePickerTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-people-picker\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
@customElement({
    name: "fast-people-picker",
    template: createPickerTemplate(
        "fast",
        "people",
        createItemTemplate(),
        createOptionTemplate()
    ),
    styles: pickerStyles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTPeoplePicker extends PeoplePicker {}

/**
 * Styles for PeoplePickerMenu
 * @public
 */
export const PeoplePickerStyles = pickerStyles;

/**
 *
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-people-picker-menu\>
 *
 */
@customElement({
    name: "fast-people-picker-menu",
    template: createPickerMenuTemplate("fast"),
    styles: pickerMenuStyles,
})
export class FASTPeoplePickerMenu extends PickerMenu {}

/**
 * Styles for PeoplePickerMenu
 * @public
 */
export const PeoplePickerMenuStyles = pickerMenuStyles;
