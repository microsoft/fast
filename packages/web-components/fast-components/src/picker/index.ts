import {
    Picker,
    PickerList,
    PickerListItem,
    pickerListItemTemplate,
    pickerListTemplate,
    PickerMenu,
    PickerMenuOption,
    pickerMenuOptionTemplate,
    pickerMenuTemplate,
    pickerTemplate,
} from "@microsoft/fast-foundation";
import { pickerStyles } from "./picker.styles";
import { pickerMenuStyles } from "./picker-menu.styles";
import { pickerMenuOptionStyles } from "./picker-menu-option.styles";
import { pickerListStyles } from "./picker-list.styles";
import { pickerListItemStyles } from "./picker-list-item.styles";

/**
 * The FAST  Picker Custom Element. Implements {@link @microsoft/fast-foundation#Picker},
 * {@link @microsoft/fast-foundation#PickerTemplate}
 *
 *
 * @alpha
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
 * @alpha
 */
export { Picker };

/**
 * Component that displays the list of available picker options
 *
 *
 * @alpha
 * @remarks
 * HTML Element: \<fast-picker-menu\>
 */
export const fastPickerMenu = PickerMenu.compose({
    baseName: "picker-menu",
    template: pickerMenuTemplate,
    styles: pickerMenuStyles,
});

/**
 * Styles for PickerMenu
 * @public
 */
export const PickerMenuStyles = pickerMenuStyles;

/**
 *  Component that displays available picker menu options
 *
 *
 * @alpha
 * @remarks
 * HTML Element: \<fast-picker-menu-option\>
 */
export const fastPickerMenuOption = PickerMenuOption.compose({
    baseName: "picker-menu-option",
    template: pickerMenuOptionTemplate,
    styles: pickerMenuOptionStyles,
});

/**
 * Styles for PickerMenuOption
 * @public
 */
export const PickerMenuOptionStyles = pickerMenuOptionStyles;

/**
 * Component that displays the list of selected picker items along
 * with the input combobox
 *
 * @alpha
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

/**
 * Styles for PickerList
 * @public
 */
export const PickerListStyles = pickerListStyles;

/**
 * Component that displays selected items
 *
 * @alpha
 * @remarks
 * HTML Element: \<fast-picker-list-item\>
 */
export const fastPickerListItem = PickerListItem.compose({
    baseName: "picker-list-item",
    template: pickerListItemTemplate,
    styles: pickerListItemStyles,
});

/**
 * Styles for PickerListItem
 * @public
 */
export const PickerListItemStyles = pickerListItemStyles;
