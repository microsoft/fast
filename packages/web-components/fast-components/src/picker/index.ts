import { customElement, html, ViewTemplate } from "@microsoft/fast-element";
import {
    createPickerListTemplate,
    createPickerMenuTemplate,
    createPickerTemplate,
    Picker,
    PickerList,
    PickerMenu,
} from "@microsoft/fast-foundation";
import { PickerStyles as pickerStyles } from "./picker.styles";
import { PickerMenuStyles as pickerMenuStyles } from "./picker-menu.styles";
import { PickerListStyles as pickerListStyles } from "./picker-list.styles";

const itemTemplate: ViewTemplate = html`
    <button
        role="listitem"
        tabindex="0"
        @click="${(x, c) => c.parent.handleItemClick(c.event as MouseEvent, c.index)}"
        @keydown="${(x, c) =>
            c.parent.handleItemKeyDown(c.event as KeyboardEvent, c.index)}"
    >
        ${x => x}
    </button>
`;

const optionTemplate: ViewTemplate = html`
    <button
        role="listitem"
        tabindex="-1"
        @click="${(x, c) => c.parent.handleOptionClick(c.event as MouseEvent, x)}"
    >
        ${x => x}
    </button>
`;

/**
 * The FAST  Picker Custom Element. Implements {@link @microsoft/fast-foundation#Picker},
 * {@link @microsoft/fast-foundation#PickerTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-picker\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
@customElement({
    name: "fast-picker",
    template: createPickerTemplate("fast", itemTemplate, optionTemplate),
    styles: pickerStyles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTPicker extends Picker {}

/**
 * Styles for Picker
 * @public
 */
export const PickerStyles = pickerStyles;

/**
 *
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-picker-menu\>
 *
 */
@customElement({
    name: "fast-picker-menu",
    template: createPickerMenuTemplate("fast"),
    styles: pickerMenuStyles,
})
export class FASTPickerMenu extends PickerMenu {}

/**
 * Styles for PickerMenu
 * @public
 */
export const PickerMenuStyles = pickerMenuStyles;

/**
 *
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-picker-list\>
 *
 */
@customElement({
    name: "fast-picker-list",
    template: createPickerListTemplate("fast"),
    styles: pickerListStyles,
})
export class FASTPickerList extends PickerList {}

/**
 * Styles for PickerList
 * @public
 */
export const PickerListStyles = pickerListStyles;
