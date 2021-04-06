import {
    ListboxOption,
    ListboxOptionTemplate as template,
} from "@microsoft/fast-foundation";
import { OptionStyles as styles } from "./listbox-option.styles";

/**
 * The FAST option Custom Element. Implements {@link @microsoft/fast-foundation#ListboxOption}
 * {@link @microsoft/fast-foundation#ListboxOptionTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-option\>
 *
 */
export const FASTOption = ListboxOption.compose({
    baseName: "option",
    template,
    styles,
});

/**
 * Styles for Option
 * @public
 */
export const OptionStyles = styles;
