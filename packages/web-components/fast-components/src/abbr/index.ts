import { Abbr, abbrTemplate as template } from "@microsoft/fast-foundation";
import { abbrStyles as styles } from "./abbr.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Abbr} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#abbrTemplate} and {@link @microsoft/fast-foundation#Abbr:class}.
 *
 *
 * @public
 * @remarks
 * Generates the HTML Element: \<fast-abbr\>
 */
export const fastAbbr = Abbr.compose({
    baseName: "abbr",
    template,
    styles,
});
