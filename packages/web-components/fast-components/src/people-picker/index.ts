import { customElement, html, ViewTemplate } from "@microsoft/fast-element";
import {
    createPickerListTemplate,
    createPickerMenuTemplate,
    createPickerTemplate,
    createPickerInputTemplate,
    PickerInput,
    PickerList,
    PickerMenu,
} from "@microsoft/fast-foundation";
import { PeoplePickerStyles as pickerStyles } from "./people-picker.styles";
import { PeoplePickerInputStyles as pickerInputStyles } from "./people-picker-input.styles";
import { PeoplePickerMenuStyles as pickerMenuStyles } from "./people-picker-menu.styles";
import { PeoplePickerListStyles as pickerListStyles } from "./people-picker-list.styles";
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
})
export class FASTPeoplePicker extends PeoplePicker {}

/**
 * Styles for PeoplePicker
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

/**
 *
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-people-picker-list\>
 *
 */
@customElement({
    name: "fast-people-picker-list",
    template: createPickerListTemplate("fast"),
    styles: pickerListStyles,
})
export class FASTPeoplePickerList extends PickerList {}

/**
 * Styles for PeoplePickerList
 * @public
 */
export const PeoplePickerListStyles = pickerListStyles;

/**
 *
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-people-picker-input\>
 *
 */
@customElement({
    name: "fast-people-picker-input",
    template: createPickerInputTemplate("fast"),
    styles: pickerInputStyles,
})
export class FASTPeoplePickerInput extends PickerInput {}

/**
 * Styles for PeoplePickerInput
 * @public
 */
export const PeoplePickerInputStyles = pickerInputStyles;
