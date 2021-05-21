import { ColorPicker } from "./color-picker";
import { ColorPickerTemplate as template } from "./color-picker.template";
import { colorPickerStyles as styles } from "./color-picker.styles";

/**
 *
 * @public
 * @remarks
 * HTML Element: \<color-picker\>
 */
export const fastToolingColorPicker = ColorPicker.compose({
    baseName: "color-picker",
    template,
    styles,
});
