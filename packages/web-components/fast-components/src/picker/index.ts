import {
    PickerMenu as FoundationPickerMenu,
    Picker,
    PickerList,
    PickerListItem,
    pickerListItemTemplate,
    pickerListTemplate,
    PickerMenuOption,
    pickerMenuOptionTemplate,
    pickerMenuTemplate,
    pickerTemplate,
} from "@microsoft/fast-foundation";
import { fillColor, neutralLayerFloating } from "../design-tokens";
import { pickerStyles } from "./picker.styles";
import { pickerMenuStyles } from "./picker-menu.styles";
import { pickerMenuOptionStyles } from "./picker-menu-option.styles";
import { pickerListStyles } from "./picker-list.styles";
import { pickerListItemStyles } from "./picker-list-item.styles";

/**
 * The FAST picker menu class
 * @public
 */
export class PickerMenu extends FoundationPickerMenu {
    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        fillColor.setValueFor(this, neutralLayerFloating);
    }
}

/**
 * The FAST  Picker Custom Element. Implements {@link @microsoft/fast-foundation#Picker},
 * {@link @microsoft/fast-foundation#PickerTemplate}
 *
 *
 * @alpha
 * @remarks
 * * Generates HTML Element: `<fast-picker>`
 */
export const fastPicker = Picker.compose({
    baseName: "picker",
    template: pickerTemplate,
    styles: pickerStyles,
    shadowOptions: {},
});

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
    baseClass: FoundationPickerMenu,
    template: pickerMenuTemplate,
    styles: pickerMenuStyles,
});

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
});

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

export { pickerStyles, pickerListItemStyles, pickerMenuOptionStyles, pickerMenuStyles };
