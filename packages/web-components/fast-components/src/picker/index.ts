import {
    Picker,
    PickerList,
    pickerListTemplate,
    PickerMenu,
    pickerMenuTemplate,
    pickerTemplate,
} from "@microsoft/fast-foundation";
import { pickerStyles } from "./picker.styles";
import { pickerMenuStyles } from "./picker-menu.styles";
import { pickerListStyles } from "./picker-list.styles";

/**
 * The FAST  Picker Custom Element. Implements {@link @microsoft/fast-foundation#Picker},
 * {@link @microsoft/fast-foundation#PickerTemplate}
 *
 *
 * @public
 * @remarks
 * * Generates HTML Element: \<fast-picker\>
 */
export const fastPicker = Picker.compose({
    baseName: "picker",
    template: pickerTemplate,
    styles: pickerStyles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

/**
 * Styles for Picker
 * @public
 */
export const PickerStyles = pickerStyles;

/**
 * Base class for Picker
 * @public
 */
export { Picker };

/**
 *
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-picker-menu\>
 */
export const fastPickerMenu = PickerMenu.compose({
    baseName: "picker-menu",
    template: pickerMenuTemplate,
    styles: pickerMenuStyles,
});
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
export const fastPickerList = PickerList.compose({
    baseName: "picker-list",
    template: pickerListTemplate,
    styles: pickerListStyles,
    shadowOptions: null,
});
export class FASTPickerList extends PickerList {}

/**
 * Styles for PickerList
 * @public
 */
export const PickerListStyles = pickerListStyles;
