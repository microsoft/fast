import { Radio, RadioTemplate as template } from "@microsoft/fast-foundation";
import { RadioStyles as styles } from "./radio.styles";

/**
 * The FAST Radio Element. Implements {@link @microsoft/fast-foundation#Radio},
 * {@link @microsoft/fast-foundation#RadioTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-radio\>
 */
export const FASTRadio = Radio.compose({
    baseName: "radio",
    template,
    styles,
});

/**
 * Styles for Radio
 * @public
 */
export const RadioStyles = styles;
