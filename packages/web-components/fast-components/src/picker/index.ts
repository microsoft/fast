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
 * HTML Element: \<fast-picker-menu-option\>
 */
export const fastPickerMenuOption = PickerMenuOption.compose({
    baseName: "picker-menu-option",
    template: pickerMenuOptionTemplate,
    styles: pickerMenuOptionStyles,
});
export class FASTPickerMenuOption extends PickerMenuOption {}

/**
 * Styles for PickerMenuOption
 * @public
 */
export const PickerMenuOptionStyles = pickerMenuOptionStyles;

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

/**
 *
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-picker-list-item\>
 */
export const fastPickerListItem = PickerListItem.compose({
    baseName: "picker-list-item",
    template: pickerListItemTemplate,
    styles: pickerListItemStyles,
});
export class FASTPickerListItem extends PickerListItem {}

/**
 * Styles for PickerListItem
 * @public
 */
export const PickerListItemStyles = pickerListItemStyles;
